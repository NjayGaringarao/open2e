import { useContext } from "react";
import { TagContext } from "./tagContext";

export const useTag = () => {
  const ctx = useContext(TagContext);
  if (!ctx) throw new Error("useStudent must be used within a StudentProvider");
  return ctx;
};
