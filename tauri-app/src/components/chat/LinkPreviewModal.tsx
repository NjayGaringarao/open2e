import BaseModal from "@/components/container/BaseModal";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { openUrl } from "@tauri-apps/plugin-opener";

interface LinkPreviewModalProps {
  onClose: () => void;
  href: string | null;
  title?: string;
}

const getFavicon = (urlStr: string) => {
  try {
    const url = new URL(urlStr);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return undefined;
  }
};

export default function LinkPreviewModal({ onClose, href, title }: LinkPreviewModalProps) {
  const { status } = useConnectionStatus();


  return (
    <BaseModal
      isOpen={!!href}
      onClose={onClose}
      title={title ?? "Preview"}
      panelClassName="max-w-6xl"
      contentClassName="p-0"
    >
      {href ? (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 border-b border-uGrayLightLight bg-background">
            <div className="flex items-center gap-3">
              <img
                src={status === "ONLINE" ? getFavicon(href ?? "") : undefined}
                alt="favicon"
                className="w-6 h-6 rounded bg-uGrayLightLight p-1"
              />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-uGray line-clamp-1">{title ?? "Linked Page"}</p>
                <p className="text-xs text-uGrayLight line-clamp-1">{href ?? ""}</p>
              </div>
            </div>
            <button
              className="text-primary text-sm underline underline-offset-2 hover:opacity-90"
              onClick={() => openUrl(href ?? "")}
            >
              Open in browser
            </button>
          </div>

          <div className="flex-1 bg-panel">
            {status === "ONLINE" ? (
              <iframe src={href ?? ""} title={title ?? (href ?? "")} className="w-full h-[60vh] md:h-[calc(80vh-100px)] bg-white" />
            ) : (
              <div className="h-full flex items-center justify-center p-6 text-uGrayLight text-sm">
                Link previews require an internet connection.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 text-uGrayLight text-sm">No link selected.</div>
      )}
    </BaseModal>
  );
}
