export interface ScoreBracket {
  id: string;
  minScore: number;
  maxScore: number;
  criteria: string;
}

export interface RubricForm {
  name: string;
  totalScore: number;
  brackets: ScoreBracket[];
  note?: string;
}
