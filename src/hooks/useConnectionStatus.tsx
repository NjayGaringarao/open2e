import { useState, useEffect } from "react";

export const useConnectionStatus = () => {
  const [status, setStatus] = useState<"ONLINE" | "OFFLINE">(
    navigator.onLine ? "ONLINE" : "OFFLINE"
  );

  useEffect(() => {
    const handleOnline = () => setStatus("ONLINE");
    const handleOffline = () => setStatus("OFFLINE");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return status as "ONLINE" | "OFFLINE";
};
