import React, { createContext } from "react";
import { LearnerSheetData } from "@/types/evaluation/learner";

export interface LearnerContextType {
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  sheet: LearnerSheetData;
  updateSheet: React.Dispatch<React.SetStateAction<LearnerSheetData>>;
  evaluateSheet: () => Promise<void>;
  saveSheet: () => Promise<void>;
  clearSheet: () => void;
  isLoading: boolean;
}

export const LearnerContext = createContext<LearnerContextType | undefined>(
  undefined
);
