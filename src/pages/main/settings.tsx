import DropDown from "@/components/container/DropDown";
import { SettingsIcon } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import LLMSource from "@/components/settings/LLMSource";
import { LocalSetupProvider } from "@/context/setup/local";
import TTS from "@/components/settings/TTS";
import ThemeToggle from "@/components/settings/ThemeToggle";
import MainContentBox from "@/components/container/MainContentBox";
import ConfigHelp from "@/constant/helpContent/ConfigHelp";
import { HelpPanel } from "@/components/HelpPanel";
import BackupRestore from "@/components/settings/BackupRestore";

export default function Settings() {
  return (
    <div className="flex flex-row h-screen">
      {/* This is the main content area of the page */}
      <MainContentBox className="flex flex-col gap-8">
        <div className="flex flex-row gap-4 py-8 items-center text-uGray text-4xl font-mono font-semibold">
          <SettingsIcon className="h-10 w-10" />
          Configuration
        </div>

        <DropDown
          headerElement={
            <p className="text-uGray text-xl font-semibold">Appearance</p>
          }
          isDefaultOpen
        >
          <ThemeToggle />
        </DropDown>

        <DropDown
          headerElement={
            <p className="text-uGray text-xl font-semibold">
              Backup and Restore
            </p>
          }
          isDefaultOpen
        >
          <BackupRestore />
        </DropDown>

        <DropDown
          headerElement={
            <p className="text-uGray text-xl font-semibold">
              LLM Source and Capability
            </p>
          }
          isDefaultOpen
        >
          <LocalSetupProvider>
            <LLMSource />
          </LocalSetupProvider>
        </DropDown>

        <DropDown
          headerElement={
            <p className="text-uGray text-xl font-semibold">Text to Speech</p>
          }
          isDefaultOpen
        >
          <TTS />
        </DropDown>
      </MainContentBox>

      {/* This is the sidebar for usage information */}
      <HelpPanel>
        <ConfigHelp />
      </HelpPanel>
      <Toaster />
    </div>
  );
}
