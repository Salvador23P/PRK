"use client";

import { useEffect, useState } from "react";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import { useChatStore } from "@/store/useChatStore";

type ViewMode = "split" | "chat-only";

export default function Home() {
  const fetchConversations = useChatStore((state) => state.fetchConversations);

  // Estados de control para la UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 relative">
      {/* 🛠️ PANEL DE BOTONES FLOTANTES */}
      <div className="absolute top-3 left-3 z-50 flex items-center gap-2">
        {/* BOTÓN HAMBURGUESA: Pliega y despliega los chats en móvil/pantalla corta */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 shadow-xl transition-colors focus:outline-none"
          title={isSidebarOpen ? "Plegar chats" : "Desplegar chats"}
        >
          {isSidebarOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* BOTÓN CAMBIAR VISTA: Expandir/Dividir en Desktop */}
        <button
          onClick={() => setViewMode(viewMode === "split" ? "chat-only" : "split")}
          className="hidden md:flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 shadow-xl transition-colors text-xs font-medium focus:outline-none"
          title="Cambiar vista"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 011 1H5a1 1 0 01-1-1V5z" />
            {viewMode === "split" && (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4v16" />
            )}
          </svg>
          <span>{viewMode === "split" ? "Expandir" : "Dividir"}</span>
        </button>
      </div>

      {/* 📱 COMPONENTE SIDEBAR */}
      <ConversationList
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        forcedHide={viewMode === "chat-only"}
      />

      {/* 💬 ÁREA DEL CHAT */}
      <div className="flex-1 h-full w-full">
        <ChatWindow />
      </div>
    </div>
  );
}