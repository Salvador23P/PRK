"use client";

import { Message } from "@/types";

interface Props {
  msg: Message | any;
}

export default function MessageBubble({ msg }: Props) {
  // Manejo flexible de variables según vengan del backend o store
  const contenido = msg.contenido || msg.texto || msg.text || "";
  const emisor = msg.emisor || msg.sender || "cliente";
  const timestamp = msg.timestamp || msg.fecha_envio || msg.ts || "";

  const isUser = emisor === "cliente";
  const isHuman = emisor === "humano" || emisor === "human";

  return (
    <div
      className={`flex flex-col mb-3 max-w-[75%] ${
        isUser ? "mr-auto items-start" : "ml-auto items-end"
      }`}
    >
      <div
        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
            : isHuman
            ? "bg-blue-600 text-white rounded-br-none shadow-sm"
            : "bg-slate-700 text-slate-100 rounded-br-none shadow-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{contenido}</p>
      </div>

      <span className="text-[10px] text-slate-400 mt-1 px-1">
        {timestamp} {isHuman && "• Agente"}
      </span>
    </div>
  );
}