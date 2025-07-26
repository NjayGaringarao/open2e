import { Student } from "@/models";
import { Name } from "./config";

export type EvaluationStatus = "NOT_EVALUATED" | "EVALUATING" | "EVALUATED";

export type EvaluatorSheet = {
  id: string;
  student: Student;
  trackedAnswer: string;
  committedAnswer: string;
  score?: number;
  justification?: string;
  status: "NOT_EVALUATED" | "EVALUATING" | "EVALUATED";
  isEvaluationSaved: boolean;
};

export type EvaluatorState = {
  question: string;
  isLocked: boolean;
  sheets: EvaluatorSheet[];
};

export type EvaluatorAction =
  | { type: "SET_QUESTION"; payload: string }
  | { type: "ADD_SHEET"; payload: EvaluatorSheet }
  | { type: "REMOVE_SHEET"; payload: string } // sheet ID
  | {
      type: "UPDATE_SHEET";
      payload: { id: string; data: Partial<EvaluatorSheet> };
    }
  | {
      type: "SET_SHEET_STATUS";
      payload: { id: string; status: EvaluationStatus };
    }
  | {
      type: "SET_SHEET_SAVE_STATE";
      payload: { id: string; isEvaluationSaved: boolean };
    }
  | { type: "SET_ALL_SHEETS_STATUS"; payload: EvaluationStatus }
  | { type: "LOCK_QUESTION" }
  | { type: "UNLOCK_QUESTION" }
  | { type: "RESET_EVALUATOR" };

export type EvaluatorResult = {
  result: {
    score: number;
    justification: string;
  };
  error?: string | null;
};
