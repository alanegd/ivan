import { useState } from "react";
import { createChat } from "../services/api";
import { cn } from "../utils/classnames";
import NewChatDialog from "./NewChatDialog";
import type { Chat } from "../types";

interface Props {
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  chats: Chat[];
  onReloadChats: () => void;
}

interface Props {
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
}

export default function Sidebar({ selectedChatId, onSelectChat, chats, onReloadChats }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNewChat = async (nombre: string) => {
    const newChat = await createChat(nombre);
    onReloadChats();
    onSelectChat(newChat.id);
  };

  return (
    <div className="w-64 bg-[#181818] text-white p-4 space-y-4 overflow-y-auto">
      <button
        onClick={() => setIsDialogOpen(true)}
        className="w-full hover:bg-[#303030] rounded p-2"
      >
        + Nuevo Chat
      </button>

      {chats.map((chat) => (
        <div
          key={chat.id}
          className={cn(
            "p-2 rounded cursor-pointer hover:bg-[#303030]",
            selectedChatId === chat.id && "bg-[#303030] text-white"
          )}
          onClick={() => onSelectChat(chat.id)}
        >
          {chat.nombre}
        </div>
      ))}

      <NewChatDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreateChat={handleNewChat}
      />
    </div>
  );
}