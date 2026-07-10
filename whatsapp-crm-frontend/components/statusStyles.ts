import { Status } from "@/types";

// Centraliza el mapeo status -> clases Tailwind + etiqueta.
// Si mañana cambian los colores de marca, se edita en un solo lugar.
export const STATUS_STYLES: Record<
  Status,
  { dot: string; text: string; bg: string; label: string }
> = {
  bot: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", label: "🤖 Bot activo" },
  escalado: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", label: "⚠️ Escalado" },
  human: { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50", label: "👤 Humano" },
};
