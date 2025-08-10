import { ReactNode, useState } from "react";
import { LearnerContext, Question } from "./LearnerContext";
import {
  Article,
  LearnerResult,
  LearnerSheetData,
} from "@/types/evaluation/learner";
import { DEFAULT_LEARNERSHEET } from "@/constant/default";
import { useSettings } from "../settings";
import { getArticles } from "@/lib/openai/article";
import { evaluate } from "@/lib/openai/evaluate";
import { useDialog } from "@/context/dialog";
import { add } from "@/database/evaluation/learner";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { LOCAL_MODEL, ONLINE_MODEL } from "@/constant/llmModel";

const MOCK_ARTICLE: Article[] = [
  {
    title: "Understanding the Evolution of RAM: From SDR to DDR5",
    subtitle:
      "A comprehensive overview of the progression from Single Data Rate to Double Data Rate 5 memory technologies.",
    url: "https://www.decodeit.co.ke/ram.html",
  },
  {
    title: "Youtube",
    subtitle: "This is just a mock Article",
    url: "https://youtube.com",
  },
  {
    title: "DDR5 SDRAM: The Next Generation of Memory",
    subtitle:
      "An in-depth look at DDR5 SDRAM, its features, and how it compares to previous generations.",
    url: "https://en.wikipedia.org/wiki/DDR5_SDRAM",
  },
  {
    title:
      "RAM Buying & Usage Guide | DDR4, DDR5 RAM Recommendations | DRAM, SDRAM, DDR RAM, Memory | RAM Overclocking - OC | Product Guides - Bite Sized Tech",
    subtitle:
      "A guide to understanding different RAM technologies, their generations, and recommendations for DDR4 and DDR5 RAM.",
    url: "https://bitesizedtech.com/post/ram-buying-usage-guide-ddr4-ddr5-ram-recommendations-dram-overclocking/",
  },
];

export const LearnerProvider = ({ children }: { children: ReactNode }) => {
  const status = useConnectionStatus();
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
    const fetchArticlesUsingOpenai = async () => {
      const { articles, error } = await getArticles(suggestedQuery);

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

    // Implementation of article query using Ollama
    const fetchArticlesUsingOllama = async () => {
      // TODO: Implement Ollama Article Fetch
      // FOR NOW: Simulating Ollama Article Fetch
      await new Promise((r) => setTimeout(r, 200));
      setArticleList(MOCK_ARTICLE);
    };

    if (question.committed !== question.tracked || articleList.length === 0) {
      if (status === "ONLINE") {
        await fetchArticlesUsingOpenai();
      } else {
        await fetchArticlesUsingOllama();
      }
    }
  };

  const evaluateSheet = async () => {
    setIsLoading(true);

    let evaluation: LearnerResult | null = null;

    // Implementation of evaluation using openai
    const evaluateUsingOpenai = async (): Promise<LearnerResult | null> => {
      const { result, error } = await evaluate({
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

    // Implementation of evaluation using ollama
    // TODO: Implement evaluation using ollama api
    // FOR NOW: Mock Evaluation:
    const evaluateUsingOllama = async (): Promise<LearnerResult> => {
      // Check system memory before proceeding
      if (systemMemory < 8) {
        alert({
          title: "Evaluation Failed",
          description:
            "Not enough system memory. Please connect to the internet.",
        });
      }
      await new Promise((r) => setTimeout(r, 200));
      return {
        result: {
          score: Math.floor(Math.random() * 10),
          justification: "Auto-evaluated.",
        },
        suggested_query: "This is suggested query",
      };
    };

    if (status === "ONLINE") {
      evaluation = await evaluateUsingOpenai();
    } else {
      evaluation = await evaluateUsingOllama();
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
