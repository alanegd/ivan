import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  return (
    <div className="flex h-screen">
      <Sidebar selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />

      <ChatWindow chatId={selectedChatId} />
    </div>
  );
}