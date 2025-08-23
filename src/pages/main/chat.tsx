import ChatPanel from "@/components/chat/ChatPanel";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/context/main/chat";
import { useEffect, useRef, useState } from "react";
import ConversationPanel from "@/components/chat/ConversationPanel";
import ChatTitle from "@/components/chat/ChatTitle";
import HowToUseButton from "@/components/HowToUseButton";
import { useScreenSize } from "@/hooks/useScreenSIze";

export default function Chat() {
  const { messages, activeConversation } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSize();
  const showRightPanel = screenSize === "large" || screenSize === "extralarge";
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(false);

  useEffect(() => {
    // auto-scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative h-screen flex flex-row">
      {/* Chat layout */}
      <div className="w-full h-full flex flex-col items-center justify-center">
        {!!activeConversation && <ChatTitle />}

        <ChatPanel />

        <ChatInput />
      </div>

      {/* Sidebar for conversation list */}

      <ConversationPanel />

      {/* How to Use Button */}
      <HowToUseButton 
        page="chat" 
        onPanelVisibilityChange={setIsRightPanelVisible}
      />
    </div>
  );
}
