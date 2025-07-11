import { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage } from "../services/api";
import type { Message } from "../types";

interface Props {
  chatId: number | null;
}

export default function ChatWindow({ chatId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      getMessages(chatId).then(setMessages);
    }
  }, [chatId]);

  const handleSend = async () => {
    if (!chatId || !input.trim()) return;
    const response = await sendMessage(chatId, input);
    setMessages((prev) => [...prev, { id: -1, message: input, role: "user", datetime: new Date().toISOString() }, response]);
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chatId) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">Selecciona un chat</div>;
  }

  return (
    <div className="flex flex-col flex-1 bg-white">
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id + msg.datetime}
            className={`p-2 rounded max-w-lg ${
              msg.role === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
            }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form
        className="p-4 border-t flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 border rounded p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}