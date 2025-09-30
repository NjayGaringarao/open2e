export interface AnalyticsSummary {
  totalAnswers: number;
  overallAverageScore: number;
  averageScorePerQuestion: QuestionScore[];
  evaluationsOverTime: EvaluationTimeData[];
}

export interface QuestionScore {
  questionId: number;
  questionContent: string;
  averageScore: number;
  totalEvaluations: number;
}

export interface EvaluationTimeData {
  date: string;
  count: number;
  averageScore: number;
}

export interface EvaluationData {
  id: number;
  questionId: number;
  questionContent: string;
  answer: string;
  score: number;
  rubric: string;
  totalScore: number;
  justification: string | null;
  llmModel: string;
  timestamp: string;
}
