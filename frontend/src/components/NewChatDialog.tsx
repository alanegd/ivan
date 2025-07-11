import { useState } from "react";
import Dialog from "./Dialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (nombre: string) => void;
}

export default function NewChatDialog({ isOpen, onClose, onCreateChat }: Props) {
  const [nombre, setNombre] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsCreating(true);
    try {
      await onCreateChat(nombre.trim());
      setNombre("");
      onClose();
    } catch (error) {
      console.error("Error al crear chat:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setNombre("");
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Nuevo Chat">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="chat-name" className="block text-sm font-medium text-[#afafaf] mb-2">
            Nombre del chat
          </label>
          <input
            id="chat-name"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Escribe el nombre del chat..."
            className="w-full px-3 py-2 bg-[#303030] border border-[#404040] rounded-md text-white placeholder-[#afafaf] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isCreating}
            autoFocus
          />
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isCreating}
            className="px-4 py-2 text-[#afafaf] hover:text-white transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!nombre.trim() || isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? "Creando..." : "Crear Chat"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
