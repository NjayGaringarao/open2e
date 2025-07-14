import { ReactNode } from "react";
import { StudentProvider } from "@/context/student";
import { DialogProvider } from "@/context/dialog";
import { TagProvider } from "@/context/tag/TagProvider";
import { Provider } from "@/components/ui/provider";

export const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <DialogProvider>
        <TagProvider>
          <StudentProvider>{children}</StudentProvider>
        </TagProvider>
      </DialogProvider>
    </Provider>
  );
};
