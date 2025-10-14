import { useState, useEffect, useCallback } from "react";
import { fetch } from "@tauri-apps/plugin-http";

const CONFIG = {
  checkUrls: [
    "https://www.google.com/generate_204",
    "https://1.1.1.1/cdn-cgi/trace",
  ],
  timeout: 8000,
  checkInterval: 10000,
  initialDelay: 1000,
};

type ConnectionStatus = "ONLINE" | "OFFLINE";

// Helper: Check a single URL with timeout
async function checkUrl(url: string, timeout: number): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    clearTimeout(timeoutId);
    return false;
  }
}

// Helper: Try all URLs until one succeeds
async function checkAnyUrl(urls: string[], timeout: number): Promise<boolean> {
  for (const url of urls) {
    const isReachable = await checkUrl(url, timeout);
    if (isReachable) return true;
  }
  return false;
}

export const useConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>("ONLINE");
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = useCallback(async () => {
    if (!navigator.onLine) {
      setStatus("OFFLINE");
      return;
    }

    setIsChecking(true);
    const isOnline = await checkAnyUrl(CONFIG.checkUrls, CONFIG.timeout);
    setIsChecking(false);
    setStatus(isOnline ? "ONLINE" : "OFFLINE");
  }, []);

  useEffect(() => {
    const initialTimeout = setTimeout(checkConnection, CONFIG.initialDelay);
    const interval = setInterval(checkConnection, CONFIG.checkInterval);

    const handleOnline = () => setStatus("ONLINE");
    const handleOffline = () => setStatus("OFFLINE");
    const handleVisibilityChange = () => {
      if (!document.hidden) checkConnection();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkConnection]);

  return { status, isChecking };
};
