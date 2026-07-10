"use client";

import { Conversation, getStatus, Status } from "@/types";

interface Props {
  conv?: Conversation; // Permitimos que conv pueda ser opcional/undefined por seguridad
  active: boolean;
  onClick: () => void;
}

export default function ConversationItem({ conv, active, onClick }: Props) {
  // Si conv no existe por alguna razón, no renderizamos nada o mostramos un fallback
  if (!conv) return null;

  // Manejo seguro de variables (usando Optional Chaining ?.)
  const nombre =
    conv?.nombre ||
    conv?.nombre_cliente ||
    conv?.telefono ||
    conv?.telefono_cliente ||
    "Cliente";

  const status = getStatus ? getStatus(conv) : ((conv?.mode || "bot") as Status);

  const statusStyles: Record<Status, { dot: string; label: string }> = {
    bot: { dot: "bg-blue-500", label: "🤖 Bot" },
    human: { dot: "bg-emerald-500", label: "👤 Humano" },
    escalado: { dot: "bg-amber-500", label: "⚠️ Escalado" },
  };

  const currentStatus = statusStyles[status] || statusStyles.bot;

  // Inicial segura para el avatar
  const avatarLetter =
    nombre
      .replace("+52", "")
      .trim()
      .charAt(0)
      .toUpperCase() || "C";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 flex items-center gap-3 border-b border-slate-800/60 transition-colors ${
        active ? "bg-slate-800" : "hover:bg-slate-800/40"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 font-semibold">
          {avatarLetter}
        </div>
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${currentStatus.dot} border-2 border-slate-900`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-2">
          <p className="text-sm font-medium text-slate-100 truncate">{nombre}</p>
          <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 shrink-0">
            {currentStatus.label}
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5">
          {conv?.ultimo_mensaje || conv?.telefono || conv?.telefono_cliente || "Sin mensajes"}
        </p>
      </div>
    </button>
  );
}