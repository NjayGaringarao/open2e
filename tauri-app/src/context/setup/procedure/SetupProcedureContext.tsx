import { createContext } from "react";

export interface SetupProcedureContextType {
  finishSetup: () => Promise<void>;
}

export const SetupProcedureContext = createContext<
  SetupProcedureContextType | undefined
>(undefined);
