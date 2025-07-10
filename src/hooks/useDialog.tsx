import { useContext } from "react";
import { DialogContextType } from "@/types/types";
import { DialogContext } from "@/provider/DialogProvider";

export const useDialog = (): DialogContextType => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within DialogProvider");
  return ctx;
};
