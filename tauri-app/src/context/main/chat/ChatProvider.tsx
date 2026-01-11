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

import * as openai from "@/lib/openai";
import * as ollama from "@/lib/ollama";
import { useSettings } from "@/context/main/settings";
import { RECOMMENDED_MEMORY } from "@/constant/memory";
import { useStatus, LLMStatus } from "@/context/main/status";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { status: llmStatus } = useStatus();
  const { systemMemory } = useSettings();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [firstReplySuffix, setFirstReplySuffixState] = useState<string | null>(null);

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

  const enqueueAssistantMessage = async (
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
      role: "assistant",
      content,
      status: "SUCCESS",
      created_at: now,
      updated_at: now,
    };

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

    let replyFromLLM: Message | null = null;

    if (llmStatus === LLMStatus.ONLINE) {
      replyFromLLM = await openai.chat(messages);
    } else if (llmStatus === LLMStatus.OFFLINE_READY) {
      replyFromLLM = await ollama.chat(messages);
    } else {
      const now = new Date().toISOString();
      const reason =
        llmStatus === LLMStatus.OFFLINE_LOW_RAM
          ? `Chat is unavailable. Your system requires at least ${RECOMMENDED_MEMORY}GB of memory (currently ${systemMemory}GB). Please connect to the internet to continue.`
          : "Chat is unavailable. Install Ollama and the phi4-mini model or reconnect to the internet.";
      const errorMessage: Message = {
        id: nanoid(),
        conversation_id: activeConversation.id,
        role: "assistant",
        status: "FAILED",
        content: firstReplySuffix ? `${reason}\n\n${firstReplySuffix}` : reason,
        created_at: now,
        updated_at: now,
      };
      setMessages((prev) => [...prev, errorMessage]);
      if (firstReplySuffix) setFirstReplySuffixState(null);
      setIsGenerating(false);
      return;
    }

    if (replyFromLLM && lastMessage) {
      const updatedUserMessage: Message = {
        ...lastMessage,
        status: "SUCCESS",
      };

      // Append one-time suffix to the first assistant reply, if provided
      if (firstReplySuffix) {
        replyFromLLM = {
          ...replyFromLLM,
          content: `${replyFromLLM.content}\n\n${firstReplySuffix}`,
        };
        setFirstReplySuffixState(null);
      }

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
        enqueueAssistantMessage,
        removeConversation,
        updateConversation,
        updateActiveConversation,
        setFirstReplySuffix: (suffix: string | null) => setFirstReplySuffixState(suffix),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
