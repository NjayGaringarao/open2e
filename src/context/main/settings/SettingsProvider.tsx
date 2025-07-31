import { LLMSource, Name, UserRole, TTSConfig } from "@/types/config";
import React, { useEffect, useState } from "react";
import { IUpdate, SettingsContext } from "./SettingsContext";
import { load, Store } from "@tauri-apps/plugin-store";
import { DEFAULT_USERNAME } from "@/constant/default";

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userName, setUserName] = useState<Name>(DEFAULT_USERNAME);
  const [userRole, setUserRole] = useState<UserRole>();
  const [llmSource, setLlmSource] = useState<LLMSource>();
  const [openaiAPIKey, setOpenaiAPIKey] = useState<string>();
  const [saplingAPIKey, setSaplingAPIKey] = useState<string>();
  const [ttsConfig, setTTSConfig] = useState<TTSConfig>({
    rate: 0.8,
    pitch: 0.9,
    volume: 1,
    voiceIndex: 0,
  });

  const loadSettings = async () => {
    let config: Store | null = null;
    let apiKeys: Store | null = null;
    try {
      config = await load("store.config", { autoSave: false });

      const _userName = await config.get<Name>("user_name");
      _userName && setUserName(_userName);

      const _userRole = await config.get<UserRole>("user_role");
      setUserRole(_userRole);

      const _llmSource = await config.get<LLMSource>("llm_source");
      _llmSource && setLlmSource(_llmSource);

      const _tts = await config.get<TTSConfig>("tts_config");
      _tts && setTTSConfig(_tts);

      if (_llmSource === "INTERNET") {
        apiKeys = await load("store.apikeys", { autoSave: false });
        const _openai = await apiKeys.get<string>("openai");
        setOpenaiAPIKey(_openai);
        const _sapling = await apiKeys.get<string>("sapling");
        setSaplingAPIKey(_sapling?.length ? _sapling : undefined);
      }
    } catch (error) {
      console.error(`SettingsProvider.loadSettings :: ${error}`);
    } finally {
      config && (await config.close());
      apiKeys && (await apiKeys.close());
    }
  };

  const update = async ({
    userName,
    userRole,
    llmSource,
    openaiAPIKey,
    saplingAPIKey,
    ttsConfig,
  }: IUpdate & { ttsConfig?: TTSConfig }) => {
    let config: Store | null = null;
    let apiKeys: Store | null = null;
    try {
      if (userName || userRole || llmSource || ttsConfig) {
        config = await load("store.config", { autoSave: false });
        userName && (await config.set("user_name", userName));
        userRole && (await config.set("user_role", userRole));
        llmSource && (await config.set("llm_source", llmSource));
        ttsConfig && (await config.set("tts_config", ttsConfig));
        await config.save();
      }

      if (openaiAPIKey || saplingAPIKey) {
        apiKeys = await load("store.apikeys", { autoSave: false });
        openaiAPIKey && (await apiKeys.set("openai", openaiAPIKey));
        saplingAPIKey && (await apiKeys.set("sapling", saplingAPIKey));
        await apiKeys.save();
      }
    } catch (error) {
      alert(`SettingsProvider.update :: ${error}`);
    } finally {
      config && (await config.close());
      apiKeys && (await apiKeys.close());
    }

    await loadSettings();
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        userName,
        userRole,
        llmSource,
        openaiAPIKey,
        saplingAPIKey,
        ttsConfig,
        update,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
