import { useEvaluatorContext } from "./EvaluatorContext";
import { EvaluatorSheet, EvaluationStatus } from "@/types/evaluation/evaluator";

export const useEvaluator = () => {
  const { state, dispatch } = useEvaluatorContext();

  const setQuestion = (question: string) => {
    dispatch({ type: "SET_QUESTION", payload: question });
  };

  const addSheet = (sheet: EvaluatorSheet) => {
    dispatch({ type: "ADD_SHEET", payload: sheet });
  };

  const removeSheet = (id: string) => {
    dispatch({ type: "REMOVE_SHEET", payload: id });
  };

  const updateSheet = (id: string, data: Partial<EvaluatorSheet>) => {
    dispatch({ type: "UPDATE_SHEET", payload: { id, data } });
  };

  const setSheetStatus = (id: string, status: EvaluationStatus) => {
    dispatch({ type: "SET_SHEET_STATUS", payload: { id, status } });
  };

  const lockQuestion = () => dispatch({ type: "LOCK_QUESTION" });
  const unlockQuestion = () => dispatch({ type: "UNLOCK_QUESTION" });

  const saveSheet = (id: string) => {
    dispatch({
      type: "SET_SHEET_SAVE_STATE",
      payload: { id, isEvaluationSaved: true },
    });

    // TODO: Implement saving evaluation : state.question and sheet matched id
  };

  const saveAllSheet = async () => {
    // Simulated saving logic — you’ll replace this later

    console.log("Saving evaluator data:", state);
  };

  const evaluateSheet = async (
    sheet_id: string
  ): Promise<EvaluatorSheet | null> => {
    const sheet = state.sheets.find((u) => u.id === sheet_id);
    if (!sheet || sheet.status === "EVALUATING") return null;

    dispatch({
      type: "SET_SHEET_STATUS",
      payload: { id: sheet.id, status: "EVALUATING" },
    });

    await new Promise((r) => setTimeout(r, 200));

    const updatedData: Partial<EvaluatorSheet> = {
      score: Math.floor(Math.random() * 10),
      justification: "Auto-evaluated.",
      status: "EVALUATED",
    };

    dispatch({
      type: "UPDATE_SHEET",
      payload: {
        id: sheet.id,
        data: updatedData,
      },
    });

    if (state.sheets.some((s) => s.status === "EVALUATED")) {
      lockQuestion();
    }

    return {
      ...sheet,
      ...updatedData,
    };
  };

  const evaluateAllSheet = async () => {
    for (const sheet of state.sheets) {
      if (sheet.status === "EVALUATED") continue;
      dispatch({
        type: "SET_SHEET_STATUS",
        payload: { id: sheet.id, status: "EVALUATING" },
      });
      // Simulated async eval
      await new Promise((r) => setTimeout(r, 200));
      dispatch({
        type: "UPDATE_SHEET",
        payload: {
          id: sheet.id,
          data: {
            score: Math.floor(Math.random() * 10),
            justification: "Auto-evaluated.",
            status: "EVALUATED",
          },
        },
      });
    }

    // Lock if at least one evaluated
    if (state.sheets.some((s) => s.status === "EVALUATED")) {
      lockQuestion();
    }
  };

  return {
    state,
    setQuestion,
    addSheet,
    removeSheet,
    updateSheet,
    setSheetStatus,
    evaluateSheet,
    evaluateAllSheet,
    saveSheet,
    saveAllSheet,
    lockQuestion,
    unlockQuestion,
  };
};
