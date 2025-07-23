export type Name = {
  first: string;
  middle: string;
  last: string;
};

export type UserRole = "LEARNER" | "EVALUATOR" | undefined;
export type LLMSource = "INTERNET" | "LOCAL" | undefined;
