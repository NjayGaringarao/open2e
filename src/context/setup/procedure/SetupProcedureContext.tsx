import { LLMSource, Name, UserRole } from "@/types/config";
import { createContext } from "react";

export interface SetupProcedureContextType {
  systemMemory: number;
  llmSource?: LLMSource;
  setLlmSource: (mode: LLMSource) => void;
  userRole?: UserRole;
  setUserRole: (role: UserRole) => void;
  isEulaAgreed: boolean;
  setIsEulaAgreed: (agreed: boolean) => void;
  openaiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
  gptZeroApiKey: string;
  setGptZeroApiKey: (key: string) => void;
  username: Name;
  setUsername: React.Dispatch<React.SetStateAction<Name>>;
  finishSetup: () => Promise<void>;
}

export const SetupProcedureContext = createContext<
  SetupProcedureContextType | undefined
>(undefined);
