import { TTSConfig } from "@/types/config";
import React, { useEffect, useState } from "react";
import { IUpdate, SettingsContext } from "./SettingsContext";
import { load, Store } from "@tauri-apps/plugin-store";
import { invoke } from "@tauri-apps/api/core";
import { hashSHA256 } from "@/utils/string";

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [systemMemory, setSystemMemory] = useState(0);
  const [ttsConfig, setTTSConfig] = useState<TTSConfig>({
    rate: 0.8,
    pitch: 0.9,
    volume: 1,
    voiceIndex: 0,
  });
  const [adminPasswordHash, setAdminPasswordHash] = useState<string | undefined>(undefined);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const loadSettings = async () => {
    let config: Store | null = null;

    try {
      config = await load("store.config", { autoSave: false });

      const _tts = await config.get<TTSConfig>("tts_config");
      _tts && setTTSConfig(_tts);

      const _adminHash = await config.get<string>("admin_password_hash");
      if (_adminHash) setAdminPasswordHash(_adminHash);
    } catch (error) {
      console.error(`SettingsProvider.loadSettings :: ${error}`);
    } finally {
      config && (await config.close());
    }
  };

  const update = async ({ ttsConfig }: IUpdate & { ttsConfig?: TTSConfig }) => {
    let config: Store | null = null;

    try {
      config = await load("store.config", { autoSave: false });
      ttsConfig && (await config.set("tts_config", ttsConfig));
      await config.save();
    } catch (error) {
      alert(`SettingsProvider.update :: ${error}`);
    } finally {
      config && (await config.close());
    }

    await loadSettings();
  };

  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      const hash = await hashSHA256(password);
      // Reload current stored hash in case it changed
      let config: Store | null = null;
      try {
        config = await load("store.config", { autoSave: false });
        const stored = await config.get<string>("admin_password_hash");
        if (stored && stored === hash) {
          setIsAdminLoggedIn(true);
          setAdminPasswordHash(stored);
          return true;
        }
        setIsAdminLoggedIn(false);
        return false;
      } finally {
        config && (await config.close());
      }
    } catch (error) {
      alert(`SettingsProvider.loginAdmin :: ${error}`);
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  const updateAdminPassword = async (newPassword: string) => {
    let config: Store | null = null;
    try {
      const newHash = await hashSHA256(newPassword);
      config = await load("store.config", { autoSave: false });
      await config.set("admin_password_hash", newHash);
      await config.save();
      setAdminPasswordHash(newHash);
    } catch (error) {
      alert(`SettingsProvider.updateAdminPassword :: ${error}`);
    } finally {
      config && (await config.close());
    }
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
        systemMemory,
        ttsConfig,
        update,
        adminPasswordHash,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        updateAdminPassword,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
