import React, { createContext, useContext, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { EvaluationMode, Name, UserRole } from "@/types/types";
import { INavigate } from "@/pages/setup/types";

interface SetupContextType {
  // Step control
  step: number;
  totalSteps: number;
  navigate: INavigate;

  // Setup data
  systemMemory: number;
  mode?: EvaluationMode;
  setMode: (mode: EvaluationMode) => void;
  userRole?: UserRole;
  setUserRole: (role: UserRole) => void;
  isEulaAgreed: boolean;
  setIsEulaAgreed: (agreed: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  username: Name;
  setUsername: React.Dispatch<React.SetStateAction<Name>>;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export const useSetup = () => {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error("useSetup must be used within a SetupProvider");
  }
  return context;
};

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
  const TOTAL_STEPS = 7;
  const [step, setStep] = useState(0);

  // Setup data
  const [systemMemory, setSystemMemory] = useState(0);
  const [mode, setMode] = useState<EvaluationMode>();
  const [userRole, setUserRole] = useState<UserRole>();
  const [isEulaAgreed, setIsEulaAgreed] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState<Name>({
    first: "",
    middle: "",
    last: "",
  });

  // Navigation handlers
  const navigate: INavigate = {
    next: () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)),
    back: () => setStep((s) => Math.max(s - 1, 0)),
    to: (index: number) => {
      if (index >= 0 && index < TOTAL_STEPS) setStep(index);
    },
  };

  // System info fetch
  useEffect(() => {
    invoke<number>("get_total_memory_gb").then((ram) => {
      setSystemMemory(ram);
    });
  }, []);

  return (
    <SetupContext.Provider
      value={{
        step,
        totalSteps: TOTAL_STEPS,
        navigate,
        systemMemory,
        mode,
        setMode,
        userRole,
        setUserRole,
        isEulaAgreed,
        setIsEulaAgreed,
        apiKey,
        setApiKey,
        username,
        setUsername,
      }}
    >
      {children}
    </SetupContext.Provider>
  );
};
