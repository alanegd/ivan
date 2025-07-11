import { useEffect, useState } from "react";
import type { Chat } from "../types";
import { getChats } from "../services/api";

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);

  const loadChats = async () => {
    const data = await getChats();
    // Ordenar chats del más reciente al más antiguo (por ID descendente)
    const sortedChats = data.sort((a, b) => b.id - a.id);
    setChats(sortedChats);
  };

  useEffect(() => {
    loadChats();
  }, []);

  // Función para obtener el chat más reciente
  const getMostRecentChat = () => {
    return chats.length > 0 ? chats[0] : null;
  };

  return { 
    chats, 
    reloadChats: loadChats,
    getMostRecentChat
  };
};