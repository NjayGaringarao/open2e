import { LLMSource, Name, UserRole } from "@/types/types";
import React, { useEffect, useState } from "react";
import { IHandleUpdate, SettingsContext } from "./SettingsContext";
import { load } from "@tauri-apps/plugin-store";

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userName, setUserName] = useState<Name>({});
  const [userRole, setUserRole] = useState<UserRole>();
  const [llmSource, setLlmSource] = useState<LLMSource>();
  const [openaiAPIKey, setOpenaiAPIKey] = useState<string | undefined>();

  const loadSettings = async () => {
    // Config
    const config = await load("store.config", { autoSave: false });
    setUserName((await config.get<Name>("username")) ?? {});
    setUserRole(await config.get<UserRole>("user_role"));
    setLlmSource(await config.get<LLMSource>("llm_source"));
    await config.close();

    // Apikeys
    const apiKeys = await load("store.apikeys", { autoSave: false });
    setOpenaiAPIKey(await apiKeys.get<string>("openai"));
    await apiKeys.close();
  };

  const handleUpdate = async ({
    userName,
    userRole,
    llmSource,
    openaiAPIKey,
  }: IHandleUpdate) => {
    // Update Config
    if (userName || userRole || llmSource) {
      const config = await load("store.config", { autoSave: false });
      userName && (await config.set("user_name", userName));
      userRole && (await config.set("user_role", userRole));
      llmSource && (await config.set("llm_source", llmSource));
      config.close();
    }

    // Update Api keys
    if (openaiAPIKey) {
      const apikeys = await load("store.apiKeys", { autoSave: false });
      await apikeys.set("openai", openaiAPIKey);
      apikeys.close();
    }

    await loadSettings();
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{ userName, userRole, llmSource, openaiAPIKey, handleUpdate }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
