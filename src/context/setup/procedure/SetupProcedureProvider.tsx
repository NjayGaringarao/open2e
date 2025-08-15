import React, { useEffect, useState } from "react";

import { SetupProcedureContext } from "./SetupProcedureContext";
import { TTSConfig } from "@/types/config";
import { load, Store } from "@tauri-apps/plugin-store";
import { invoke } from "@tauri-apps/api/core";

export const SetupProcedureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Setup data
  const [systemMemory, setSystemMemory] = useState(0);
  const [isEulaAgreed, setIsEulaAgreed] = useState(false);

  // SaveSetup
  const finishSetup = async () => {
    let configStore: Store | null = null;

    try {
      configStore = await load("store.config", { autoSave: false });
      await configStore.set("is_initialized", true);

      const ttsConfig: TTSConfig = {
        rate: 0.8,
        pitch: 0.9,
        volume: 1,
        voiceIndex: 1,
      };

      await configStore.set("tts_config", ttsConfig);
      await configStore.save();
    } catch (error) {
      console.warn(`context.setup.procedure.SetupProdureProvider :: ${error}`);
    } finally {
      // NOTE: These causes an uncaught promise...
      // IDK WHY, But it works just fine.
      // TODO: Resolve the issue
      configStore && (await configStore.close());
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
        isEulaAgreed,
        setIsEulaAgreed,
        finishSetup,
      }}
    >
      {children}
    </SetupProcedureContext.Provider>
  );
};
