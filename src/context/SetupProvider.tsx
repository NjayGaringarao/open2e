import React from "react";
import { DialogProvider } from "./dialog";
import { SetupProcedureProvider } from "./setup/procedure";
import { SetupNavigationProvider } from "./setup/navigation";

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DialogProvider>
      <SetupProcedureProvider>
        <SetupNavigationProvider>{children}</SetupNavigationProvider>
      </SetupProcedureProvider>
    </DialogProvider>
  );
};
