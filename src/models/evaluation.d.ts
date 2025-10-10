export type Evaluation = {
  id: number;
  question_id: number;
  respondent_id?: string;
  answer: string;
  score: number;
  rubric_id: number;
  justification: string;
  llm_model: string;
  created_at: Date;
};
