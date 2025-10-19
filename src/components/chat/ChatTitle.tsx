import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import clsx from "clsx";
import { useChat } from "@/context/main/chat";

export default function ChatTitle() {
  const {
    activeConversation,
    updateConversation,
    removeConversation,
    updateActiveConversation,
  } = useChat();

  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(activeConversation?.title || "");

  if (!activeConversation) return null;

  const handleRename = async () => {
    if (tempTitle.trim() && tempTitle.trim() !== activeConversation.title) {
      await updateConversation({
        ...activeConversation,
        title: tempTitle.trim(),
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await removeConversation(activeConversation);
    updateActiveConversation(null);
  };

  return (
    <div className="absolute w-full z-30 flex flex-col items-center px-6 top-4">
      <div
        className={clsx(
          "w-full max-w-5xl p-4 z-30",
          "bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-white/10",
          "rounded-md shadow-md",
          "flex flex-col items-center"
        )}
      >
        <div className=" relative w-full flex gap-4 items-center">
          <Menu as="div" className="relative ml-2">
            <MenuButton>
              <EllipsisVertical className="text-uGrayLight w-5 h-5" />
            </MenuButton>
            <MenuItems className="absolute left-0 top-8 z-10 w-28 bg-background shadow-md shadow-uGrayLightLight rounded-md overflow-hidden focus:outline-none">
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "w-full px-3 py-2 text-left text-base text-uGrayLight",
                      focus && "bg-secondary",
                      "flex flex-row gap-2 items-center"
                    )}
                    onClick={() => {
                      setIsEditing(true);
                      setTempTitle(activeConversation.title || "");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    Rename
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "w-full px-3 py-2 text-left text-base text-uRed",
                      focus && "bg-secondary",
                      "flex flex-row gap-2 items-center"
                    )}
                    onClick={handleDelete}
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>

          {isEditing ? (
            <input
              className="text-xl bg-transparent border-b border-uGrayLight focus:outline-none w-full"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setTempTitle(activeConversation.title || "");
                }
              }}
              autoFocus
            />
          ) : (
            <div className="flex flex-col">
              <p className="text-uGray font-semibold text-xl truncate">
                {activeConversation.title}
              </p>
              <p className="text-xs">
                Created at:{" "}
                {new Date(activeConversation.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
