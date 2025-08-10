import { useDialog } from "@/context/dialog";
import { toaster } from "@/components/ui/toaster";
import clsx from "clsx";
import Loading from "../Loading";
import { Check } from "lucide-react";
import { useLocalSetup } from "@/context/setup/local";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import icon from "@/constant/icon";
import { useSettings } from "@/context/main/settings";

const LLMSource = () => {
  const status = useConnectionStatus();
  const { systemMemory } = useSettings();
  const { confirm } = useDialog();
  const { percent, startInstallation, isInstalling } = useLocalSetup();

  const handleReinstallDependencies = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Reinstall",
      description:
        "This will consume an approximately 3.6 GB of data. Make sure you have an stable internet connection before proceeding. Do you want to Proceed?",
    });

    if (!isConfirmed) return;
    try {
      await startInstallation({ isCleanInstall: true });
      toaster.create({
        title: "Installed Succesfully",
        description: "Succesfully Installed dependency.",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Installation Failed",
        description: `An Error was encountered during installtion. ${error}`,
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {status === "OFFLINE" && (
        <div className="flex flex-col gap-1 items-center shadow-uGrayLightLight">
          <div className="shadow-md rounded-md w-full flex flex-row gap-4 p-4 items-center">
            <div className="flex flex-row gap-2 items-center flex-1">
              <img
                src={icon.microsoft}
                alt="ms-logo"
                className="h-12 w-12 bg-uGray p-1 rounded"
              />
              <div className="flex flex-col">
                <p className="text-xl text-uGray font-semibold">
                  Microsoft Phi4-mini
                </p>
                <p className="text-sm">Requires system resources.</p>
              </div>
            </div>

            {systemMemory >= 8 ? (
              <p className="bg-uGreen py-1 px-2 text-xs text-background rounded-md">
                Operational
              </p>
            ) : (
              <p className="bg-uRed py-1 px-2 text-xs text-background rounded-md">
                Not Compatible
              </p>
            )}
          </div>
          <div className="flex flex-row gap-1 self-end">
            <p className="text-base">
              Encountering an issue while using local LLM?
            </p>
            <button
              onClick={handleReinstallDependencies}
              className={clsx(
                "text-base text-primary",
                "hover:underline hover:underline-offset-2 hover:font-semibold",
                "self-end"
              )}
              disabled={isInstalling}
            >
              Reinstalling LLM.
            </button>
          </div>
        </div>
      )}
      {status === "ONLINE" ? (
        <div className="flex flex-col gap-1 items-center">
          <div className="rounded-md shadow-md shadow-uGrayLightLight w-full flex flex-row gap-2 p-4 items-center">
            <div className="flex flex-row gap-4 items-center flex-1">
              <img
                src={icon.openai}
                alt="ms-logo"
                className="h-12 w-12 bg-uGray p-1 rounded"
              />
              <div className="flex flex-col">
                <p className="text-xl text-uGray font-semibold">
                  Openai GPT-4o
                </p>
                <p className="text-sm">Requires internet connection.</p>
              </div>
            </div>

            <p className="bg-uGreen py-1 px-2 text-xs text-background rounded-md">
              Operational
            </p>
          </div>
        </div>
      ) : (
        isInstalling && (
          <div className="flex flex-col gap-4 pl-8 mt-4">
            {/** Loading Bar */}
            <div className=" flex flex-row items-center gap-2 w-full">
              <p className="w-10 text-primary text-center font-mono">
                {percent}%
              </p>

              <div className="h-3 w-full bg-gray-300 rounded-md overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                  }}
                ></div>
              </div>
            </div>

            {/** Prompt */}
            <div className="flex flex-row items-center">
              <div className="w-10 rounded-full">
                {percent === 100 ? (
                  <Check className="text-primary" />
                ) : (
                  <Loading size="small" />
                )}
              </div>
              <p className="text-uGrayLight text-sm font-semibold">
                {percent !== 100
                  ? "Setting up dependency, Please wait..."
                  : "Finish setup."}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LLMSource;
