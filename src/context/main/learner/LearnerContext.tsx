import React, { createContext } from "react";
import { Article, LearnerSheetData } from "@/types/evaluation/learner";

export type Question = {
  tracked: string;
  committed: string;
};

export interface LearnerContextType {
  question: Question;
  updateQuestion: React.Dispatch<React.SetStateAction<Question>>;
  sheet: LearnerSheetData;
  updateSheet: React.Dispatch<React.SetStateAction<LearnerSheetData>>;
  evaluateSheet: () => Promise<void>;
  saveSheet: () => Promise<void>;
  clearSheet: () => void;
  suggestedQuery?: string;
  isLoading: boolean;
  articleList: Article[];
}

export const LearnerContext = createContext<LearnerContextType | undefined>(
  undefined
);
