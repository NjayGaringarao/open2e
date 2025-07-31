import { Name, UserRole, LLMSource, TTSConfig } from "@/types/config";
import { createContext } from "react";

export interface IUpdate {
  userName?: Name;
  llmSource?: LLMSource;
  userRole?: UserRole;
  openaiAPIKey?: string;
  saplingAPIKey?: string;
  ttsConfig?: TTSConfig;
}

export type SettingsContextType = {
  userName: Name;
  llmSource: LLMSource;
  userRole: UserRole;
  openaiAPIKey?: string;
  saplingAPIKey?: string;
  ttsConfig: TTSConfig;
  update: (param: IUpdate) => Promise<void>;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);
