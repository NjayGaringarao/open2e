import { ReactNode } from "react";
import { StudentProvider } from "@/context/student";
import { DialogProvider } from "@/context/dialog";

export const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <DialogProvider>
      <StudentProvider>{children}</StudentProvider>
    </DialogProvider>
  );
};
