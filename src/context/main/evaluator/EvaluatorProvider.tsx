import { EvaluatorAction, EvaluatorState } from "@/types/evaluation/evaluator";
import { ReactNode, useReducer } from "react";
import { EvaluatorContext } from "./EvaluatorContext";

export const initialState: EvaluatorState = {
  question: "",
  isLocked: false,
  sheets: [],
};

function evaluatorReducer(
  state: EvaluatorState,
  action: EvaluatorAction
): EvaluatorState {
  switch (action.type) {
    case "SET_QUESTION":
      return { ...state, question: action.payload };

    case "ADD_SHEET":
      return { ...state, sheets: [...state.sheets, action.payload] };

    case "REMOVE_SHEET":
      return {
        ...state,
        sheets: state.sheets.filter((sheet) => sheet.id !== action.payload),
      };

    case "UPDATE_SHEET":
      return {
        ...state,
        sheets: state.sheets.map((sheet) =>
          sheet.id === action.payload.id
            ? { ...sheet, ...action.payload.data }
            : sheet
        ),
      };

    case "SET_SHEET_STATUS":
      return {
        ...state,
        sheets: state.sheets.map((sheet) =>
          sheet.id === action.payload.id
            ? { ...sheet, status: action.payload.status }
            : sheet
        ),
      };

    case "SET_SHEET_SAVE_STATE":
      return {
        ...state,
        sheets: state.sheets.map((sheet) =>
          sheet.id === action.payload.id
            ? { ...sheet, isEvaluationSaved: action.payload.isEvaluationSaved }
            : sheet
        ),
      };

    case "SET_ALL_SHEETS_STATUS":
      return {
        ...state,
        sheets: state.sheets.map((sheet) => ({
          ...sheet,
          status: action.payload,
        })),
      };

    case "LOCK_QUESTION":
      return { ...state, isLocked: true };

    case "UNLOCK_QUESTION":
      return { ...state, isLocked: false };

    case "RESET_EVALUATOR":
      return initialState;

    default:
      return state;
  }
}

export const EvaluatorProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(evaluatorReducer, initialState);

  return (
    <EvaluatorContext.Provider value={{ state, dispatch }}>
      {children}
    </EvaluatorContext.Provider>
  );
};
