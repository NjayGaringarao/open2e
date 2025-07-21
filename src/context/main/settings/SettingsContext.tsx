import { Name, UserRole, LLMSource } from "@/types/types";
import { createContext } from "react";

export interface IHandleUpdate {
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
  handleUpdate: (param: IHandleUpdate) => Promise<void>;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);
