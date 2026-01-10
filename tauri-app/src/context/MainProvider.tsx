import { ReactNode } from "react";
import { DialogProvider } from "@/context/dialog";
import { Provider } from "@/components/ui/provider";
import { SettingsProvider } from "./main/settings";
import { ChatProvider } from "./main/chat/ChatProvider";
import { AnalyticsProvider } from "./main/analytics/AnalyticsContext";
import { RubricProvider } from "./main/rubric";
import { StatusProvider } from "./main/status";

export const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <DialogProvider>
        <SettingsProvider>
          <StatusProvider>
            <ChatProvider>
              <AnalyticsProvider>
                <RubricProvider>{children}</RubricProvider>
              </AnalyticsProvider>
            </ChatProvider>
          </StatusProvider>
        </SettingsProvider>
      </DialogProvider>
    </Provider>
  );
};
