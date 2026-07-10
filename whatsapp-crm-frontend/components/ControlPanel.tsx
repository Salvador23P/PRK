"use client";

import { useChatStore } from "@/store/useChatStore";
import { getStatus, Status } from "@/types";
import { STATUS_STYLES } from "./statusStyles";

function Semaforo({ status }: { status: Status }) {
  // Widget tipo semáforo: 3 luces apiladas, la activa se ilumina
  // con anillo + pulso; el resto permanece apagada.
  const lights: { key: Status; color: string }[] = [
    { key: "bot", color: "bg-emerald-500" },
    { key: "escalado", color: "bg-amber-500" },
    { key: "human", color: "bg-blue-500" },
  ];
  return (
    <div className="bg-slate-800 rounded-2xl px-3 py-4 flex flex-col items-center gap-3 w-14">
      {lights.map((l) => {
        const isActive = l.key === status;
        return (
          <span key={l.key} className="relative flex items-center justify-center">
            {isActive && <span className={`absolute w-6 h-6 rounded-full ${l.color} opacity-40 animate-ping`} />}
            <span className={`relative w-4 h-4 rounded-full ${isActive ? l.color : "bg-slate-600"} ${isActive ? "ring-4 ring-white/10" : ""}`} />
          </span>
        );
      })}
    </div>
  );
}

export default function ControlPanel() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const setMode = useChatStore((s) => s.setMode);
  const conv = conversations.find((c) => c.id === activeId);

  if (!conv) return <div className="w-72 shrink-0 bg-white border-l border-slate-200" />;

  const status = getStatus(conv);
  const styles = STATUS_STYLES[status];

  return (
    <div className="w-72 shrink-0 bg-white border-l border-slate-200 flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-200">
        <p className="font-bold text-slate-800 tracking-tight">Panel de Control</p>
        <p className="text-xs text-slate-400">CRM · WhatsApp híbrido</p>
      </div>

      <div className="px-5 py-5 space-y-5 flex-1 overflow-y-auto">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Estado de conversación</p>
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${styles.bg} ${styles.text}`}>
            {styles.label}
          </span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setMode(String(conv.id), "human")}
            disabled={conv.mode === "human"}
            className="w-full text-sm font-medium rounded-lg px-3 py-2.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
          >
            👤 Tomar control
          </button>
          <button
            onClick={() => setMode(String(conv.id), "bot")}
            disabled={conv.mode === "bot" && conv.estado === "activo"}
            className="w-full text-sm font-medium rounded-lg px-3 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
          >
            🤖 Activar bot
          </button>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Indicador</p>
          <div className="flex justify-center">
            <Semaforo status={status} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Métricas</p>
          <div className="grid grid-cols-2 gap-2">
            {["Tiempo resp.", "Mensajes hoy", "Satisfacción", "Escaladas"].map((label) => (
              <div key={label} className="bg-slate-50 border border-dashed border-slate-200 rounded-lg px-3 py-3 text-center">
                <p className="text-slate-300 text-lg font-semibold">—</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-300 mt-2 text-center">Próximamente</p>
        </div>
      </div>
    </div>
  );
}
