import React, { createContext, useContext } from "react";
import { EvaluatorState, EvaluatorAction } from "@/types/evaluation/evaluator";
import { initialState } from "./EvaluatorProvider";

export const EvaluatorContext = createContext<{
  state: EvaluatorState;
  dispatch: React.Dispatch<EvaluatorAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

export const useEvaluatorContext = () => useContext(EvaluatorContext);
