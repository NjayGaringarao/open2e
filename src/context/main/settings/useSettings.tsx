import { useContext } from "react";
import { SettingsContext } from "./SettingsContext";

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be within a SettingsProvider.");
};
