import { useContext } from "react";
import { SetupNavigationContext } from "./SetupNavigationContext";

export const useSetupNavigation = () => {
  const context = useContext(SetupNavigationContext);
  if (!context) {
    throw new Error(
      "useSetupNavigation must be used within a SetupNavigationProvider"
    );
  }
  return context;
};
