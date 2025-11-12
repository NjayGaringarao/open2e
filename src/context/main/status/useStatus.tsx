import { useContext } from "react";
import { StatusContext } from "./StatusContext";

export const useStatus = () => {
  const ctx = useContext(StatusContext);
  if (!ctx) {
    throw new Error("useStatus must be used within a StatusProvider.");
  }
  return ctx;
};

