import axios from "axios";
import type { Chat, Message } from "../types";

const BASE_URL = "http://localhost:8000";

export const getChats = async (): Promise<Chat[]> => {
  const res = await axios.get(`${BASE_URL}/chats/`);
  return res.data;
};

export const createChat = async (nombre: string): Promise<Chat> => {
  const res = await axios.post(`${BASE_URL}/chats/`, { nombre });
  return res.data;
};

export const getMessages = async (chatId: number): Promise<Message[]> => {
  const res = await axios.get(`${BASE_URL}/chats/${chatId}/messages/`);
  return res.data;
};

export const sendMessage = async (
  chatId: number,
  texto: string
): Promise<Message> => {
  const formData = new FormData();
  formData.append("texto", texto);
  const res = await axios.post(
    `${BASE_URL}/chats/${chatId}/mensaje-texto/`,
    formData
  );
  return res.data;
};
