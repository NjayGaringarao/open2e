import { fetch } from "@tauri-apps/plugin-http";
import { OPEN2E_BACKEND } from "@/constant/hostname";
import { Message } from "@/models";
import { nanoid } from "nanoid";

export const chat = async (conversation: Message[]): Promise<Message> => {
  const now = new Date().toISOString();
  try {
    const res = await fetch(`${OPEN2E_BACKEND}/api/chat/v1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation }),
    });

    if (!res.ok) {
      return {
        id: nanoid(),
        conversation_id: conversation[0].conversation_id,
        role: "assistant",
        status: "FAILED",
        content:
          "Failed to connect to the service. Please check you internet connection.",
        created_at: now,
        updated_at: now,
      };
    }

    const { reply } = await res.json();

    return {
      id: nanoid(),
      conversation_id: conversation[0].conversation_id,
      role: "assistant",
      status: "SUCCESS",
      content: reply?.content,
      created_at: now,
      updated_at: now,
    };
  } catch (error: any) {
    console.warn(error);
    return {
      id: nanoid(),
      conversation_id: conversation[0].conversation_id,
      role: "assistant",
      status: "FAILED",
      content:
        "Failed to connect to the service. Please check you internet connection.",
      created_at: now,
      updated_at: now,
    };
  }
};
