import { openUrl } from "@tauri-apps/plugin-opener";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IMarkdown {
  text?: string;
}

const cleanMarkdown = (text: string = "") =>
  text.replace(/(\d+\..+)\n\s*\n(?=\d+\.)/g, "$1\n");

const Markdown = ({ text }: IMarkdown) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => (
          <button
            onClick={() => href && openUrl(href).catch(console.error)}
            className="text-primary underline underline-offset-4 hover:opacity-80 text-left"
          >
            {children}
          </button>
        ),
      }}
    >
      {cleanMarkdown(text)}
    </ReactMarkdown>
  );
};

export default Markdown;
