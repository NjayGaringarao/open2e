import { createContext } from "react";

export interface IStartInstallation {
  isReinstall?: boolean;
}
export type LocalSetupContextType = {
  currentStep: number;
  percent: number;
  isInstalling: boolean;
  isInstalled: boolean;
  startInstallation: (options?: IStartInstallation) => Promise<void>;
};

export const LocalSetupContext = createContext<
  LocalSetupContextType | undefined
>(undefined);
