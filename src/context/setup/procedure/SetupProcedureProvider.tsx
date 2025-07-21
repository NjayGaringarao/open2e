import React, { useEffect, useState } from "react";

import { SetupProcedureContext } from "./SetupProcedureContext";
import { EvaluationMode, Name, UserRole } from "@/types/types";
import { load } from "@tauri-apps/plugin-store";
import { invoke } from "@tauri-apps/api/core";

export const SetupProcedureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  // SaveSetup
  const finishSetup = async () => {
    const store = await load("store.settings", { autoSave: false });

    await store.set("username", {
      first: username.first,
      middle: username.middle,
      last: username.last,
    });

    await store.set("setup", {
      is_initialized: true,
      role: userRole,
      mode: mode,
    });

    await store.set("apikey", {
      openai: apiKey,
    });
    await store.save();

    await invoke("show_window");
  };

  // System info fetch
  useEffect(() => {
    invoke<number>("get_total_memory_gb").then((ram) => {
      setSystemMemory(ram);
    });
  }, []);

  return (
    <SetupProcedureContext.Provider
      value={{
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
        finishSetup,
      }}
    >
      {children}
    </SetupProcedureContext.Provider>
  );
};
