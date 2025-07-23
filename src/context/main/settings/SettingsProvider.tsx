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
  const [openaiAPIKey, setOpenaiAPIKey] = useState<string | undefined>();

  const loadSettings = async () => {
    let config: Store | null = null;
    let apiKeys: Store | null = null;
    try {
      // Config
      config = await load("store.config", { autoSave: false });

      const name = await config.get<Name>("user_name");
      name && setUserName(name);

      setUserRole(await config.get<UserRole>("user_role"));
      setLlmSource(await config.get<LLMSource>("llm_source"));

      // Apikeys
      apiKeys = await load("store.apikeys", { autoSave: false });
      setOpenaiAPIKey(await apiKeys.get<string>("openai"));
    } catch (error) {
      alert(`SettingsProvider.loadSettings :: ${error}`);
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
      if (openaiAPIKey) {
        apiKeys = await load("store.apiKeys", { autoSave: false });
        await apiKeys.set("openai", openaiAPIKey);
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
      value={{ userName, userRole, llmSource, openaiAPIKey, update }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
