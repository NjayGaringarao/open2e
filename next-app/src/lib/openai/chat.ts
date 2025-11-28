import { InputMessage, OutputMessage } from "@/types/chat";
import OpenAI from "openai";
import { getChatContext } from "@/lib/context/chat";
import { CHAT_MODEL, OPENAI_API_KEY } from "@/constant/env";

export const chat = async (
  conversation: InputMessage[]
): Promise<{ reply?: OutputMessage; error?: string }> => {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const systemMessage: InputMessage = {
    role: "system",
    content: getChatContext(),
  };

  try {
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [systemMessage, ...conversation.slice(-10)],
    });

    return {
      reply: {
        role: "assistant",
        content:
          response.choices[0].message.content ??
          "I'm sorry, I couldn't generate a response.",
      },
    };
  } catch (error) {
    return { error: `${error}` };
  }
};

export const getMockChat = () => {
  return {
    reply: {
      role: "assistant",
      content: "This Response is for development purpose only.",
    },
  };
};
