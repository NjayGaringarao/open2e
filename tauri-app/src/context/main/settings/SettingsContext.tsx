import { TTSConfig } from "@/types/config";
import { createContext } from "react";

export interface IUpdate {
  ttsConfig?: TTSConfig;
}

export type SettingsContextType = {
  ttsConfig: TTSConfig;
  update: (param: IUpdate) => Promise<void>;
  systemMemory: number;
  adminPasswordHash?: string;
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updateAdminPassword: (newPassword: string) => Promise<void>;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);
