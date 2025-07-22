import { Name, UserRole, LLMSource } from "@/types/types";
import { createContext } from "react";

export interface IUpdate {
  userName?: Name;
  llmSource?: LLMSource;
  userRole?: UserRole;
  openaiAPIKey?: string;
}

export type SettingsContextType = {
  userName: Name;
  llmSource: LLMSource;
  userRole: UserRole;
  openaiAPIKey?: string;
  update: (param: IUpdate) => Promise<void>;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);
