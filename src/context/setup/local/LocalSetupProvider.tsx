import { useEffect, useState } from "react";
import { IStartInstallation, LocalSetupContext } from "./LocalSetupContext";
import { listen } from "@tauri-apps/api/event";
import { useDialog } from "@/context/dialog";
import { installOllama, installPhi4Mini, cleanOllama } from "@/lib/ollama";

// const TOTAL_PROGRESS = 100;
const STEP_WEIGHTS = [45, 45, 10]; // 3 steps: Install Ollama (0-45%), Install phi4-mini (46-90%), Verify (91-100%)

export const LocalSetupProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { alert } = useDialog();
  const [currentStep, setCurrentStep] = useState(0);
  const [percent, setPercent] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const updateProgress = (step: number, subPercent: number = 0) => {
    const base = STEP_WEIGHTS.slice(0, step).reduce((a, b) => a + b, 0);
    const stepWeight = STEP_WEIGHTS[step];
    const stepProgress = Math.floor((subPercent / 100) * stepWeight);
    setPercent(Math.min(base + stepProgress, 100));
  };

  async function simulateStepWithInstall(
    step: number,
    installCommand: () => Promise<void>,
    durationMs: number = 85_000,
    maxSimulatedProgress: number = 95
  ) {
    const intervalMs = 500;
    let simulatedProgress = 0;
    const steps = durationMs / intervalMs;
    const progressPerTick = maxSimulatedProgress / steps;

    const interval = setInterval(() => {
      simulatedProgress = Math.min(
        simulatedProgress + progressPerTick,
        maxSimulatedProgress
      );
      updateProgress(step, simulatedProgress);
    }, intervalMs);

    try {
      await installCommand();
    } finally {
      clearInterval(interval);
      updateProgress(step, 100);
    }
  }

  const startInstallation = async (options?: IStartInstallation) => {
    setIsInstalling(true);
    setCurrentStep(0);
    setPercent(0);

    try {
      // Step 0: Clean install
      if (options?.isReinstall) await cleanOllama();

      // Step 1: Install Ollama (0-45%)
      setCurrentStep(0);
      await simulateStepWithInstall(0, () => installOllama(), 45000, 100);

      // Step 2: Install phi4-mini model (46-90%)
      setCurrentStep(1);
      await installPhi4Mini();

      // Step 3: Setup validation (91-100%)
      setCurrentStep(2);
      await simulateStepWithInstall(
        2,
        () => new Promise<void>((resolve) => setTimeout(resolve, 3000)),
        3000,
        100
      );

      setIsInstalled(true);

      await alert({
        title: options?.isReinstall
          ? "Reinstallation Successful"
          : "Installation Successful",
        description:
          "Please restart your computer before using open2e offline. This is necessary only for once.",
        mode: "SUCCESS",
      });
    } catch (err) {
      console.error("Installation error:", err);
      throw err;
    } finally {
      setIsInstalling(false);
    }
  };

  useEffect(() => {
    const unlisten = listen<number>("phi4-mini-install-progress", (e) => {
      console.log("phi4-mini progress:", e.payload);
      updateProgress(1, parseInt(e.payload.toString()));
    });

    return () => {
      unlisten.then((un) => un());
    };
  }, []);

  return (
    <LocalSetupContext.Provider
      value={{
        currentStep,
        percent,
        isInstalling,
        isInstalled,
        startInstallation,
      }}
    >
      {children}
    </LocalSetupContext.Provider>
  );
};
