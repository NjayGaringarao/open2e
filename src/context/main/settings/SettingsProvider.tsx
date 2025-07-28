import { LLMSource, Name, UserRole } from "@/types/config";
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
  const [gptZeroAPIKey, setGPTZeroAPIKey] = useState<string>();

  const loadSettings = async () => {
    let config: Store | null = null;
    let apiKeys: Store | null = null;
    try {
      // Config
      config = await load("store.config", { autoSave: false });

      const _userName = await config.get<Name>("user_name");
      _userName && setUserName(_userName);

      const _userRole = await config.get<UserRole>("user_role");
      setUserRole(_userRole);

      const _llmSource = await config.get<LLMSource>("llm_source");
      _llmSource && setLlmSource(_llmSource);

      // Apikeys
      if (_llmSource === "INTERNET") {
        apiKeys = await load("store.apikeys", { autoSave: false });
        const _openai = await apiKeys.get<string>("openai");
        setOpenaiAPIKey(_openai);
        const _gptZero = await apiKeys.get<string>("gptZero");
        setGPTZeroAPIKey(_gptZero?.length ? _gptZero : undefined);
      }
    } catch (error) {
      console.error(`SettingsProvider.loadSettings :: ${error}`);
    } finally {
      // NOTE: These causes an uncaught promise...
      // IDK WHY, But it works just fine.
      // TODO: Resolve the issue
      config && (await config.close());
      apiKeys && (await apiKeys.close());
    }
  };

  const update = async ({
    userName,
    userRole,
    llmSource,
    openaiAPIKey,
    gptZeroAPIKey,
  }: IUpdate) => {
    let config: Store | null = null;
    let apiKeys: Store | null = null;
    try {
      // Update Config
      if (userName || userRole || llmSource) {
        config = await load("store.config", { autoSave: false });
        userName && (await config.set("user_name", userName));
        userRole && (await config.set("user_role", userRole));
        llmSource && (await config.set("llm_source", llmSource));
        await config.save();
      }

      // Update Api keys
      if (openaiAPIKey || gptZeroAPIKey) {
        apiKeys = await load("store.apikeys", { autoSave: false });
        openaiAPIKey && (await apiKeys.set("openai", openaiAPIKey));
        gptZeroAPIKey && (await apiKeys.set("gptZero", gptZeroAPIKey));
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
        gptZeroAPIKey,
        update,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
