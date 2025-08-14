import ollama from "ollama";
import { EVALUATION_MODEL } from "./models";
import { Message } from "@/models";
import { nanoid } from "nanoid";
import { getChatContext } from "../context/chat";
import { invoke } from "@tauri-apps/api/core";

export const chat = async (conversation: Message[]): Promise<Message> => {
  const now = new Date().toISOString();
  try {
    await invoke("initialize_ollama");
    const res = await ollama.chat({
      model: EVALUATION_MODEL,
      options: {
        temperature: 0,
      },
      messages: [
        { role: "system", content: getChatContext() },
        ...conversation,
      ],
    });

    return {
      id: nanoid(),
      conversation_id: conversation[0].conversation_id,
      role: "assistant",
      status: "SUCCESS",
      content: res.message.content,

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
        "Failed to run local llm. Please restart your computer for Windows to initilize the LLM. If this persist after restart, perform llm reinstallation from the settings.",
      created_at: now,
      updated_at: now,
    };
  }
};
