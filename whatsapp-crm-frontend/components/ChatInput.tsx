"use client";

import { useState } from "react";
import { Conversation } from "@/types";
import { useChatStore } from "@/store/useChatStore";

export default function ChatInput({ conv }: { conv: Conversation }) {
  const sendMessage = useChatStore((s) => s.sendMessage);
  const [text, setText] = useState("");
  const enabled = conv.mode === "human"; // Regla clave del brief: solo se puede escribir en modo humano

  function handleSend() {
    if (!enabled || !text.trim()) return;
    // Forzamos a que el ID sea string usando String()
    sendMessage(String(conv.id), text.trim());
    setText("");
  }

  // Adjuntar es solo UI por ahora: no hay endpoint de subida de archivos
  // en el store todavía. Queda listo para conectar (ver comentario abajo).
  function handleAttachClick() {
    // TODO: conectar con un endpoint tipo POST /api/conversaciones/:id/adjuntos
    console.log("Adjuntar archivo — pendiente de conectar con backend");
  }

  return (
    <div className="border-t border-slate-200 bg-white px-3 md:px-4 py-3">
      {!enabled && (
        <p className="text-xs text-amber-600 mb-2">
          ⚠️ El bot está atendiendo esta conversación. Toma el control para escribir manualmente.
        </p>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={handleAttachClick}
          disabled={!enabled}
          className="w-10 h-10 shrink-0 rounded-full text-slate-500 disabled:text-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:hover:bg-transparent transition-colors"
          aria-label="Adjuntar archivo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M21.44 11.05 12.25 20.24a5 5 0 0 1-7.07-7.07l9.19-9.19a3.33 3.33 0 0 1 4.71 4.71l-9.2 9.19a1.67 1.67 0 0 1-2.36-2.36l8.49-8.48"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={!enabled}
          placeholder={enabled ? "Escribe un mensaje..." : "Solo disponible en modo humano"}
          className="flex-1 min-w-0 bg-slate-100 disabled:bg-slate-50 disabled:text-slate-400 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleSend}
          disabled={!enabled || !text.trim()}
          className="w-10 h-10 shrink-0 rounded-full bg-blue-600 disabled:bg-slate-300 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
          aria-label="Enviar mensaje"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2 11 13" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2 15 22 11 13 2 9 22 2Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
