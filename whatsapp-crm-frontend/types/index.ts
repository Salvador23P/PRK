export type Status = "bot" | "human" | "escalado";

export interface Message {
  id?: number | string;
  id_conversacion?: number | string;
  emisor?: "cliente" | "bot" | "humano" | "sistema" | string;
  contenido: string;
  timestamp?: string;
  fecha_envio?: string;
}

export interface Conversation {
  // Aceptamos number o string por si en la DB viene numérico y en la URL como string
  id: number | string; 
  
  // Campos tradicionales y de Postgres
  nombre?: string;
  nombre_cliente?: string;
  telefono?: string;
  telefono_cliente?: string;
  
  // Estados
  mode?: Status | string;
  estado?: string;
  status?: Status;
  
  // Mensajes
  ultimo_mensaje?: string;
  timestamp_ultimo_mensaje?: string;
  mensajes?: Message[]; // <-- Esto soluciona los errores de conv.mensajes
}

// Función auxiliar para obtener el status sin importar el nombre de la columna
export function getStatus(conv?: Conversation): Status {
  if (!conv) return "bot";
  const st = conv.status || conv.mode || conv.estado;
  if (st === "human" || st === "humano") return "human";
  if (st === "escalado" || st === "escalada") return "escalado";
  return "bot";
}