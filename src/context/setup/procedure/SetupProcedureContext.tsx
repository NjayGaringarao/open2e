import { createContext } from "react";

export interface SetupProcedureContextType {
  systemMemory: number;
  isEulaAgreed: boolean;
  setIsEulaAgreed: (agreed: boolean) => void;
  finishSetup: () => Promise<void>;
}

export const SetupProcedureContext = createContext<
  SetupProcedureContextType | undefined
>(undefined);
