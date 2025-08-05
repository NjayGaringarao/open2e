import { useState } from "react";
import { useChat } from "@/context/main/chat/useChat";
import { SendHorizonal } from "lucide-react";
import ParagraphBox from "../ParagraphBox";
import clsx from "clsx";

const ChatInput = () => {
  const { sendMessage, isLoading, isGenerating } = useChat();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = isLoading || isGenerating;

  return (
    <div className="absolute w-full z-30 flex flex-col items-center px-6 bottom-6">
      <div
        className={clsx(
          "w-full min-w-3xl max-w-4xl p-4 z-30",
          "bg-white/90 dark:bg-black/80 backdrop-blur-sm",
          "rounded-md shadow-md",
          "flex flex-col items-center"
        )}
      >
        <div className="flex flex-row gap-4 w-full min-w-3xl max-w-4xl">
          <ParagraphBox
            value={input}
            setValue={setInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={isDisabled}
            containerClassname="flex-1"
            inputClassName="py-1 pl-4 text-lg max-h-72 bg-transparent rounded-xl font-sans"
            withVoiceInput
          />
          <button onClick={handleSend} disabled={!input.trim() || isDisabled}>
            <SendHorizonal className="text-uGrayLight hover:text-primary h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
