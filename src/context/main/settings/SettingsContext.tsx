import { Name, TTSConfig } from "@/types/config";
import { createContext } from "react";

export interface IUpdate {
  userName?: Name;
  ttsConfig?: TTSConfig;
}

export type SettingsContextType = {
  userName: Name;
  ttsConfig: TTSConfig;
  update: (param: IUpdate) => Promise<void>;
  systemMemory: number;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);
