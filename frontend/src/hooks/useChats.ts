import { useEffect, useState } from "react";
import type { Chat } from "../types";
import { getChats } from "../services/api";

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);

  const loadChats = async () => {
    const data = await getChats();
    setChats(data);
  };

  useEffect(() => {
    loadChats();
  }, []);

  return { chats, reloadChats: loadChats };
};