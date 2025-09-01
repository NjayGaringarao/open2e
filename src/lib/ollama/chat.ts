import { EVALUATION_MODEL } from "./models";
import { Message } from "@/models";
import { nanoid } from "nanoid";
import { getChatContext } from "../context/chat";
import { invoke } from "@tauri-apps/api/core";

export const chat = async (conversation: Message[]): Promise<Message> => {
  const now = new Date().toISOString();

  try {
    // optional: keep your existing initialization step
    await invoke("initialize_ollama");

    const messages = [
      { role: "system", content: getChatContext() },
      ...conversation,
    ];

    const body = {
      model: EVALUATION_MODEL,
      messages,
      temperature: 0,
      stream: false,
    };

    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Ollama’s /api/chat response shape usually contains `message.content`
    const content =
      data?.message?.content ??
      data?.response ??
      (typeof data === "string" ? data : null) ??
      (Array.isArray(data)
        ? data[0]?.content ?? data[0]?.message?.content
        : null) ??
      "";

    return {
      id: nanoid(),
      conversation_id: conversation[0].conversation_id,
      role: "assistant",
      status: "SUCCESS",
      content,
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
        "Failed to run local LLM. Please restart your computer for Windows to initialize the LLM. If this persists after restart, perform LLM reinstallation from the settings.",
      created_at: now,
      updated_at: now,
    };
  }
};
