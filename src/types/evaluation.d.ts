import { Student } from "@/models";

export type AnswerSheetProp = {
  id: string;
  question: string;
  answer: string;
  score: string;
  justification: string;
  isSaved: string;
  student: Student;
};

export type EvaluatorResult = {
  results: {
    score: number;
    justification: string;
  };
  error?: string | null;
};

export type LearnerResult = EvaluatorResult & {
  suggested_queries: string;
};
