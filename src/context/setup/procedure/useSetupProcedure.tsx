import { useContext } from "react";
import { SetupProcedureContext } from "./SetupProcedureContext";

export const useSetupProcedure = () => {
  const context = useContext(SetupProcedureContext);
  if (!context) {
    throw new Error(
      "useSetupProcedure must be used within a SetupProcedureProvider"
    );
  }
  return context;
};
