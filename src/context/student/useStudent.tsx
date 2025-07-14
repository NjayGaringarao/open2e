import { useContext } from "react";
import { StudentContext } from "./studentContext";

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within a StudentProvider");
  return ctx;
};
