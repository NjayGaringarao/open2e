import { ReactNode, useState } from "react";
import { LearnerContext, Question } from "./LearnerContext";
import {
  Article,
  LearnerResult,
  LearnerSheetData,
} from "@/types/evaluation/learner";
import { DEFAULT_LEARNERSHEET } from "@/constant/default";
import { useSettings } from "../settings";
import { fetchArticles } from "@/lib/openai/articles";
import { evaluate } from "@/lib/openai/evaluate";
import { useDialog } from "@/context/dialog";

export const LearnerProvider = ({ children }: { children: ReactNode }) => {
  const { openaiAPIKey, llmSource } = useSettings();
  const { alert } = useDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [question, setQuestion] = useState<Question>({
    tracked: "",
    committed: "",
  });
  const [sheet, setSheet] = useState<LearnerSheetData>(DEFAULT_LEARNERSHEET);

  const loadArticles = async (suggestedQuery: string) => {
    if (question.committed !== question.tracked || articleList.length === 0) {
      if (llmSource === "INTERNET" && openaiAPIKey) {
        // TODO: Uncomment the real implementation
        // and replace the dev code below if necessary for deployment or testing
        // const { articles, error } = await fetchArticles(
        //   openaiAPIKey,
        //   suggestedQuery
        // );

        // if (error || articles.length === 0) {
        //   const query = suggestedQuery;
        //   const encoded = encodeURIComponent(query);
        //   const url = `https://www.google.com/search?q=${encoded}`;

        //   setArticleList([
        //     {
        //       title: "Failed to Search",
        //       subtitle:
        //         "Click this to directly open your browser for suggested query",
        //       url: url,
        //     },
        //   ]);
        // } else {
        //   setArticleList(articles);
        // }

        // DEBUG:
        setArticleList([
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
        ]);
      } else {
        // TODO: Implement Ollama Article Fetch
        // FOR NOW: Simulating Ollama Article Fetch
        setArticleList([
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
        ]);
      }
    }
  };

  const evaluateSheet = async () => {
    setIsLoading(true);

    let evaluation: LearnerResult;
    try {
      if (llmSource === "INTERNET" && openaiAPIKey) {
        // TODO: Uncomment and replace the dev code below if it is ready to implement
        // const { result, error } = await evaluate("LEARNER", openaiAPIKey, {
        //   question: question.committed,
        //   answer: sheet.trackedAnswer,
        // });

        // if (error) throw error;

        // if (!result)
        //   throw "A model Doesn't return a response. Please try again.";

        // evaluation = result;

        // DEV:

        await new Promise((r) => setTimeout(r, 200));
        evaluation = {
          // Mock Evaluation
          result: {
            score: Math.floor(Math.random() * 10),
            justification: "Auto-evaluated.",
          },
          suggested_query: "This is suggested query",
        };
      } else {
        await new Promise((r) => setTimeout(r, 200));
        evaluation = {
          // Mock Evaluation
          result: {
            score: Math.floor(Math.random() * 10),
            justification: "Auto-evaluated.",
          },
          suggested_query: "This is suggested query",
        };
      }

      await loadArticles(evaluation.suggested_query);
    } catch (error) {
      alert({
        title: "Evaluation Failed",
        description: `${error}`,
        mode: "ERROR",
      });
    }

    setQuestion((prev) => ({ ...prev, committed: prev.tracked }));

    // If no error occur, commit the trackedAnswer and update the scores
    setSheet((prev) => ({
      ...prev,
      isEvaluationSaved: false,
      committedAnswer: prev.trackedAnswer,
      score: evaluation.result.score,
      justification: evaluation.result.justification,
    }));

    setIsLoading(false);
  };

  const saveSheet = async () => {
    setIsLoading(true);
    // TODO: Implement sqlite save
    await new Promise((r) => setTimeout(r, 200));
    // IF no error occured, update the state
    setSheet((prev) => ({ ...prev, isEvaluationSaved: true }));
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
