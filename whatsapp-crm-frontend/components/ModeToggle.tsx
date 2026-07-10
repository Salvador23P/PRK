"use client";

import { Conversation } from "@/types";
import { useChatStore } from "@/store/useChatStore";

export default function ModeToggle({ conv }: { conv: Conversation }) {
  const setMode = useChatStore((s) => s.setMode);
  const isHuman = conv.mode === "human";

  return (
    <button
      onClick={() => setMode(conv.id, isHuman ? "bot" : "human")}
      className="flex items-center gap-2 bg-slate-100 rounded-full px-1 py-1 transition-colors"
      aria-label="Cambiar modo bot/humano"
    >
      <span className={`text-xs px-2.5 py-1 rounded-full transition-colors ${!isHuman ? "bg-emerald-500 text-white" : "text-slate-500"}`}>
        🤖 Bot
      </span>
      <span className={`text-xs px-2.5 py-1 rounded-full transition-colors ${isHuman ? "bg-blue-600 text-white" : "text-slate-500"}`}>
        👤 Humano
      </span>
    </button>
  );
}
