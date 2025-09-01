import { ReactNode, useState } from "react";
import { LearnerContext, Question } from "./LearnerContext";
import {
  Article,
  LearnerResult,
  LearnerSheetData,
} from "@/types/evaluation/learner";
import { DEFAULT_LEARNERSHEET } from "@/constant/default";
import { useSettings } from "../settings";
import * as openai from "@/lib/openai";
import * as ollama from "@/lib/ollama";
import { useDialog } from "@/context/dialog";
import { add } from "@/database/evaluation/learner";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { LOCAL_MODEL, ONLINE_MODEL } from "@/constant/llmModel";
import { useAnalyticsContext } from "../analytics/AnalyticsContext";

export const LearnerProvider = ({ children }: { children: ReactNode }) => {
  const status = useConnectionStatus();
  const { triggerRefresh } = useAnalyticsContext();
  const { systemMemory } = useSettings();
  const { alert } = useDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [question, setQuestion] = useState<Question>({
    tracked: "",
    committed: "",
  });
  const [sheet, setSheet] = useState<LearnerSheetData>(DEFAULT_LEARNERSHEET);

  const loadArticles = async (suggestedQuery: string) => {
    // Implementation of article query using Openai
    const fetchArticles = async () => {
      const { articles, error } = await openai.getArticles(suggestedQuery);

      if (error || articles.length === 0) {
        const query = suggestedQuery;
        const encoded = encodeURIComponent(query);
        const url = `https://www.google.com/search?q=${encoded}`;

        setArticleList([
          {
            title: "Failed to Search",
            subtitle:
              "Click this to directly open your browser for suggested query",
            url: url,
          },
        ]);
      } else {
        setArticleList(articles);
      }
    };

    if (question.committed !== question.tracked || articleList.length === 0) {
      if (status === "ONLINE") {
        await fetchArticles();
      } else {
        setArticleList([
          {
            title: "Google",
            subtitle: `Search: ${suggestedQuery}`,
            url: `https://www.google.com/search?q=${suggestedQuery}`,
          },
        ]);
      }
    }
  };

  const evaluateSheet = async () => {
    setIsLoading(true);

    let evaluation: LearnerResult | null = null;

    // Implementation of evaluation using openai
    const evaluateOnline = async (): Promise<LearnerResult | null> => {
      const { result, error } = await openai.evaluate({
        question: question.tracked,
        answer: sheet.trackedAnswer,
      });

      if (error || !result) {
        // Use Offline evaluation instead
        return evaluateOffline();
      }

      return result;
    };

    // Implementation of evaluation using ollama
    const evaluateOffline = async (): Promise<LearnerResult | null> => {
      // Check system memory before proceeding
      if (systemMemory < 8) {
        alert({
          title: "Evaluation Failed",
          description:
            "Not enough system memory. Please connect to the internet.",
        });
      }
      const { result, error } = await ollama.evaluate({
        question: question.tracked,
        answer: sheet.trackedAnswer,
      });

      if (error || !result) {
        alert({
          title: "Evaluation Failed",
          description: !result
            ? "Evaluation Failed. Please try again."
            : `${error}`,
          mode: "ERROR",
        });
        return null;
      }

      return result;
    };

    if (status === "ONLINE") {
      evaluation = await evaluateOnline();
    } else {
      evaluation = await evaluateOffline();
    }

    evaluation && (await loadArticles(evaluation.suggested_query));
    setIsLoading(false);

    if (evaluation === null) return;

    // If no error occur, commit the trackedAnswer, question.tracked, and scores
    setQuestion((prev) => ({ ...prev, committed: prev.tracked }));
    setSheet((prev) => ({
      ...prev,
      isEvaluationSaved: false,
      committedAnswer: prev.trackedAnswer,
      score: evaluation.result.score,
      justification: evaluation.result.justification,
    }));
  };

  const saveSheet = async () => {
    if (sheet.score === null) return;
    setIsLoading(true);

    const { error } = await add({
      question: question.committed,
      answer: sheet.committedAnswer,
      score: sheet.score,
      justification: sheet.justification,
      llm_model: status === "ONLINE" ? ONLINE_MODEL : LOCAL_MODEL,
      detected_ai: sheet.detectedAI,
    });

    if (error) {
      alert({
        title: "Save Failed",
        description: "There was an error saving the evaluation.",
        mode: "ERROR",
      });
    } else {
      setSheet((prev) => ({ ...prev, isEvaluationSaved: true }));
      triggerRefresh();
      alert({
        title: "Evaluation Saved",
        description: "Your evaluation has been saved and analytics updated.",
        mode: "SUCCESS",
      });
    }
    setIsLoading(false);
  };

  const clearSheet = () => {
    setSheet(DEFAULT_LEARNERSHEET);
  };

  return (
    <LearnerContext.Provider
      value={{
        question,
        updateQuestion: setQuestion,
        isLoading,
        sheet,
        updateSheet: setSheet,
        evaluateSheet,
        saveSheet,
        clearSheet,
        articleList,
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
};
