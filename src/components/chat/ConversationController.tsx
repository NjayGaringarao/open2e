import { useState } from "react";
import { useChat } from "@/context/main/chat/useChat";
import { Conversation } from "@/models";
import clsx from "clsx";
import { Edit, Ellipsis, Plus, Trash } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Button from "../Button";

const ConversationController = () => {
  const {
    conversations,
    activeConversation,
    updateActiveConversation,
    removeConversation,
    updateConversation,
  } = useChat();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");

  const handleStart = () => {
    updateActiveConversation(null);
  };

  const handleSelect = (convo: Conversation) => {
    updateActiveConversation(convo);
  };

  const handleDelete = async (convo: Conversation) => {
    await removeConversation(convo);
  };

  const handleRename = async (convo: Conversation) => {
    if (tempTitle.trim() && tempTitle !== convo.title) {
      await updateConversation({ ...convo, title: tempTitle });
    }
    setEditingId(null);
  };

  return (
    <aside className="w-full px-4 py-16 flex flex-col gap-4 border-r border-gray-200">
      <p className="text-xl text-uGray *:font-semibold">Chat Menu</p>
      <Button
        onClick={handleStart}
        className="hover:bg-primary hover:text-background py-2 text-uGray "
        secondary
      >
        <Plus /> New Chat
      </Button>

      <p className="text-uGray text-lg">Conversations</p>

      {!conversations.length && (
        <div className="py-4 w-full text-gray shadow-md rounded-md flex flex-col items-center">
          [ None ]
        </div>
      )}

      <ul className="flex flex-col">
        {conversations.map((convo) => {
          const isActive = activeConversation?.id === convo.id;
          const isEditing = editingId === convo.id;

          return (
            <li
              key={convo.id}
              className={clsx(
                "group relative flex items-center justify-between rounded-md px-3 py-2 text-base cursor-pointer hover:bg-secondary text-uGrayLight",
                isActive && "text-uGray font-bold shadow-sm"
              )}
            >
              {isEditing ? (
                <input
                  className="flex-1 bg-transparent border-b border-uGrayLight focus:outline-none"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={() => handleRename(convo)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(convo);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => handleSelect(convo)}
                  className="flex-1 text-left truncate"
                >
                  {convo.title || "Untitled"}
                </button>
              )}

              {/* Headless UI Menu */}
              <Menu as="div" className="relative">
                <MenuButton className="ml-2 rounded hidden group-hover:block bg-panel">
                  <Ellipsis className="text-uGrayLight" />
                </MenuButton>

                <MenuItems className="absolute right-0 top-8 z-10 w-28 bg-background shadow-md shadow-uGrayLightLight rounded-md overflow-hidden focus:outline-none">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          "w-full px-3 py-2 text-left text-base text-uGrayLight",
                          focus && "bg-secondary",
                          "flex flex-row gap-2 items-center"
                        )}
                        onClick={() => {
                          setEditingId(convo.id);
                          setTempTitle(convo.title || "");
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
                        onClick={() => handleDelete(convo)}
                      >
                        <Trash className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ConversationController;
