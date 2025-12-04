export interface ScoreBracket {
  id: string;
  minScore: number;
  maxScore: number;
  criteria: string;
}

export interface RubricExampleForm {
  id?: number; // For existing examples
  question: string;
  answer: string;
  score: number;
  justification: string;
  suggested_query: string;
  isNew?: boolean; // For tracking new examples
  isModified?: boolean; // For tracking modified examples
}

export interface RubricForm {
  name: string;
  totalScore: number;
  brackets: ScoreBracket[];
  note?: string;
  examples?: RubricExampleForm[];
}
