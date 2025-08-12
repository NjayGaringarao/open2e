import { fetch } from "@tauri-apps/plugin-http";
import { OPEN2E_BACKEND } from "@/constant/hostname";

export const detectAI = async (
  answer: string
): Promise<{ percent: number; error?: string; message?: string }> => {
  try {
    const res = await fetch(`${OPEN2E_BACKEND}/api/detectAI/v1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    if (!res.ok) {
      return {
        percent: 0,
        error: "Failed to connect to the AI Detection service.",
      };
    }

    const data = await res.json();

    return {
      percent: data.percent,
      message: data.message,
    };
  } catch (error: any) {
    console.warn(error.message);

    return {
      percent: 0,
      error: "Failed to run ai detection.",
      message: "",
    };
  }
};
