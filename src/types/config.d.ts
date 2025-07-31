export type Name = {
  first: string;
  middle: string;
  last: string;
};

export type UserRole = "LEARNER" | "EVALUATOR" | undefined;
export type LLMSource = "INTERNET" | "LOCAL" | undefined;

export interface TTSConfig {
  rate: number;
  pitch: number;
  volume: number;
  voiceIndex: number;
}
