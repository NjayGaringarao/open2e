import { ReactNode } from "react";
import { DialogProvider } from "@/context/dialog";
import { Provider } from "@/components/ui/provider";
import { SettingsProvider } from "./main/settings";
import { SpeechProvider } from "./speech";
import { ChatProvider } from "./main/chat/ChatProvider";
import { AnalyticsProvider } from "./main/analytics/AnalyticsContext";
import { RubricProvider } from "./main/rubric";

export const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <DialogProvider>
        <SettingsProvider>
          <SpeechProvider>
            <ChatProvider>
              <AnalyticsProvider>
                <RubricProvider>{children}</RubricProvider>
              </AnalyticsProvider>
            </ChatProvider>
          </SpeechProvider>
        </SettingsProvider>
      </DialogProvider>
    </Provider>
  );
};
