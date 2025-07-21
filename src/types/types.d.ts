import { Student } from "./models";

//#region Dialog

type AlertMode = "INFO" | "SUCCESS" | "ERROR";
type ConfirmMode = "DEFAULT" | "CRITICAL";

type AlertOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  mode?: AlertMode;
  backdropOnClose?: boolean;
  displayTime?: number;
};

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  mode?: ConfirmMode;
};

export type DialogContextType = {
  alert: (options: AlertOptions) => Promise<void>;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

//#region Evaluation

export type AnswerSheetProp = {
  id: string;
  question: string;
  answer: string;
  score: string;
  justification: string;
  isSaved: string;
  student: Student;
};

//#region Context

export type StudentContextType = {
  studentList: Student[];
  fetchStudentList: () => Promise<void>;
};

//#region Data Types

export type Name = {
  first : string,
  middle? : string,
  last: string
}

export type UserRole = "LEARNER" | "EVALUATOR" | undefined
export type LLMSource = "INTERNET" | "LOCAL" | undefined
