import icon from "@/constant/icon";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { Article } from "@/types/evaluation/learner"; // adjust path if needed
import { openUrl } from "@tauri-apps/plugin-opener"; // opens default browser
import clsx from "clsx";
import { useEffect, useState } from "react";

interface Props {
  article: Article;
}

export default function ArticleItem({ article }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const status = useConnectionStatus();
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const url = new URL(article.url);
        setPreviewImage(
          `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`
        );
      } catch {
        setPreviewImage(null);
      }
    };

    fetchPreview();
  }, [article.url]);

  const handleClick = () => {
    openUrl(article.url); // Tauri opens in external browser
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "flex gap-2 items-center",
        "p-2 rounded-md transition-colors",
        "cursor-pointer",
        "hover:border hover:border-primary",
        "shadow-uGrayLight shadow-sm"
      )}
    >
      {}
      <img
        src={status === "ONLINE" && previewImage ? previewImage : icon.google}
        alt="preview"
        className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-uGrayLightLight p-2"
      />
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-uGray line-clamp-1">
          {article.title}
        </h3>
        <p className="text-xs text-uGrayLight line-clamp-2">
          {article.subtitle}
        </p>
      </div>
    </div>
  );
}
