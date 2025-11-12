import clsx from "clsx";
import icon from "@/constant/icon";
import { useSettings } from "@/context/main/settings";
import { useStatus, LLMStatus } from "@/context/main/status";
import { RECOMMENDED_MEMORY } from "@/constant/memory";

const STATUS_CONFIG: Record<
  LLMStatus,
  { logo: string; title: string; description: string; badgeText: string }
> = {
  [LLMStatus.ONLINE]: {
    logo: icon.openai,
    title: "OpenAI GPT-4o",
    description: "Cloud AI is active. Requires internet connection.",
    badgeText: "Online",
  },
  [LLMStatus.OFFLINE_READY]: {
    logo: icon.microsoft,
    title: "Microsoft Phi4-mini",
    description: "Local AI is available. Requires system resources.",
    badgeText: "Offline Ready",
  },
  [LLMStatus.OFFLINE_LOW_RAM]: {
    logo: icon.microsoft,
    title: "Microsoft Phi4-mini",
    description: "Local AI requires at least 16GB RAM to run reliably.",
    badgeText: "Insufficient RAM",
  },
  [LLMStatus.OFFLINE_NOT_SETUP]: {
    logo: icon.microsoft,
    title: "Microsoft Phi4-mini",
    description: "Install Ollama and phi4-mini to enable offline AI.",
    badgeText: "Setup Required",
  },
};

const LLMSource = () => {
  const { status: llmStatus, isCheckingLocalLLM } = useStatus();
  const { systemMemory } = useSettings();
  const config = STATUS_CONFIG[llmStatus];

  const isOnline = llmStatus === LLMStatus.ONLINE;
  const canRunOffline = llmStatus === LLMStatus.OFFLINE_READY;
  const insufficientMemory = llmStatus === LLMStatus.OFFLINE_LOW_RAM;
  const missingDependencies = llmStatus === LLMStatus.OFFLINE_NOT_SETUP;
  const evaluationAvailable = isOnline || canRunOffline;
  const detectionAvailable = isOnline;

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

          <div className="flex flex-col items-end gap-1">
            <p
              className={clsx(
                "py-1 px-2 text-xs text-background rounded-md",
                isOnline || canRunOffline ? "bg-uGreen" : "bg-uRed"
              )}
            >
              {config.badgeText}
            </p>
            {!isOnline && isCheckingLocalLLM && (
              <p className="text-2xs text-uGrayLight uppercase tracking-wide">
                Verifying local setup…
              </p>
            )}
          </div>
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
                {evaluationAvailable ? (
                  <span className="text-uGreen">✓ Available</span>
                ) : (
                  <span className="text-uRed">✗ Unavailable</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm">
                {isOnline ? (
                  <span className="text-uGreen">GPT-4o (Online)</span>
                ) : canRunOffline ? (
                  <span className="text-uGreen">Phi4-mini (Offline)</span>
                ) : insufficientMemory ? (
                  <span className="text-uRed">
                    Requires ≥{RECOMMENDED_MEMORY}GB RAM (recommended) or
                    Internet
                  </span>
                ) : (
                  <span className="text-uRed">
                    Install Ollama + phi4-mini to enable offline mode
                  </span>
                )}
              </td>
            </tr>

            <tr className="border-t border-uGrayLight">
              <td className="px-4 py-2">AI Detection</td>
              <td className="px-4 py-2">
                {detectionAvailable ? (
                  <span className="text-uGreen">✓ Available</span>
                ) : (
                  <span className="text-uRed">✗ Unavailable</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm">
                {detectionAvailable ? (
                  <span className="text-uGreen">Sapling API (Online)</span>
                ) : (
                  <span className="text-uRed">Requires Internet</span>
                )}
              </td>
            </tr>

            <tr className="border-t border-uGrayLight">
              <td className="px-4 py-2">AI Chat</td>
              <td className="px-4 py-2">
                {evaluationAvailable ? (
                  <span className="text-uGreen">✓ Available</span>
                ) : (
                  <span className="text-uRed">✗ Unavailable</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm">
                {isOnline ? (
                  <span className="text-uGreen">GPT-4o (Online)</span>
                ) : canRunOffline ? (
                  <span className="text-uGreen">Phi4-mini (Offline)</span>
                ) : insufficientMemory ? (
                  <span className="text-uRed">
                    Requires ≥{RECOMMENDED_MEMORY}GB RAM (recommended) or
                    Internet
                  </span>
                ) : (
                  <span className="text-uRed">
                    Install Ollama + phi4-mini to enable offline mode
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {insufficientMemory ? (
          <div className="bg-uRed/10 border border-uRed/30 rounded-md p-3 text-sm">
            <p className="text-uRed font-semibold">Limited Functionality</p>
            <p className="text-uGrayLight mt-1">
              Your system has {systemMemory}GB of RAM. Local AI features require
              at least {RECOMMENDED_MEMORY}GB for optimal performance. Connect
              to the internet to access all features via cloud services.
            </p>
          </div>
        ) : missingDependencies ? (
          <div className="bg-uGreen/10 border border-uGreen/30 rounded-md p-3 text-sm">
            <p className="text-uGreen font-semibold">
              Local AI Dependencies Not Installed
            </p>
            <p className="text-uGrayLight mt-1">
              Your system is capable of running local AI features, but the
              dependencies are not installed. Please install the dependencies to
              use local AI features.
            </p>
            <p className="text-uGrayLight mt-1">
              Verify that Ollama is installed and the `phi4-mini` model is
              pulled.
            </p>
          </div>
        ) : canRunOffline ? (
          <div className="bg-uGreen/10 border border-uGreen/30 rounded-md p-3 text-sm">
            <p className="text-uGreen font-semibold">
              Offline AI Ready for Use
            </p>
            <p className="text-uGrayLight mt-1">
              Open2E will use the local `phi4-mini` model while offline. Ensure
              your device stays powered and resources remain available.
            </p>
          </div>
        ) : (
          <div className="bg-uGreen/10 border border-uGreen/30 rounded-md p-3 text-sm">
            <p className="text-uGreen font-semibold">Online Mode Active</p>
            <p className="text-uGrayLight mt-1">
              You are currently connected to the internet. Open2E will route AI
              features through GPT-4o and Sapling to provide full coverage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LLMSource;
