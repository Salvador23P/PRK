"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ModeToggle from "./ModeToggle";

export default function ChatWindow() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  
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
      <div className="h-16 shrink-0 bg-white border-b border-slate-200 px-5 flex items-center justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate">{nombre}</p>
          {telefono && <p className="text-xs text-slate-500">{telefono}</p>}
        </div>
        <ModeToggle conv={conv} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
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