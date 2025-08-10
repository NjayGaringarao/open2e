import { InputMessage, OutputMessage } from "@/types/chat";
import { fetch } from "@tauri-apps/plugin-http";
import { OPEN2E_BACKEND } from "@/constant/hostname";

export const chat = async (
  conversation: InputMessage[]
): Promise<{ reply?: OutputMessage; error?: string }> => {
  try {
    const res = await fetch(`${OPEN2E_BACKEND}/api/chat/v1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation }),
    });

    if (!res.ok) {
      return { error: await res.text() };
    }

    return await res.json();
  } catch (error: any) {
    return { error: error.message || "Network error" };
  }
};
