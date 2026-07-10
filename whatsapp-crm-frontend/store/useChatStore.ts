import { create } from "zustand";
import axios from "axios";
import { Conversation, Status, Message } from "@/types";

interface ChatState {
  conversations: Conversation[];
  activeId: string;

  // Acciones existentes
  selectConversation: (id: string) => void;
  setMode: (id: string, mode: Status) => void;

  // Acciones asíncronas conectadas al Backend Node.js / PostgreSQL
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (id: string, text: string) => Promise<void>;
}

const API_BASE = "https://prk-whatsapp-crm-backend.7q5nan.easypanel.host/";

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeId: "",

  selectConversation: (id) => {
    set({ activeId: String(id) });
    get().fetchMessages(String(id)); // Carga mensajes al seleccionar
  },

  setMode: (id, mode) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        String(c.id) === String(id) ? { ...c, mode, estado: "activo" } : c
      ),
    })),

  // 1. Obtener todas las conversaciones desde PostgreSQL
  fetchConversations: async () => {
    try {
      const res = await axios.get(`${API_BASE}/conversaciones`);
      const data: Conversation[] = res.data.map((item: any) => ({
        id: String(item.id),
        nombre: item.nombre_cliente || item.nombre || item.numero_whatsapp,
        nombre_cliente: item.nombre_cliente,
        telefono: item.numero_whatsapp || item.telefono,
        telefono_cliente: item.numero_whatsapp || item.telefono_cliente,
        mode: (item.modo === "humano" ? "human" : item.modo || "bot") as Status,
        estado: item.estado || "activo",
        ultimo_mensaje: item.ultimo_mensaje || "",
        mensajes: [],
      }));

      set({
        conversations: data,
        activeId: data.length > 0 ? String(data[0].id) : "",
      });

      // Cargar mensajes del primer chat activo
      if (data.length > 0) {
        get().fetchMessages(String(data[0].id));
      }
    } catch (error) {
      console.error("Error al obtener conversaciones:", error);
    }
  },

  // 2. Obtener los mensajes de un chat específico
  fetchMessages: async (conversationId: string) => {
    if (!conversationId) return;
    try {
      const res = await axios.get(
        `${API_BASE}/conversaciones/${conversationId}/mensajes`
      );
      const mensajes: Message[] = res.data.map((m: any) => ({
        id: String(m.id),
        id_conversacion: String(m.id_conversacion || conversationId),
        emisor: m.emisor || m.sender, // 'cliente', 'bot' o 'humano'
        contenido: m.contenido || m.texto || m.text,
        timestamp: m.created_at
          ? new Date(m.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "ahora",
      }));

      set((state) => ({
        conversations: state.conversations.map((c) =>
          String(c.id) === String(conversationId) ? { ...c, mensajes } : c
        ),
      }));
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }
  },

  // 3. Enviar mensaje desde la interfaz a la base de datos
  sendMessage: async (id: string, text: string) => {
    try {
      const res = await axios.post(`${API_BASE}/conversaciones/${id}/responder`, {
        texto: text,
      });

      const nuevoMensajeBD = res.data.mensaje || res.data;
      const nuevoMensajeFormateado: Message = {
        id: String(nuevoMensajeBD?.id || Date.now()),
        id_conversacion: String(id),
        emisor: "humano",
        contenido: nuevoMensajeBD?.contenido || text,
        timestamp: "ahora",
      };

      set((state) => ({
        conversations: state.conversations.map((c) => {
          if (String(c.id) === String(id)) {
            return {
              ...c,
              ultimo_mensaje: nuevoMensajeFormateado.contenido,
              mensajes: [...(c.mensajes || []), nuevoMensajeFormateado],
            };
          }
          return c;
        }),
      }));
    } catch (error) {
      console.error("Error al guardar respuesta manual:", error);
    }
  },
}));