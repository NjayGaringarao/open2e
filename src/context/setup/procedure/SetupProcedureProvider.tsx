import React, { useEffect, useState } from "react";

import { SetupProcedureContext } from "./SetupProcedureContext";
import { LLMSource, Name, UserRole } from "@/types/config";
import { load, Store } from "@tauri-apps/plugin-store";
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
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [saplingApiKey, setSaplingApiKey] = useState("");
  const [username, setUsername] = useState<Name>({
    first: "",
    middle: "",
    last: "",
  });

  // SaveSetup
  const finishSetup = async () => {
    let configStore: Store | null = null;
    let apikeyStore: Store | null = null;

    try {
      configStore = await load("store.config", { autoSave: false });

      await configStore.set("user_name", {
        first: username.first,
        middle: username.middle,
        last: username.last,
      });
      await configStore.set("is_initialized", true);
      await configStore.set("user_role", userRole);
      await configStore.set("llm_source", llmSource);
      await configStore.save();

      if (openaiApiKey || saplingApiKey) {
        apikeyStore = await load("store.apikeys", { autoSave: false });
        await apikeyStore.set("openai", openaiApiKey);
        await apikeyStore.set("gptZero", saplingApiKey);
        await apikeyStore.save();
      }
    } catch (error) {
      console.warn(`context.setup.procedure.SetupProdureProvider :: ${error}`);
    } finally {
      // NOTE: These causes an uncaught promise...
      // IDK WHY, But it works just fine.
      // TODO: Resolve the issue
      configStore && (await configStore.close());
      apikeyStore && (await apikeyStore.close());
    }

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
        openaiApiKey,
        setOpenaiApiKey,
        saplingApiKey,
        setSaplingApiKey,
        username,
        setUsername,
        finishSetup,
      }}
    >
      {children}
    </SetupProcedureContext.Provider>
  );
};
