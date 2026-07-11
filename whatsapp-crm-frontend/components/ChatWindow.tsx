"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ModeToggle from "./ModeToggle";

export default function ChatWindow() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const goBackToList = useChatStore((s) => s.goBackToList);
  
  // Comparación segura convirtiendo ambos IDs a String
  const conv = conversations.find((c) => String(c.id) === String(activeId));
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll automático blindado contra undefined
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conv?.mensajes?.length ?? 0, conv?.id ?? ""]);

  if (!conv) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Selecciona una conversación
      </div>
    );
  }

  // Nombre y teléfono seguros según las columnas de PostgreSQL
  const nombre = conv.nombre || conv.nombre_cliente || conv.telefono || "Cliente";
  const telefono = conv.telefono || conv.telefono_cliente || "";

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <div className="h-16 shrink-0 bg-white border-b border-slate-200 px-3 md:px-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Visible solo en mobile: en desktop la lista siempre está
              a la vista, así que este botón sobra ahí (block md:hidden). */}
          <button
            onClick={goBackToList}
            className="md:hidden flex items-center gap-1 shrink-0 -ml-1 pl-1.5 pr-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="Volver a conversaciones"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium">Volver</span>
          </button>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate">{nombre}</p>
            {telefono && <p className="text-xs text-slate-500">{telefono}</p>}
          </div>
        </div>
        <ModeToggle conv={conv} />
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-5 py-4">
        {/* Fallback seguro en caso de que conv.mensajes sea undefined */}
        {(conv.mensajes || []).map((msg, index) => (
          <MessageBubble key={msg.id || index} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatInput conv={conv} />
    </div>
  );
}