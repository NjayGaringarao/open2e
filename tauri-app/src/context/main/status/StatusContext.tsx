import { createContext } from "react";

export enum LLMStatus {
  ONLINE = "ONLINE",
  OFFLINE_READY = "OFFLINE_READY",
  OFFLINE_LOW_RAM = "OFFLINE_LOW_RAM",
  OFFLINE_NOT_SETUP = "OFFLINE_NOT_SETUP",
}

export type ConnectionState = "ONLINE" | "OFFLINE";

export type StatusContextValue = {
  status: LLMStatus;
  connectionStatus: ConnectionState;
  hasRequiredMemory: boolean;
  hasLocalLLM: boolean;
  isCheckingConnection: boolean;
  isCheckingLocalLLM: boolean;
  hasCheckedLocalLLM: boolean;
  refreshLocalLLM: () => Promise<void>;
};

export const StatusContext = createContext<StatusContextValue | null>(null);

