import { ReactNode, useState, useEffect } from "react";
import { EvaluationContext, Question } from "./EvaluationContext";
import { Article, Result, SheetData } from "@/types/evaluation";
import { DEFAULT_LEARNERSHEET } from "@/constant/default";
import { useSettings } from "./settings";
import * as openai from "@/lib/openai";
import * as ollama from "@/lib/ollama";
import { useDialog } from "@/context/dialog";
import { add } from "@/database/evaluation";
import { insertAIDetection } from "@/database/aiDetection";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { LOCAL_MODEL, ONLINE_MODEL } from "@/constant/llmModel";
import { useAnalyticsContext } from "./analytics/AnalyticsContext";
import { useRubric } from "./rubric";
import { Rubric } from "@/database/rubric";
import { MINIMUM_MEMORY } from "@/constant/memory";

export const EvaluationProvider = ({ children }: { children: ReactNode }) => {
  const { status } = useConnectionStatus();
  const { triggerRefresh } = useAnalyticsContext();
  const { systemMemory } = useSettings();
  const { alert } = useDialog();
  const { rubrics } = useRubric();
  const [isLoading, setIsLoading] = useState(false);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [question, setQuestion] = useState<Question>({
    tracked: "",
    committed: "",
  });
  const [sheet, setSheet] = useState<SheetData>(DEFAULT_LEARNERSHEET);
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);

  // Load default rubric on mount
  useEffect(() => {
    if (rubrics.length > 0 && !selectedRubric) {
      // Set the first rubric (default) as selected
      console.log("Setting default rubric:", rubrics[0].name);
      setSelectedRubric(rubrics[0]);
    }
  }, [rubrics]);

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

    let evaluation: Result | null = null;

    // Implementation of evaluation using openai
    const evaluateOnline = async (): Promise<Result | null> => {
      console.log(
        "Evaluating with rubric:",
        selectedRubric?.name,
        "Content:",
        selectedRubric?.content?.substring(0, 100) + "..."
      );
      const { result, error } = await openai.evaluate({
        question: question.tracked,
        answer: sheet.trackedAnswer,
        rubric: selectedRubric?.content,
        totalScore: selectedRubric?.total_score || 10,
      });

      if (error || !result) {
        // Use Offline evaluation instead
        return evaluateOffline();
      }

      return result;
    };

    // Implementation of evaluation using ollama
    const evaluateOffline = async (): Promise<Result | null> => {
      // Check system memory before proceeding
      if (systemMemory < MINIMUM_MEMORY) {
        alert({
          title: "Evaluation Failed",
          description:
            "Not enough system memory. Please connect to the internet.",
        });
        return null;
      }
      console.log(
        "Evaluating with rubric (Ollama):",
        selectedRubric?.name,
        "Content:",
        selectedRubric?.content?.substring(0, 100) + "..."
      );
      const { result, error } = await ollama.evaluate({
        question: question.tracked,
        answer: sheet.trackedAnswer,
        rubric: selectedRubric?.content,
        totalScore: selectedRubric?.total_score || 10,
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

    let aiDetectionId: number | undefined;

    // First, insert AI detection data if available
    if (sheet.aiDetectionData) {
      const { id, error: aiError } = await insertAIDetection(
        sheet.aiDetectionData
      );
      if (aiError) {
        alert({
          title: "AI Detection Save Failed",
          description: "There was an error saving AI detection data.",
          mode: "ERROR",
        });
        setIsLoading(false);
        return;
      }
      aiDetectionId = id;
    }

    const { error } = await add({
      question: question.committed,
      answer: sheet.committedAnswer,
      score: sheet.score,
      justification: sheet.justification,
      llm_model: status === "ONLINE" ? ONLINE_MODEL : LOCAL_MODEL,
      ai_detection_id: aiDetectionId,
      rubric_id: selectedRubric?.id || 1,
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
    <EvaluationContext.Provider
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
        selectedRubric,
        updateSelectedRubric: (rubric) => {
          console.log("Rubric selection changed to:", rubric?.name);
          setSelectedRubric(rubric);
        },
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
