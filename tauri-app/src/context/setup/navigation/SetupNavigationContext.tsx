import { INavigate } from "@/pages/setup/types";
import { createContext } from "react";

export interface SetupNavigationContextType {
  step: number;
  totalSteps: number;
  navigate: INavigate;
}

export const SetupNavigationContext = createContext<
  SetupNavigationContextType | undefined
>(undefined);
