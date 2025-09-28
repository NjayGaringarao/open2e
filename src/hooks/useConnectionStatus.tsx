import { useState, useEffect, useCallback } from "react";
import { fetch } from "@tauri-apps/plugin-http";

// Configuration for network checking
const NETWORK_CHECK_CONFIG = {
  // URLs to check for connectivity (in order of preference)
  // Start with allowed URLs, then try external ones
  checkUrls: [
    "https://open2e.vercel.app/api/health", // Your own API first
    "https://www.google.com",
    "https://www.cloudflare.com",
    "https://httpbin.org/status/200"
  ],
  // Timeout for each request (in milliseconds)
  timeout: 8000,
  // How often to check connectivity (in milliseconds)
  checkInterval: 30000,
  // Initial delay before first check (in milliseconds)
  initialDelay: 1000
};

export const useConnectionStatus = () => {
  // Start with a more optimistic initial state, but still check
  const [status, setStatus] = useState<"ONLINE" | "OFFLINE">("ONLINE");
  const [isChecking, setIsChecking] = useState(false);

  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    console.log("🔍 Starting network connectivity check...");
    setIsChecking(true);
    
    // First try with the configured URLs
    for (const url of NETWORK_CHECK_CONFIG.checkUrls) {
      try {
        console.log(`🌐 Checking connectivity with: ${url}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`⏰ Timeout reached for ${url}`);
          controller.abort();
        }, NETWORK_CHECK_CONFIG.timeout);
        
        const response = await fetch(url, {
          method: "HEAD",
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        });
        
        clearTimeout(timeoutId);
        console.log(`✅ Response from ${url}:`, {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        });
        
        if (response.ok) {
          console.log("🎉 Network connectivity confirmed!");
          setIsChecking(false);
          return true;
        } else {
          console.log(`❌ Non-OK response from ${url}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error(`💥 Network check failed for ${url}:`, error);
        // Continue to next URL if this one fails
      }
    }
    
    // Fallback: Try a simple GET request to a known working endpoint
    try {
      console.log("🔄 Trying fallback connectivity check...");
      const fallbackResponse = await fetch("https://open2e.vercel.app", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });
      
      if (fallbackResponse.ok) {
        console.log("🎉 Fallback connectivity check successful!");
        setIsChecking(false);
        return true;
      }
    } catch (error) {
      console.error("💥 Fallback connectivity check failed:", error);
    }
    
    console.log("❌ All network checks failed - marking as offline");
    setIsChecking(false);
    return false;
  }, []);

  const updateConnectionStatus = useCallback(async () => {
    // First check if navigator.onLine indicates offline - if so, trust it
    if (!navigator.onLine) {
      console.log("📱 Navigator indicates offline - marking as offline");
      setStatus("OFFLINE");
      return;
    }
    
    // If navigator says online, verify with actual HTTP request
    const isOnline = await checkConnectivity();
    setStatus(isOnline ? "ONLINE" : "OFFLINE");
  }, [checkConnectivity]);

  useEffect(() => {
    // Initial check with delay
    const initialTimeout = setTimeout(updateConnectionStatus, NETWORK_CHECK_CONFIG.initialDelay);
    
    // Set up periodic checking
    const interval = setInterval(updateConnectionStatus, NETWORK_CHECK_CONFIG.checkInterval);
    
    // Also listen to browser events as a fallback (though they may not work reliably in Tauri)
    const handleOnline = () => setStatus("ONLINE");
    const handleOffline = () => setStatus("OFFLINE");
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    // Listen for visibility change to check connectivity when app becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateConnectionStatus();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [updateConnectionStatus]);

  return { 
    status: status as "ONLINE" | "OFFLINE", 
    isChecking 
  };
};
