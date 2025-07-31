import { ReactNode } from "react";
import { StudentProvider } from "@/context/main/student";
import { DialogProvider } from "@/context/dialog";
import { TagProvider } from "@/context/main/tag/TagProvider";
import { Provider } from "@/components/ui/provider";
import { SettingsProvider } from "./main/settings";
import { SpeechProvider } from "./speech";

export const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <DialogProvider>
        <SettingsProvider>
          <SpeechProvider>
            <TagProvider>
              <StudentProvider>{children}</StudentProvider>
            </TagProvider>
          </SpeechProvider>
        </SettingsProvider>
      </DialogProvider>
    </Provider>
  );
};
