import { ReactNode, useState } from "react";
import { LearnerContext } from "./LearnerContext";
import { LearnerResult, LearnerSheetData } from "@/types/evaluation/learner";
import { DEFAULT_LEARNERSHEET } from "@/constant/default";

export const LearnerProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [sheet, setSheet] = useState<LearnerSheetData>(DEFAULT_LEARNERSHEET);

  const evaluateSheet = async () => {
    setIsLoading(true);

    // TODO: determine the llmSource from useSettings hook
    // TODO: run evaluation basing on llmSource on which pipeline to run
    // EXAMPLE if llmSource is ONLINE: await evaluate("LEARNER", openaiAPIKey!, {question, answer: sheet.trackedAnswer})
    await new Promise((r) => setTimeout(r, 200));
    const evaluation: LearnerResult = {
      // Mock Evaluation
      result: {
        score: Math.floor(Math.random() * 10),
        justification: "Auto-evaluated.",
      },
      suggested_query: "This is suggested query",
    };

    // If no error occur, commit the trackedAnswer and update the scores
    setSheet((prev) => ({
      ...prev,
      isEvaluationSaved: false,
      committedAnswer: prev.trackedAnswer,
      score: evaluation.result.score,
      justification: evaluation.result.justification,
      suggested_query: evaluation.suggested_query,
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
        isLoading,
        sheet,
        setQuestion,
        updateSheet: setSheet,
        evaluateSheet,
        saveSheet,
        clearSheet,
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
};
