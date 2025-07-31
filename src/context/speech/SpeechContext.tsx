import { createContext } from "react";

export type SpeechContextType = {
  talk: (text: string) => Promise<void>;
  listen: () => Promise<string>;
};

export const SpeechContext = createContext<SpeechContextType | undefined>(
  undefined
);
