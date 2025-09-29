import { useContext } from "react";
import { RubricContext } from "./RubricContext";

export const useRubric = () => {
  const ctx = useContext(RubricContext);
  if (!ctx) throw new Error("useRubric must be within a RubricProvider.");
  return ctx;
};
