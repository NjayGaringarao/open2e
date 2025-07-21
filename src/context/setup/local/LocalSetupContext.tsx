import { createContext } from "react";

export type LocalSetupContextType = {
  currentStep: number;
  percent: number;
  isInstalling: boolean;
  isInstalled: boolean;
  startInstallation: () => Promise<void>;
};

export const LocalSetupContext = createContext<
  LocalSetupContextType | undefined
>(undefined);
