import { TTSConfig } from "@/types/config";
import { createContext } from "react";

export interface IUpdate {
  ttsConfig?: TTSConfig;
}

export type SettingsContextType = {
  ttsConfig: TTSConfig;
  update: (param: IUpdate) => Promise<void>;
  systemMemory: number;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);
