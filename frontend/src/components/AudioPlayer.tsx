import { useState } from "react";
import { getMessageAudio } from "../services/api";

interface Props {
  messageId: number;
  className?: string;
}

export default function AudioPlayer({ messageId, className = "" }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playAudio = async () => {
    if (isLoading || isPlaying) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const audioBlob = await getMessageAudio(messageId);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setIsPlaying(true);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        setError("Error al reproducir el audio");
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (err) {
      console.error("Error al reproducir audio:", err);
      setError("Error al cargar el audio");
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={playAudio}
      disabled={isLoading || isPlaying}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs  bg-[#303030] text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      title={error || (isPlaying ? "Reproduciendo..." : "Reproducir audio")}
    >
      {isLoading ? (
        <>
          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin text-[#afafaf]"></div>
          <span>Cargando...</span>
        </>
      ) : isPlaying ? (
        <>
          <img src="/icons/speaker.svg" alt="Playing" className="w-3 h-3 text-[#afafaf]" />
          <span>Reproduciendo...</span>
        </>
      ) : (
        <>
          <img src="/icons/speaker.svg" alt="Play" className="w-3 h-3 text-[#afafaf]" />
          <span>Escuchar</span>
        </>
      )}
    </button>
  );
}
