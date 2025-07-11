import { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage, sendAudioMessage } from "../services/api";
import type { Message } from "../types";
import AudioPlayer from "./AudioPlayer";
import AudioRecorder from "./AudioRecorder";

interface Props {
	chatId: number | null;
}

export default function ChatWindow({ chatId }: Props) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (chatId) {
			getMessages(chatId).then(setMessages);
		}
	}, [chatId]);

	const handleSend = async () => {
		if (!chatId || !input.trim()) return;
		try {
			setLoading(true);

			const mensajeUsuario: Message = {
				id: -1,
				message: input,
				role: "user",
				datetime: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, mensajeUsuario]);
			setInput("");

			const respuesta = await sendMessage(chatId, input);

			setMessages((prev) => [...prev, respuesta]);
		} catch (error) {
			console.error("Error al enviar mensaje:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSendAudio = async (audioFile: File) => {
		if (!chatId) return;
		try {
			setLoading(true);

			const mensajeUsuario: Message = {
				id: -1,
				message: "🎵 Transcribiendo audio...",
				role: "user",
				datetime: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, mensajeUsuario]);

			await sendAudioMessage(chatId, audioFile);

			const mensajesActualizados = await getMessages(chatId);
		
			setMessages(mensajesActualizados);
			
		} catch (error) {
			console.error("Error al enviar audio:", error);

			setMessages((prev) => prev.filter(msg => msg.message !== "🎵 Transcribiendo audio..."));
			alert("Error al procesar el audio. Inténtalo de nuevo.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, loading]);

	if (!chatId) {
		return (
			<div className="flex-1 flex items-center justify-center text-gray-500">
				Selecciona un chat
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 bg-[#212121] px-24">
			<div className="flex-1 p-4 overflow-y-auto space-y-2">
				{messages.length === 0 && !loading ? (
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center">
							<div className="text-6xl mb-4">🤔</div>
							<h2 className="text-xl font-semibold text-white mb-2">
								¡Hola! Soy Iván
							</h2>
							<p className="text-[#afafaf] text-lg">
								Hazme una pregunta, ¿o eres mono? 🐒
							</p>
						</div>
					</div>
				) : (
					messages.map((msg, index) => (
						<div
							key={msg.id !== -1 ? msg.id : `temp-${index}`}
							className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`p-2 rounded max-w-lg ${
									msg.role === "user" ? "bg-[#323232] text-white": "text-white" 
								}`}
							>
								<div className="mb-1">{msg.message}</div>
								{msg.role === "bot" && msg.id !== -1 && (
									<AudioPlayer messageId={msg.id} className="mt-2" />
								)}
							</div>
						</div>
					))
				)}

				{loading && (
					<div className="bg-[#323232] text-[#afafaf] p-2 rounded w-fit animate-pulse">
						Iván está escribiendo<span className="animate-bounce">...</span>
					</div>
				)}
				<div ref={bottomRef} />
			</div>

			<form
				className="p-4 flex gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					if (!loading) handleSend();
				}}
			>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Escribe un mensaje..."
					className="flex-1 border rounded p-2 bg-[#303030] text-[#afafaf]"
					disabled={loading}
				/>
				<AudioRecorder onSendAudio={handleSendAudio} disabled={loading} />
				<button
					type="submit"
					className="bg-[#414141] text-white px-4 py-2 rounded hover:bg-white disabled:bg-[#303030]"
					disabled={loading || !input.trim()}
				>
          <img src="/icons/send.svg" alt="Send" />
					{/* {loading ? "Enviando..." : "Enviar"} */}
				</button>
			</form>
		</div>
	);
}
