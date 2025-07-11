import { useState } from "react";
import { useAudioRecorder } from "../hooks/useAudioRecorder";

interface Props {
  onSendAudio: (audioFile: File) => void;
  disabled?: boolean;
}

export default function AudioRecorder({ onSendAudio, disabled = false }: Props) {
  const { isRecording, audioBlob, startRecording, stopRecording, clearRecording } = useAudioRecorder();
  const [showPreview, setShowPreview] = useState(false);

  const handleStartRecording = () => {
    clearRecording();
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
    setShowPreview(true);
  };

  const handleSendAudio = () => {
    if (audioBlob) {
      const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });
      onSendAudio(audioFile);
      clearRecording();
      setShowPreview(false);
    }
  };

  const handleCancelAudio = () => {
    clearRecording();
    setShowPreview(false);
  };

  if (showPreview && audioBlob) {
    return (
      <div className="flex items-center gap-2 p-2 bg-[#404040] rounded">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[#afafaf] text-sm">🎵 Audio grabado</span>
          <audio 
            controls 
            src={URL.createObjectURL(audioBlob)}
            className="h-8"
          />
        </div>
        <button
          onClick={handleSendAudio}
          disabled={disabled}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Enviar
        </button>
        <button
          onClick={handleCancelAudio}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={isRecording ? handleStopRecording : handleStartRecording}
      disabled={disabled}
      className={`px-3 py-2 rounded transition-colors ${
        isRecording 
          ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" 
          : "bg-[#414141] hover:bg-[#515151] text-white"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isRecording ? "Detener grabación" : "Grabar audio"}
    >
      {isRecording ? (
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <img src="/icons/microphone.svg" alt="Recording" className="w-4 h-4" />
        </span>
      ) : (
        <img src="/icons/microphone.svg" alt="Record" className="w-4 h-4" />
      )}
    </button>
  );
}
