import { Name } from "@/types/config";
import { createContext } from "react";

export interface SetupProcedureContextType {
  systemMemory: number;
  isEulaAgreed: boolean;
  setIsEulaAgreed: (agreed: boolean) => void;
  username: Name;
  setUsername: React.Dispatch<React.SetStateAction<Name>>;
  finishSetup: () => Promise<void>;
}

export const SetupProcedureContext = createContext<
  SetupProcedureContextType | undefined
>(undefined);
