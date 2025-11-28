export interface AnalyticsSummary {
  totalAnswers: number;
  overallAverageScore: number;
  averageScorePerQuestion: QuestionScore[];
  evaluationsOverTime: EvaluationTimeData[];
  // AI Detection metrics
  aiDetectionMetrics: {
    totalWithAIDetection: number;
    averageAIScore: number;
    highRiskCount: number; // >85%
    mediumRiskCount: number; // 60-84%
    lowRiskCount: number; // <60%
    aiDetectionRate: number; // percentage
  };
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
  rubricId: number;
  rubricName: string;
  rubricContent: string;
  totalScore: number;
  justification: string | null;
  llmModel: string;
  timestamp: string;
  // AI Detection fields
  aiDetectionId: number | null;
  aiDetectionData?: {
    overall_score: number;
    sentence_scores: Array<{ score: number; sentence: string }>;
    tokens: string[];
    token_probs: number[];
    message: string;
  } | null;
}
