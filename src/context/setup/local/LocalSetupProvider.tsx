import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { IStartInstallation, LocalSetupContext } from "./LocalSetupContext";
import { listen } from "@tauri-apps/api/event";

// const TOTAL_PROGRESS = 100;
const STEP_WEIGHTS = [30, 30, 30, 10]; // 4 steps

export const LocalSetupProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
      if (options?.isCleanInstall) await invoke("clean_ollama");

      // Step 1: Download Ollama
      setCurrentStep(0);
      await invoke("download_ollama");

      // Step 2: Install Ollama
      setCurrentStep(1);
      await simulateStepWithInstall(1, () => invoke("install_ollama"));

      // Step 3: Download phi3 model
      setCurrentStep(2);
      await invoke("install_llm");

      // Step 4: Setup validation
      setCurrentStep(3);
      await simulateStepWithInstall(
        3,
        () => new Promise<void>((resolve) => setTimeout(resolve, 3000)),
        3000,
        100
      );

      setIsInstalled(true);
    } catch (err) {
      console.error("Installation error:", err);
      throw err;
    } finally {
      setIsInstalling(false);
    }
  };

  useEffect(() => {
    const unlisten1 = listen<string>("ollama-download-progress", (e) =>
      updateProgress(0, parseInt(e.payload ?? "0"))
    );
    const unlisten2 = listen<string>("llm-pull-progress", (e) => {
      console.log("phi4 progress:", e.payload);

      updateProgress(2, parseInt(e.payload));
    });

    return () => {
      unlisten1.then((un) => un());
      unlisten2.then((un) => un());
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
