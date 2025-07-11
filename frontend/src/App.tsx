import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { useChats } from "./hooks/useChats";

export default function App() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const { chats, reloadChats, getMostRecentChat } = useChats();

  // Auto-seleccionar el chat más reciente al cargar o cuando cambien los chats
  useEffect(() => {
    if (chats.length > 0 && selectedChatId === null) {
      const mostRecentChat = getMostRecentChat();
      if (mostRecentChat) {
        setSelectedChatId(mostRecentChat.id);
      }
    }
  }, [chats, selectedChatId, getMostRecentChat]);

  // Función para manejar la selección de chat y recargar si es necesario
  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  // Función para recargar chats y mantener selección si es posible
  const handleReloadChats = async () => {
    await reloadChats();
  };

  return (
    <div className="flex h-screen bg-[#181818] text-white">
      <Sidebar 
        selectedChatId={selectedChatId} 
        onSelectChat={handleSelectChat}
        chats={chats}
        onReloadChats={handleReloadChats}
      />

      <ChatWindow chatId={selectedChatId} />
    </div>
  );
}