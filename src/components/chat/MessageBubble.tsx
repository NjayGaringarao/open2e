import { Message } from "@/models";
import { getDisplayTime } from "@/utils/string";
import clsx from "clsx";
import { User, XCircle } from "lucide-react";
import Markdown from "../Markdown";
import icon from "@/constant/icon";
import { useColorMode } from "@/components/ui/color-mode";

interface Props {
  message?: Message;
  onRetry?: (message: Message) => void; // Optional retry handler
}

const MessageBubble = ({ message, onRetry }: Props) => {
  const { colorMode } = useColorMode();
  
  if (!message) {
    // Loading dots bubble
    return (
      <div className={clsx("flex flex-row gap-2 mb-4")}>
        {/** System Image */}
        <div className="h-8 w-8 rounded-full overflow-hidden border bg-uGray text-balance">
          <img src={icon.logo} alt="logo" />
        </div>
        <div className="py-3 px-3 rounded-xl max-w-[70%] bg-uGrayLightLight whitespace-pre-wrap flex flex-row items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:0s]" />
          <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:0.2s]" />
          <div className="h-2 w-2 rounded-full bg-background animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const time = getDisplayTime(new Date(message.created_at));

  const isSent = message.status === "SENT";
  const isFailed = message.status === "FAILED";
  const isSuccess = message.status === "SUCCESS";

  return (
    <div
      className={clsx(
        "flex gap-2 mb-4",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/** User Image */}
      <div className="h-8 w-8 rounded-full overflow-hidden border bg-uGray text-balance">
        {isUser ? (
          <User className="h-8 w-8" />
        ) : (
          <img src={icon.logo} alt="logo" />
        )}
      </div>

      <div
        className={clsx(
          "animate-fadeIn w-full flex-col gap-1",
          "relative group",
          !isUser && !isAssistant ? "hidden" : "flex flex-col",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/** Message Bubble */}
        <div
          className={clsx(
            "py-2 px-3 rounded-xl max-w-[70%] whitespace-pre-wrap break-words flex gap-2 items-center",
            isUser
              ? "bg-primary text-background"
              : "bg-uGrayLight text-background",
            isFailed && "opacity-60"
          )}
        >
          <div className="w-full flex flex-col">
            <Markdown 
              text={message.content} 
              className={isAssistant ? (colorMode === 'dark' ? "ai-response-dark" : "text-white") : ""}
            />
          </div>
        </div>

        {/* Status Indicators */}
        {isSent && (
          <span className="animate-pulse text-xs text-uGrayLightLight">
            Delivered
          </span>
        )}
        {isFailed && (
          <div className="flex items-center gap-1 text-uRed text-xs">
            <XCircle className="w-4 h-4" />
            <span>Failed. Please chat again.</span>
            {onRetry && (
              <button
                onClick={() => onRetry(message)}
                className="ml-1 hover:underline hover:text-uRed"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Time — only show on hover if SUCCESS */}
        {isSuccess && (
          <p
            className={clsx(
              "absolute -bottom-5 text-uGrayLight text-xs",
              "hidden group-hover:block"
            )}
          >
            {isUser ? "Delivered" : "Recieved"} {time}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
