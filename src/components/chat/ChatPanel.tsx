import { useEffect, useRef } from "react";
import { useChat } from "@/context/main/chat/useChat";
import MessageBubble from "./MessageBubble";
import { useSettings } from "@/context/main/settings";

const ChatPanel = () => {
  const { messages, isGenerating } = useChat();
  const { userName } = useSettings();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // auto-scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  if (messages.length > 0) {
    return (
      <div
        ref={scrollRef}
        className="flex-1 flex flex-col items-center w-full overflow-y-auto"
      >
        <div className="flex flex-col w-full min-w-3xl max-w-4xl p-8">
          <div className="h-20" />
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {!!isGenerating && <MessageBubble key="holder" />}
          <div className="h-20" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="py-6 max-w-3xl">
        <p className="text-uGray text-2xl">
          Hello {userName.first}, Let's talk about Computers!
        </p>
      </div>
    );
  }
};

export default ChatPanel;
