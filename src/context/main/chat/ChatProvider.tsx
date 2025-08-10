import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

import * as convoDB from "@/database/chat/conversation";
import type { Conversation, Message } from "@/models";
import { ChatContext } from "./ChatContext";
import {
  addMessageDB,
  createConversationName,
  fetchMessagesByConversationFromDB,
  updateMessageDB,
} from "./utils";

import { chat } from "@/lib/openai/chat";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const status = useConnectionStatus();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-load existing conversations on mount
  useEffect(() => {
    loadConversations(true);
  }, []);

  const loadConversations = async (setFirstAsActive?: boolean) => {
    setIsLoading(true);
    const { conversations, error } = await convoDB.getAll();
    if (!error && conversations) {
      setConversations(conversations);
      if (conversations.length && setFirstAsActive) {
        setActiveConversation(conversations[0]);
        loadMessages(conversations[0]);
      }
    }
    setIsLoading(false);
  };

  const loadMessages = async (convo: Conversation | null) => {
    if (convo) {
      setIsLoading(true);
      setMessages(await fetchMessagesByConversationFromDB(convo));
      setIsLoading(false);
    } else {
      setMessages([]);
    }
  };

  const startConversation = async () => {
    const now = new Date().toISOString();
    const id = nanoid();
    const title = await createConversationName();

    // Save to Database
    const { conversation, error } = await convoDB.create(title, id, now);
    if (error || !conversation) {
      console.error(error ?? "Failed to create conversation");
      return null;
    }

    // Set the new conversation as active
    setActiveConversation(conversation);

    // Clear Messages
    setMessages([]);

    // Update conversation list
    await loadConversations();

    return conversation;
  };

  const sendMessage = async (
    content: string,
    fromOtherPage: boolean = false
  ) => {
    let conversation = activeConversation;
    const now = new Date().toISOString();

    if (!content.trim()) return;

    if (!conversation || fromOtherPage) {
      conversation = await startConversation();
      if (!conversation) return;
    }

    const newMessage: Message = {
      id: nanoid(),
      conversation_id: conversation.id,
      role: "user",
      content,
      status: "SENT",
      created_at: now,
      updated_at: now,
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMessage]);

    await addMessageDB(newMessage);
  };

  const generateReply = async () => {
    if (!activeConversation) return;

    const lastMessage = messages.length ? messages[messages.length - 1] : null;
    const isGeneratable =
      lastMessage &&
      lastMessage.role === "user" &&
      lastMessage.status === "SENT";

    if (!isGeneratable) return;

    setIsGenerating(true);

    const now = new Date().toISOString();
    let replyFromLLM: Message | null = null;

    if (status === "ONLINE") {
      const { reply: rpl, error } = await chat(messages);
      if (!error && rpl) {
        replyFromLLM = {
          id: nanoid(),
          conversation_id: activeConversation.id,
          role: "assistant",
          status: "SUCCESS", // type-safe
          content: rpl.content,
          created_at: now,
          updated_at: now,
        };
      }
    } else {
      await new Promise((r) => setTimeout(r, 200));
      replyFromLLM = {
        id: nanoid(),
        conversation_id: activeConversation.id,
        role: "assistant",
        status: "SUCCESS", // type-safe
        content: "This is a dummy reply",
        created_at: now,
        updated_at: now,
      };
    }

    if (replyFromLLM && lastMessage) {
      const updatedUserMessage: Message = {
        ...lastMessage,
        status: "SUCCESS",
      };

      // Optimistically update the state
      setMessages((prev): Message[] => [
        ...prev.map((msg) =>
          msg.id === lastMessage.id ? updatedUserMessage : msg
        ),
        replyFromLLM!,
      ]);

      await addMessageDB(replyFromLLM);
      await updateMessageDB(updatedUserMessage);
    } else if (lastMessage) {
      const failedUserMessage: Message = {
        ...lastMessage,
        status: "FAILED",
      };

      setMessages((prev): Message[] =>
        prev.map((msg) => (msg.id === lastMessage.id ? failedUserMessage : msg))
      );

      await updateMessageDB(failedUserMessage);
    }

    setIsGenerating(false);
  };

  const removeConversation = async (convo: Conversation) => {
    await convoDB.remove(convo.id);
    await loadConversations();
    if (activeConversation?.id === convo.id) {
      setActiveConversation(null);
      setMessages([]);
    }
  };

  const updateConversation = async (convo: Conversation) => {
    await convoDB.update({ ...convo, updated_at: new Date().toString() });
    await loadConversations();
    if (convo.id === activeConversation?.id) {
      setActiveConversation(convo);
    }
  };

  const updateActiveConversation = async (convo: Conversation | null) => {
    setActiveConversation(convo);
    await loadMessages(convo);
  };

  useEffect(() => {
    generateReply();
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        isLoading,
        isGenerating,
        sendMessage,
        removeConversation,
        updateConversation,
        updateActiveConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
