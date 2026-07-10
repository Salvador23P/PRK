"use client";

import { useEffect } from "react";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import ControlPanel from "@/components/ControlPanel";
import { useChatStore } from "@/store/useChatStore";

export default function Home() {
  const fetchConversations = useChatStore((state) => state.fetchConversations);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ConversationList />
      <ChatWindow />
    </div>
  );
}