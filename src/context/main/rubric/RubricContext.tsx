import { createContext } from "react";
import { Rubric } from "@/database/rubric";

export interface IRubricUpdate {
  rubrics?: Rubric[];
}

export type RubricContextType = {
  rubrics: Rubric[];
  loading: boolean;
  refreshRubrics: () => Promise<void>;
  addRubric: (rubric: Rubric) => void;
  removeRubric: (id: number) => void;
  updateRubric: (rubric: Rubric) => void;
};

export const RubricContext = createContext<RubricContextType | null>(null);
