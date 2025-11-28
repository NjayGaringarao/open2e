export interface SentenceScore {
  score: number;
  sentence: string;
}

export interface AIDetectionData {
  overall_score: number;
  sentence_scores: SentenceScore[];
  tokens: string[];
  token_probs: number[];
  message: string;
  error?: string;
}

export interface AIDetectionResult {
  id?: number;
  overall_score: number;
  sentence_scores: SentenceScore[];
  tokens: string[];
  token_probs: number[];
  message: string;
  error?: string;
}
