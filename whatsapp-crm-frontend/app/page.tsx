"use client";

import { useEffect } from "react";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import ControlPanel from "@/components/ControlPanel";
import { useChatStore } from "@/store/useChatStore";

export default function Home() {
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const activeId = useChatStore((state) => state.activeId);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Patrón "pantalla dividida" en desktop (md+), pero en mobile solo se
  // ve un panel a la vez: si hay conversación activa se muestra el chat,
  // si no, se muestra la lista. No agregamos estado nuevo para esto:
  // reutilizamos activeId, que ya vive en el store.
  const hasActiveChat = Boolean(activeId);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className={`${hasActiveChat ? "hidden" : "flex"} md:flex w-full md:w-80 shrink-0`}>
        <ConversationList />
      </div>
      <div className={`${hasActiveChat ? "flex" : "hidden"} md:flex flex-1 min-w-0`}>
        <ChatWindow />
      </div>
    </div>
  );
}