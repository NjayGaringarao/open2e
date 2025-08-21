import { openUrl } from "@tauri-apps/plugin-opener";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // optional: keep or swap theme

interface IMarkdown {
  text?: string;
  className?: string;
}

const Markdown = ({ text = "", className = "" }: IMarkdown) => {
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
            <h1 className="text-background text-xl font-semibold leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-panel text-lg font-semibold leading-snug">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-panel text-lg font-medium leading-snug">
              {children}
            </h3>
          ),

          /* Paragraphs & lists: reduced bottom margin */
          p: ({ children }) => (
            <p className="text-base text-panel mb-2 last:mb-0 whitespace-pre-wrap break-words">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-base whitespace-pre-wrap break-words">{children}</li>
          ),

          /* Blockquote: subtle left border + light background */
          blockquote: ({ children }) => (
            <blockquote className=" pl-4 italic text-base text-panel bg-uGray rounded-sm py-2 mb-2 last:mb-0 whitespace-pre-wrap break-words">
              {children}
            </blockquote>
          ),

          /* Horizontal rule: slim and subtle */
          hr: () => <hr className=" border-t border-uGrayLightLight" />,

          /* Table: compact, scrollable on small screens */
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full text-base text-panel border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-2 py-1 text-left text-base font-medium border-b border-uGrayLightLight">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-2 py-1 text-base border-b border-uGrayLightLight">
              {children}
            </td>
          ),

          /* Code: inline is subtle; block is monospace with a thin border */
          code: ({ className, children }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-panel rounded px-1 py-0.5 text-uGray text-base font-mono">
                {children}
              </code>
            ) : (
              <pre className=" p-3 rounded-md overflow-x-auto text-base max-w-full whitespace-pre">
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
