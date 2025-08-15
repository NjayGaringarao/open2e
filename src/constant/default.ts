import { LearnerSheetData } from "@/types/evaluation/learner";

export const DEFAULT_LEARNERSHEET: LearnerSheetData = {
  id: "",
  trackedAnswer: "",
  committedAnswer: "",
  score: null,
  justification: "",
  isEvaluationSaved: false,
};
