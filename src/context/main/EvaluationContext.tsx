import React, { createContext } from "react";
import { Article, SheetData } from "@/types/evaluation";
import { Rubric } from "@/database/rubric";

export type Question = {
  tracked: string;
  committed: string;
};

export interface EvaluationContextType {
  question: Question;
  updateQuestion: React.Dispatch<React.SetStateAction<Question>>;
  sheet: SheetData;
  updateSheet: React.Dispatch<React.SetStateAction<SheetData>>;
  evaluateSheet: () => Promise<void>;
  saveSheet: () => Promise<void>;
  clearSheet: () => void;
  suggestedQuery?: string;
  isLoading: boolean;
  articleList: Article[];
  selectedRubric: Rubric | null;
  updateSelectedRubric: (rubric: Rubric | null) => void;
}

export const EvaluationContext = createContext<
  EvaluationContextType | undefined
>(undefined);
