import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { StatusContext, LLMStatus } from "./StatusContext";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useSettings } from "@/context/main/settings";
import { RECOMMENDED_MEMORY } from "@/constant/memory";
import { isLocalLLMInstalled } from "@/lib/ollama/utils";

export const StatusProvider = ({ children }: { children: ReactNode }) => {
  const { status: connectionStatus, isChecking: isCheckingConnection } =
    useConnectionStatus();
  const { systemMemory } = useSettings();
  const [hasLocalLLM, setHasLocalLLM] = useState(false);
  const [hasCheckedLocalLLM, setHasCheckedLocalLLM] = useState(false);
  const [isCheckingLocalLLM, setIsCheckingLocalLLM] = useState(false);

  const refreshLocalLLM = useCallback(async () => {
    setIsCheckingLocalLLM(true);
    try {
      const installed = await isLocalLLMInstalled();
      setHasLocalLLM(installed);
    } catch (error) {
      console.error("StatusProvider.refreshLocalLLM ::", error);
      setHasLocalLLM(false);
    } finally {
      setHasCheckedLocalLLM(true);
      setIsCheckingLocalLLM(false);
    }
  }, []);

  useEffect(() => {
    refreshLocalLLM();
  }, [refreshLocalLLM]);

  useEffect(() => {
    if (connectionStatus === "OFFLINE") {
      refreshLocalLLM();
    }
  }, [connectionStatus, refreshLocalLLM]);

  const hasRequiredMemory = useMemo(
    () => systemMemory >= RECOMMENDED_MEMORY,
    [systemMemory]
  );

  const status = useMemo(() => {
    if (connectionStatus === "ONLINE") {
      return LLMStatus.ONLINE;
    }

    if (!hasRequiredMemory) {
      return LLMStatus.OFFLINE_LOW_RAM;
    }

    if (hasLocalLLM) {
      return LLMStatus.OFFLINE_READY;
    }

    return LLMStatus.OFFLINE_NOT_SETUP;
  }, [connectionStatus, hasRequiredMemory, hasLocalLLM]);

  const value = useMemo(
    () => ({
      status,
      connectionStatus,
      hasRequiredMemory,
      hasLocalLLM,
      isCheckingConnection,
      isCheckingLocalLLM,
      hasCheckedLocalLLM,
      refreshLocalLLM,
    }),
    [
      status,
      connectionStatus,
      hasRequiredMemory,
      hasLocalLLM,
      isCheckingConnection,
      isCheckingLocalLLM,
      hasCheckedLocalLLM,
      refreshLocalLLM,
    ]
  );

  return (
    <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
  );
};

