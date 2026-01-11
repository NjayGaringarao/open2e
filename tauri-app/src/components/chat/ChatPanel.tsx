import { useEffect, useRef } from "react";
import { useChat } from "@/context/main/chat/useChat";
import MessageBubble from "./MessageBubble";
import MainContentBox from "../container/MainContentBox";

const ChatPanel = ({ onHrefSelect }: { onHrefSelect?: (href: string) => void }) => {
  const { messages, isGenerating, activeConversation } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // auto-scroll to bottom on new messages
    const scroll = async () => {
      // waiting to load messages
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    scroll();
  }, [messages, isGenerating, activeConversation]);

  return messages.length > 0 ? (
    <MainContentBox ref={scrollRef}>
      <div className="flex-1 flex flex-col w-full">
        <div className="h-20" />
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onHrefSelect={onHrefSelect} />
        ))}
        {!!isGenerating && <MessageBubble key="holder" />}
        <div className="h-20" />
      </div>
    </MainContentBox>
  ) : (
    <MainContentBox className="h-full flex flex-col items-center justify-center">
      <p className="text-uGray text-2xl">Hello, Let's talk about Computers!</p>
    </MainContentBox>
  );
};

export default ChatPanel;
