import { ReactNode, useState } from "react";
import { LearnerContext, Question } from "./LearnerContext";
import {
  Article,
  LearnerResult,
  LearnerSheetData,
} from "@/types/evaluation/learner";
import { DEFAULT_LEARNERSHEET } from "@/constant/default";

export const LearnerProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [question, setQuestion] = useState<Question>({
    tracked: "",
    committed: "",
  });
  const [sheet, setSheet] = useState<LearnerSheetData>(DEFAULT_LEARNERSHEET);

  const loadArticles = async (suggestedQuery: string) => {
    if (question.committed !== question.tracked || articleList.length === 0) {
      // load articles via openai or search + ollama depending on
      setArticleList([
        {
          title: "Google",
          subtitle: "This is just a mock Article",
          url: "https://google.com",
        },
        {
          title: "Youtube",
          subtitle: "This is just a mock Article",
          url: "https://youtube.com",
        },
        {
          title: "OpenAI launches GPT-4o",
          subtitle: "A new frontier in multi-modal AI capabilities.",
          url: "https://openai.com/index/gpt-4o",
        },
        {
          title: "Faceboook",
          subtitle: "This is just a mock Article",
          url: "https://facebook.com",
        },
      ]);
    }
  };

  const evaluateSheet = async () => {
    setIsLoading(true);

    // TODO: determine the llmSource from useSettings hook
    // TODO: run evaluation basing on llmSource on which pipeline to run
    // EXAMPLE if llmSource is ONLINE: await evaluate("LEARNER", openaiAPIKey!, {question: question.comitted, answer: sheet.trackedAnswer})
    await new Promise((r) => setTimeout(r, 200));
    const evaluation: LearnerResult = {
      // Mock Evaluation
      result: {
        score: Math.floor(Math.random() * 10),
        justification: "Auto-evaluated.",
      },
      suggested_query: "This is suggested query",
    };

    await loadArticles(evaluation.suggested_query);
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
