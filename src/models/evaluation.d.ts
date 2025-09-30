export type Evaluation = {
  id: number;
  question_id: number;
  respondent_id?: string;
  answer: string;
  score: number;
  rubric: string;
  total_score: number;
  justification: string;
  llm_model: string;
  timestamp: Date;
};
