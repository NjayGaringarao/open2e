import { useContext } from "react";
import { EvaluationContext } from "./EvaluationContext";

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context)
    throw new Error("useEvaluation must be used within a EvaluationProvider");
  return context;
};
