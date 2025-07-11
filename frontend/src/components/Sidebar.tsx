import { useChats } from "../hooks/useChats";
import { createChat } from "../services/api";
import { cn } from "../utils/classnames";

interface Props {
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
}

export default function Sidebar({ selectedChatId, onSelectChat }: Props) {
  const { chats, reloadChats } = useChats();

  const handleNewChat = async () => {
    const nombre = prompt("Nombre del nuevo chat");
    if (nombre) {
      const newChat = await createChat(nombre);
      reloadChats();
      onSelectChat(newChat.id);
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white p-4 space-y-4 overflow-y-auto">
      <button
        onClick={handleNewChat}
        className="w-full bg-green-600 hover:bg-green-700 rounded p-2"
      >
        + Nuevo Chat
      </button>

      {chats.map((chat) => (
        <div
          key={chat.id}
          className={cn(
            "p-2 rounded cursor-pointer hover:bg-gray-700",
            selectedChatId === chat.id && "bg-gray-700"
          )}
          onClick={() => onSelectChat(chat.id)}
        >
          {chat.nombre}
        </div>
      ))}
    </div>
  );
}