import React, { useEffect, useState } from "react";

import { SetupProcedureContext } from "./SetupProcedureContext";
import { LLMSource, Name, UserRole } from "@/types/types";
import { load } from "@tauri-apps/plugin-store";
import { invoke } from "@tauri-apps/api/core";

export const SetupProcedureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Setup data
  const [systemMemory, setSystemMemory] = useState(0);
  const [llmSource, setLlmSource] = useState<LLMSource>();
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
    const config = await load("store.config", { autoSave: false });

    await config.set("user_name", {
      first: username.first,
      middle: username.middle,
      last: username.last,
    });
    await config.set("is_initialized", true);
    await config.set("user_role", userRole);
    await config.set("llm_source", llmSource);
    await config.save();

    const apikeys = await load("store.apikeys", { autoSave: false });

    await apikeys.set("openai", apiKey);
    await apikeys.close();

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
        llmSource,
        setLlmSource,
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
