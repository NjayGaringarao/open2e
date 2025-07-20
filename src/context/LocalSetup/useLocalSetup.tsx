import { useContext } from "react";
import { LocalSetupContext } from "./LocalSetupContext";

export const useLocalSetup = () => {
  const context = useContext(LocalSetupContext);
  if (!context)
    throw new Error("useLocalSetup must be used within a LocalSetupProvider");
  return context;
};
