import { createContext } from "react";
import { Conversation, Message } from "@/models";

export interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isGenerating: boolean;
  removeConversation: (convo: Conversation) => Promise<void>;
  updateConversation: (convo: Conversation) => Promise<void>;
  sendMessage: (content: string, fromOtherPage: boolean) => Promise<void>;
  updateActiveConversation: (convo: Conversation | null) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | null>(null);
