import { Conversation } from "@/types";

// Datos simulados. Al conectar el backend (n8n + Twilio), esto se
// reemplaza por un fetch inicial (ej. GET /api/conversations) y el
// store se hidrata igual, sin tocar ningún componente de UI.
export const mockConversations: Conversation[] = [
  {
    id: "1",
    nombre: "Mariana López",
    telefono: "+52 614 233 1187",
    mode: "bot",
    estado: "escalado",
    mensajes: [
      { id: "m1", sender: "cliente", text: "Hola, quiero cambiar mi pedido pero el link de rastreo no funciona", ts: "09:12" },
      { id: "m2", sender: "bot", text: "Claro, dame un momento para revisar tu pedido con el número de teléfono registrado.", ts: "09:12" },
      { id: "m3", sender: "cliente", text: "Ya llevo 20 min esperando, es urgente", ts: "09:24" },
    ],
  },
  {
    id: "2",
    nombre: "Carlos Reyes",
    telefono: "+52 614 998 4420",
    mode: "human",
    estado: "activo",
    mensajes: [
      { id: "m1", sender: "cliente", text: "¿Tienen envíos a Ciudad Juárez?", ts: "08:40" },
      { id: "m2", sender: "humano", text: "¡Hola Carlos! Sí, hacemos envíos a toda la frontera, 2-3 días hábiles.", ts: "08:45" },
      { id: "m3", sender: "cliente", text: "Perfecto, gracias", ts: "08:46" },
    ],
  },
  {
    id: "3",
    nombre: "+52 614 552 0093",
    telefono: "+52 614 552 0093",
    mode: "bot",
    estado: "activo",
    mensajes: [
      { id: "m1", sender: "cliente", text: "Buenas, ¿cuál es el horario de atención?", ts: "07:58" },
      { id: "m2", sender: "bot", text: "¡Hola! Nuestro horario es de lunes a sábado, 9:00 a 20:00 hrs.", ts: "07:58" },
    ],
  },
  {
    id: "4",
    nombre: "Ana Gutiérrez",
    telefono: "+52 614 771 6602",
    mode: "bot",
    estado: "escalado",
    mensajes: [
      { id: "m1", sender: "cliente", text: "El producto llegó dañado, quiero reembolso", ts: "10:02" },
      { id: "m2", sender: "bot", text: "Lamento escuchar eso. Voy a canalizar tu caso con un agente para el reembolso.", ts: "10:02" },
    ],
  },
  {
    id: "5",
    nombre: "Jorge Salcido",
    telefono: "+52 614 340 7719",
    mode: "human",
    estado: "activo",
    mensajes: [
      { id: "m1", sender: "cliente", text: "¿Puedo pagar contra entrega?", ts: "06:20" },
      { id: "m2", sender: "humano", text: "Por ahora solo manejamos pago en línea, pero estamos evaluando esa opción.", ts: "06:30" },
    ],
  },
  {
    id: "6",
    nombre: "+52 614 118 4456",
    telefono: "+52 614 118 4456",
    mode: "bot",
    estado: "activo",
    mensajes: [
      { id: "m1", sender: "cliente", text: "Hola", ts: "ayer" },
      { id: "m2", sender: "bot", text: "¡Hola! Soy el asistente virtual, ¿en qué puedo ayudarte hoy?", ts: "ayer" },
    ],
  },
];
