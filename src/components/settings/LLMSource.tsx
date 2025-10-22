import { useDialog } from "@/context/dialog";
import { toaster } from "@/components/ui/toaster";
import clsx from "clsx";
import { useLocalSetup } from "@/context/setup/local";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import icon from "@/constant/icon";
import { useSettings } from "@/context/main/settings";
import { RECOMMENDED_MEMORY } from "@/constant/memory";

const LLM_CONFIG = {
  OFFLINE: {
    logo: icon.microsoft,
    title: "Microsoft Phi4-mini",
    description: "Requires system resources.",
  },
  ONLINE: {
    logo: icon.openai,
    title: "Openai GPT-4o",
    description: "Requires internet connection.",
  },
  NONE: {
    logo: icon.logo,
    title: "No LLM Source",
    description: "Please connect to the intenet to use Open2E.",
  },
} as const;

const LLMSource = () => {
  const { status } = useConnectionStatus();
  const { systemMemory } = useSettings();
  const { confirm, alert } = useDialog();
  const { percent, startInstallation, isInstalling } = useLocalSetup();

  const config = LLM_CONFIG[status];
  const isOperational =
    status === "ONLINE" || systemMemory >= RECOMMENDED_MEMORY;

  const handleReinstallDependencies = async () => {
    if (status === "OFFLINE") {
      await alert({
        title: "No Internet Connection",
        description:
          "Please connect to the internet to reinstall LLM Dependency.",
        mode: "ERROR",
      });
      return;
    }

    if (systemMemory < RECOMMENDED_MEMORY) {
      await alert({
        title: "Insufficient System Memory",
        description: `Your system has less than ${RECOMMENDED_MEMORY}GB of RAM. Local LLM requires at least ${RECOMMENDED_MEMORY}GB of memory for optimal performance. You can still use Open2E online with internet connection.`,
        mode: "ERROR",
      });
      return;
    }

    const isConfirmed = await confirm({
      title: "Confirm Reinstall",
      description:
        "This will consume an approximately 3.6 GB of data. Make sure you have an stable internet connection before proceeding. Do you want to Proceed?",
    });

    if (!isConfirmed) return;
    try {
      await startInstallation({ isReinstall: true });
    } catch (error) {
      toaster.create({
        title: "Installation Failed",
        description: `An Error was encountered during installtion. ${error}`,
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-4">
      <div className="flex flex-col gap-4 items-center">
        <div className="shadow-md shadow-uGrayLightLight rounded-md w-full flex flex-row gap-4 p-4 items-center">
          <div className="flex flex-row gap-2 items-center flex-1">
            <img
              src={config.logo}
              alt="llm-logo"
              className="h-12 w-12 bg-uGray p-1 rounded"
            />
            <div className="flex flex-col">
              <p className="text-xl text-uGray font-semibold">{config.title}</p>
              <p className="text-sm">{config.description}</p>
            </div>
          </div>

          <p
            className={clsx(
              "py-1 px-2 text-xs text-background rounded-md",
              isOperational ? "bg-uGreen" : "bg-uRed"
            )}
          >
            {isOperational ? "Operational" : "Not Compatible"}
          </p>
        </div>

        <table className="w-full border border-uGrayLight rounded-md overflow-hidden shadow-md shadow-uGrayLightLight">
          <thead className="bg-panel">
            <tr>
              <th className="px-4 py-2 text-left">Feature</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Source</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-uGrayLight">
              <td className="px-4 py-2">Analytics & Records</td>
              <td className="px-4 py-2">
                <span className="text-uGreen">✓ Available</span>
              </td>
              <td className="px-4 py-2 text-sm text-uGrayLight">
                Local Database
              </td>
            </tr>

            <tr className="border-t border-uGrayLight">
              <td className="px-4 py-2">Evaluation</td>
              <td className="px-4 py-2">
                {isOperational ? (
                  <span className="text-uGreen">✓ Available</span>
                ) : (
                  <span className="text-uRed">✗ Unavailable</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm">
                {status === "ONLINE" ? (
                  <span className="text-uGreen">GPT-4o (Online)</span>
                ) : systemMemory >= RECOMMENDED_MEMORY ? (
                  <span className="text-uGreen">Phi4-mini (Offline)</span>
                ) : (
                  <span className="text-uRed">
                    Requires ≥{RECOMMENDED_MEMORY}GB RAM (recommended) or
                    Internet
                  </span>
                )}
              </td>
            </tr>

            <tr className="border-t border-uGrayLight">
              <td className="px-4 py-2">AI Detection</td>
              <td className="px-4 py-2">
                {status === "ONLINE" ? (
                  <span className="text-uGreen">✓ Available</span>
                ) : (
                  <span className="text-uRed">✗ Unavailable</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm">
                {status === "ONLINE" ? (
                  <span className="text-uGreen">Sapling API (Online)</span>
                ) : (
                  <span className="text-uRed">Requires Internet</span>
                )}
              </td>
            </tr>

            <tr className="border-t border-uGrayLight">
              <td className="px-4 py-2">AI Chat</td>
              <td className="px-4 py-2">
                {isOperational ? (
                  <span className="text-uGreen">✓ Available</span>
                ) : (
                  <span className="text-uRed">✗ Unavailable</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm">
                {status === "ONLINE" ? (
                  <span className="text-uGreen">GPT-4o (Online)</span>
                ) : systemMemory >= RECOMMENDED_MEMORY ? (
                  <span className="text-uGreen">Phi4-mini (Offline)</span>
                ) : (
                  <span className="text-uRed">
                    Requires ≥{RECOMMENDED_MEMORY}GB RAM (recommended) or
                    Internet
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {status === "OFFLINE" && systemMemory < RECOMMENDED_MEMORY && (
          <div className="bg-uRed/10 border border-uRed/30 rounded-md p-3 text-sm">
            <p className="text-uRed font-semibold">Limited Functionality</p>
            <p className="text-uGrayLight mt-1">
              Your system has {systemMemory}GB of RAM. Local AI features require
              at least {RECOMMENDED_MEMORY}GB for optimal performance. Connect
              to the internet to access all features via cloud services.
            </p>
          </div>
        )}

        {systemMemory >= RECOMMENDED_MEMORY && (
          <div
            className={clsx(
              "flex flex-row gap-1 self-end",
              isInstalling && "hidden"
            )}
          >
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
              Reinstall Local LLM
            </button>
          </div>
        )}
      </div>

      {isInstalling && (
        <div className="flex flex-col gap-1 mt-2">
          <p className="text-uGrayLight text-base font-semibold">
            {percent !== 100
              ? "Reinstalling local LLM, Please wait..."
              : "Finish setup."}
          </p>

          <div className="flex flex-row items-center gap-2 w-full">
            <div className="h-3 w-full bg-uGrayLightLight rounded-md overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="w-10 text-primary text-center font-mono">
              {percent}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMSource;
