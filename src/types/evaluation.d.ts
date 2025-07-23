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
