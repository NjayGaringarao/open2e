import DropDown from "@/components/DropDown";
import UserInformation from "@/components/settings/UserInformation";
import UserRole from "@/components/settings/UserRole";
import { SettingsIcon } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import LLMSource from "@/components/settings/LLMSource";
import { LocalSetupProvider } from "@/context/setup/local";
import AIDetection from "@/components/settings/AIDetection";

export default function Settings() {
  return (
    <div className="flex h-screen flex-row gap-6">
      <div className="flex flex-col p-6 flex-1 items-center">
        {/* This is the main content area of the page */}
        <div className="relative w-full h-full max-w-5xl flex flex-col overflow-y-auto">
          <div className="flex flex-row gap-4 py-8 items-center text-uGray text-4xl font-mono font-semibold">
            <SettingsIcon className="h-10 w-10" />
            Settings
          </div>
          <DropDown
            headerElement={
              <p className="text-uGray text-lg">User Information</p>
            }
          >
            <UserInformation />
          </DropDown>
          <DropDown
            headerElement={<p className="text-uGray text-lg">UI Mode</p>}
          >
            <UserRole />
          </DropDown>
          <DropDown
            headerElement={<p className="text-uGray text-lg">LLM Source</p>}
          >
            <LocalSetupProvider>
              <LLMSource />
            </LocalSetupProvider>
          </DropDown>
          <DropDown
            headerElement={<p className="text-uGray text-lg">AI Detection</p>}
          >
            <LocalSetupProvider>
              <AIDetection />
            </LocalSetupProvider>
          </DropDown>
        </div>
        <Toaster />
      </div>

      {/* This is the sidebar for usage information */}
      <div className="hidden 2xl:block bg-panel w-[26rem] transition-all duration-500"></div>
    </div>
  );
}
