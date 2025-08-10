export type Name = {
  first: string;
  middle: string;
  last: string;
};

export interface TTSConfig {
  rate: number;
  pitch: number;
  volume: number;
  voiceIndex: number;
}
