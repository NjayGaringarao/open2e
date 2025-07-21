import { ReactNode } from "react";
import { StudentProvider } from "@/context/student";
import { DialogProvider } from "@/context/dialog";
import { TagProvider } from "@/context/tag/TagProvider";
import { Provider } from "@/components/ui/provider";
import { SettingsProvider } from "./main/settings";

export const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <DialogProvider>
        <SettingsProvider>
          <TagProvider>
            <StudentProvider>{children}</StudentProvider>
          </TagProvider>
        </SettingsProvider>
      </DialogProvider>
    </Provider>
  );
};
