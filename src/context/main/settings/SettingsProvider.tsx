import { Name, TTSConfig } from "@/types/config";
import React, { useEffect, useState } from "react";
import { IUpdate, SettingsContext } from "./SettingsContext";
import { load, Store } from "@tauri-apps/plugin-store";
import { DEFAULT_USERNAME } from "@/constant/default";
import { invoke } from "@tauri-apps/api/core";

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userName, setUserName] = useState<Name>(DEFAULT_USERNAME);
  const [systemMemory, setSystemMemory] = useState(0);
  const [ttsConfig, setTTSConfig] = useState<TTSConfig>({
    rate: 0.8,
    pitch: 0.9,
    volume: 1,
    voiceIndex: 0,
  });

  const loadSettings = async () => {
    let config: Store | null = null;

    try {
      config = await load("store.config", { autoSave: false });

      const _userName = await config.get<Name>("user_name");
      _userName && setUserName(_userName);

      const _tts = await config.get<TTSConfig>("tts_config");
      _tts && setTTSConfig(_tts);
    } catch (error) {
      console.error(`SettingsProvider.loadSettings :: ${error}`);
    } finally {
      config && (await config.close());
    }
  };

  const update = async ({
    userName,
    ttsConfig,
  }: IUpdate & { ttsConfig?: TTSConfig }) => {
    let config: Store | null = null;

    try {
      config = await load("store.config", { autoSave: false });
      userName && (await config.set("user_name", userName));
      ttsConfig && (await config.set("tts_config", ttsConfig));
      await config.save();
    } catch (error) {
      alert(`SettingsProvider.update :: ${error}`);
    } finally {
      config && (await config.close());
    }

    await loadSettings();
  };

  useEffect(() => {
    loadSettings();

    invoke<number>("get_total_memory_gb").then((ram) => {
      setSystemMemory(ram);
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        userName,
        systemMemory,
        ttsConfig,
        update,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
