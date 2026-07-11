"use client";

import { useMemo, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { getStatus, Status } from "@/types";
import ConversationItem from "./ConversationItem";

type FilterKey = "todos" | Status;

interface ConversationListProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ConversationList({ isOpen = false, onClose }: ConversationListProps) {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const selectConversation = useChatStore((s) => s.selectConversation);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("todos");

  const filtered = useMemo(() => {
    let list = (conversations || []).filter((c) => {
      if (!c) return false;
      const nombre = (c.nombre || c.nombre_cliente || "").toLowerCase();
      const telefono = c.telefono || c.telefono_cliente || "";
      const search = query.toLowerCase();

      return nombre.includes(search) || telefono.includes(search);
    });

    if (filter !== "todos") {
      list = list.filter((c) => getStatus(c) === filter);
    }

    const order: Record<Status, number> = { escalado: 0, human: 1, bot: 2 };
    return [...list].sort((a, b) => {
      const statusA = getStatus(a);
      const statusB = getStatus(b);
      return (order[statusA] ?? 3) - (order[statusB] ?? 3);
    });
  }, [conversations, query, filter]);

  const counts = useMemo(() => {
    const c: Record<Status, number> = { bot: 0, escalado: 0, human: 0 };
    (conversations || []).forEach((conv) => {
      if (!conv) return;
      const status = getStatus(conv);
      if (c[status] !== undefined) c[status]++;
    });
    return c;
  }, [conversations]);

  // Manejador para seleccionar chat y auto-cerrar en móvil
  const handleSelect = (id: string) => {
    selectConversation(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* OVERLAY OSCURO (Solo en móviles cuando la barra está abierta) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* CONTENEDOR PRINCIPAL SIDEBAR */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-80 shrink-0 bg-slate-900 flex flex-col h-full border-r border-slate-800
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* CABECERA CON BÚSQUEDA Y BOTÓN DE CERRAR */}
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="flex justify-between items-center">
            <h1 className="text-slate-100 font-semibold text-lg">Conversaciones</h1>
            
            {/* Botón para cerrar manualmente en Móvil */}
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden text-slate-400 hover:text-slate-200 p-1 rounded-md"
              >
                ✕
              </button>
            )}
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o teléfono"
            className="mt-3 w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-1.5 mt-3 flex-wrap">
            {(
              [
                { key: "todos", label: `Todos ${conversations?.length || 0}` },
                { key: "escalado", label: `⚠️ ${counts.escalado}` },
                { key: "bot", label: `🤖 ${counts.bot}` },
                { key: "human", label: `👤 ${counts.human}` },
              ] as { key: FilterKey; label: string }[]
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  filter === f.key
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA DE CONVERSACIONES */}
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <p className="text-slate-500 text-sm text-center mt-8 px-4">
              No hay conversaciones que coincidan.
            </p>
          ) : (
            filtered
              .filter((conv) => Boolean(conv))
              .map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  active={String(conv.id) === String(activeId)}
                  onClick={() => handleSelect(String(conv.id))}
                />
              ))
          )}
        </div>
      </div>
    </>
  );
}