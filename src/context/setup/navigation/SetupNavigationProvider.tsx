import React, { useState } from "react";
import { INavigate } from "@/pages/setup/types";

import { SetupNavigationContext } from "./SetupNavigationContext";

export const SetupNavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const TOTAL_STEPS = 8;
  const [step, setStep] = useState(0);

  // Navigation handlers
  const navigate: INavigate = {
    next: () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)),
    back: () => setStep((s) => Math.max(s - 1, 0)),
    to: (index: number) => {
      if (index >= 0 && index < TOTAL_STEPS) setStep(index);
    },
  };

  return (
    <SetupNavigationContext.Provider
      value={{
        step,
        totalSteps: TOTAL_STEPS,
        navigate,
      }}
    >
      {children}
    </SetupNavigationContext.Provider>
  );
};
