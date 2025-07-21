import { EvaluationMode, Name, UserRole } from "@/types/types";
import { createContext } from "react";

export interface SetupProcedureContextType {
  systemMemory: number;
  mode?: EvaluationMode;
  setMode: (mode: EvaluationMode) => void;
  userRole?: UserRole;
  setUserRole: (role: UserRole) => void;
  isEulaAgreed: boolean;
  setIsEulaAgreed: (agreed: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  username: Name;
  setUsername: React.Dispatch<React.SetStateAction<Name>>;
  finishSetup: () => Promise<void>;
}

export const SetupProcedureContext = createContext<
  SetupProcedureContextType | undefined
>(undefined);
