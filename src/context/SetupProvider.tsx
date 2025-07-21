import React from "react";
import { DialogProvider } from "./dialog";
import { SetupProcedureProvider } from "./setup/procedure";
import { SetupNavigationProvider } from "./setup/navigation";
import { LocalSetupProvider } from "./setup/local";

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DialogProvider>
      <SetupProcedureProvider>
        <LocalSetupProvider>
          <SetupNavigationProvider>{children}</SetupNavigationProvider>
        </LocalSetupProvider>
      </SetupProcedureProvider>
    </DialogProvider>
  );
};
