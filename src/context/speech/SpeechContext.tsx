import { createContext } from "react";

export type SpeechContextType = {
  talk: (text: string) => Promise<void>;
  cancelTalk: () => void;
  listen: () => Promise<string>;
  ask: (question: string) => Promise<boolean | null>;
  cancelAsk: () => void;
};

export const SpeechContext = createContext<SpeechContextType | undefined>(
  undefined
);
