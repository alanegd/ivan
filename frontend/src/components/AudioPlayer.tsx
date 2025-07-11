import { useState, useRef } from "react";
import { getMessageAudio } from "../services/api";

interface Props {
  messageId: number;
  className?: string;
}

export default function AudioPlayer({ messageId, className = "" }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const changeSpeed = () => {
    const currentIndex = speedOptions.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    const newRate = speedOptions[nextIndex];
    
    setPlaybackRate(newRate);
    
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const toggleAudio = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Error al reanudar audio:", err);
          setError("Error al reanudar el audio");
        }
      }
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const audioBlob = await getMessageAudio(messageId);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      // Establecer la velocidad de reproducción
      audio.playbackRate = playbackRate;
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        setError("Error al reproducir el audio");
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
      
      setIsPlaying(true);
      await audio.play();
    } catch (err) {
      console.error("Error al reproducir audio:", err);
      setError("Error al cargar el audio");
      setIsPlaying(false);
      audioRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-1">
      <button
        onClick={toggleAudio}
        disabled={isLoading}
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs  bg-[#303030] text-white rounded hover:bg-[#414141] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
        title={error || (isPlaying ? "Pausar audio" : "Reproducir audio")}
      >
        {isLoading ? (
          <>
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin text-[#afafaf]"></div>
            <span>Cargando...</span>
          </>
        ) : isPlaying ? (
          <>
            <div className="w-3 h-3 bg-white text-[#afafaf] flex items-center justify-center">
              <div className="w-1 h-2 bg-current mr-0.5"></div>
              <div className="w-1 h-2 bg-current"></div>
            </div>
            <span>Pausar</span>
          </>
        ) : (
          <>
            <img src="/icons/speaker.svg" alt="Play" className="w-3 h-3 text-[#afafaf]" />
            <span>Escuchar</span>
          </>
        )}
      </button>
      
      <button
        onClick={changeSpeed}
        disabled={isLoading}
        className="inline-flex items-center px-2 py-1 text-xs bg-[#404040] text-white rounded hover:bg-[#515151] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={`Velocidad de reproducción: ${playbackRate}x`}
      >
        {playbackRate}x
      </button>
    </div>
  );
}
