import { InputMessage, OutputMessage } from "@/types/chat";
import OpenAI from "openai";
import { createChatContext } from "../context/chat";
import { CHAT_MODEL } from "./models";

export const chat = async (
  apiKey: string,
  question_topic: string,
  conversation: InputMessage[]
): Promise<OutputMessage> => {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const systemMessage: InputMessage = {
    role: "system",
    content: createChatContext(question_topic),
  };

  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [systemMessage, ...conversation.slice(-10)],
  });

  return {
    role: "assistant",
    content:
      response.choices[0].message.content ??
      "I'm sorry, I couldn't generate a response.",
  };
};
