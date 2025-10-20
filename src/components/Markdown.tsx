import { openUrl } from "@tauri-apps/plugin-opener";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useColorMode } from "@/components/ui/color-mode";
import "highlight.js/styles/github.css"; // optional: keep or swap theme

interface IMarkdown {
  text?: string;
  className?: string;
}

const Markdown = ({ text = "", className = "" }: IMarkdown) => {
  const { colorMode } = useColorMode();

  // Check if we should force white text (for chat bubbles)
  const forceWhiteText = className.includes("text-white");
  // Check if we should force black text for AI responses in dark mode
  const forceBlackText = className.includes("ai-response-dark");

  return (
    <div className={`whitespace-pre-wrap break-words ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ href, children }) => (
            <button
              onClick={() => href && openUrl(href).catch(console.error)}
              className="text-primary underline underline-offset-2 hover:opacity-90 p-0 m-0"
            >
              {children}
            </button>
          ),

          /* Headings: smaller top/bottom gaps so content is denser */
          h1: ({ children }) => (
            <h1
              className={`text-xl leading-tight ${
                forceBlackText
                  ? "text-black font-semibold"
                  : forceWhiteText
                  ? "text-white font-semibold"
                  : colorMode === "dark"
                  ? "text-white font-semibold"
                  : "text-uBlack font-semibold"
              }`}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className={`text-lg leading-snug -mb-4 ${
                forceBlackText
                  ? "text-black font-semibold"
                  : forceWhiteText
                  ? "text-white font-semibold"
                  : colorMode === "dark"
                  ? "text-white font-semibold"
                  : "text-uBlack font-semibold"
              }`}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className={`text-lg leading-snug -mb-4 ${
                forceBlackText
                  ? "text-black font-medium"
                  : forceWhiteText
                  ? "text-white font-medium"
                  : colorMode === "dark"
                  ? "text-white font-medium"
                  : "text-uBlack font-semibold"
              }`}
            >
              {children}
            </h3>
          ),

          /* Paragraphs & lists: reduced bottom margin */
          p: ({ children }) => (
            <p
              className={`text-base whitespace-pre-wrap break-words -mb-2 last:mb-0 ${
                forceBlackText
                  ? "text-black font-normal"
                  : forceWhiteText
                  ? "text-white font-normal"
                  : colorMode === "dark"
                  ? "text-white font-normal"
                  : "text-uBlack font-normal"
              }`}
            >
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside">{children}</ol>
          ),
          li: ({ children }) => (
            <li
              className={`text-base whitespace-pre-wrap break-words -mb-2 first:-mt-4 ${
                forceBlackText
                  ? "text-black font-normal"
                  : forceWhiteText
                  ? "text-white font-normal"
                  : colorMode === "dark"
                  ? "text-white font-normal"
                  : "text-uBlack font-normal"
              }`}
            >
              {children}
            </li>
          ),

          /* Blockquote: subtle left border + light background */
          blockquote: ({ children }) => (
            <blockquote
              className={`pl-4 italic text-base rounded-md mb-2 last:mb-0 whitespace-pre-wrap break-words ${
                colorMode === "dark"
                  ? "text-panel bg-uGrayLightLight"
                  : "text-uBlack bg-uGrayLightLight"
              }`}
            >
              {children}
            </blockquote>
          ),

          /* Horizontal rule: slim and subtle */
          hr: () => <hr className=" border-t border-uGrayLightLight" />,

          /* Table: compact, scrollable on small screens */
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table
                className={`min-w-full text-base border-collapse ${
                  forceBlackText
                    ? "text-black"
                    : forceWhiteText
                    ? "text-white"
                    : colorMode === "dark"
                    ? "text-white"
                    : "text-uBlack"
                }`}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th
              className={`px-2 py-1 text-left text-base font-medium border-b border-uGrayLightLight ${
                forceBlackText
                  ? "text-black font-semibold"
                  : forceWhiteText
                  ? "text-white font-semibold"
                  : colorMode === "dark"
                  ? "text-white font-semibold"
                  : "text-uBlack font-semibold"
              }`}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className={`px-2 py-1 text-base border-b border-uGrayLightLight ${
                forceBlackText
                  ? "text-black font-normal"
                  : forceWhiteText
                  ? "text-white font-normal"
                  : colorMode === "dark"
                  ? "text-white font-normal"
                  : "text-uBlack font-normal"
              }`}
            >
              {children}
            </td>
          ),

          /* Code: inline is subtle; block is monospace with a thin border */
          code: ({ className, children }) => {
            const isInline = !className;
            return isInline ? (
              <code
                className={`rounded px-1 py-0.5 text-base font-mono ${
                  colorMode === "dark"
                    ? "bg-panel text-uGray"
                    : "bg-uGrayLightLight text-uBlack"
                }`}
              >
                {children}
              </code>
            ) : (
              <pre
                className={`p-3 rounded-md overflow-x-auto text-base max-w-full whitespace-pre ${
                  colorMode === "dark" ? "bg-panel" : "bg-uGrayLight"
                }`}
              >
                <code className={className}>{children}</code>
              </pre>
            );
          },

          /* Images: responsive and lightly rounded */
          img: ({ src, alt }) => (
            // clicking opens externally (Tauri)
            // eslint-disable-next-line jsx-a11y/alt-text
            <img
              src={src ?? ""}
              alt={alt ?? ""}
              className="max-w-full rounded-md my-3 cursor-pointer"
              onClick={() => src && openUrl(src).catch(console.error)}
            />
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
