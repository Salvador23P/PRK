"use client";

import { useEffect, useState } from "react";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import { useChatStore } from "@/store/useChatStore";

export default function Home() {
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  
  // Estado para controlar la barra lateral en móviles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 relative">
      
      {/* BOTÓN HAMBURGUESA (Solo visible en pantallas chicas < md) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden absolute top-3 left-3 z-30 p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 focus:outline-none border border-slate-700 shadow-lg"
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* COMPONENTE SIDEBAR CON PROPS DE CONTROL */}
      <ConversationList 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* ÁREA DEL CHAT */}
      <div className="flex-1 h-full w-full">
        <ChatWindow />
      </div>
    </div>
  );
}