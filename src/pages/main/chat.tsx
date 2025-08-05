import ChatPanel from "@/components/chat/ChatPanel";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/context/main/chat";
import { useEffect, useRef } from "react";
import ConversationPanel from "@/components/chat/ConversationPanel";
import ChatTitle from "@/components/chat/ChatTitle";

export default function Chat() {
  const { messages, activeConversation } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // auto-scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="reltive flex h-screen flex-row gap-6 ">
      {/* Chat layout */}
      <div className="flex-1 h-full p-6 flex flex-col items-center justify-center">
        {!!activeConversation && <ChatTitle />}

        <ChatPanel />

        <ChatInput />
      </div>

      {/* Sidebar for conversation list */}

      <ConversationPanel />
    </div>
  );
}
