# CRM WhatsApp Híbrido (Bot + Humano)

Panel tipo WhatsApp Web para administrar conversaciones de un chatbot con
intervención manual. Next.js 14 (App Router) + TailwindCSS + Zustand.

## Correr el proyecto

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Estructura

```
app/
  layout.tsx        -> layout raíz, importa globals.css
  page.tsx           -> compone los 3 paneles (Sidebar / Chat / Control)
  globals.css        -> directivas de Tailwind

components/
  ConversationList.tsx  -> sidebar izquierda: lista, buscador, filtros
  ConversationItem.tsx  -> item individual de la lista
  ChatWindow.tsx         -> panel central: header + mensajes + input
  MessageBubble.tsx      -> burbuja de mensaje (cliente/bot/humano)
  ChatInput.tsx          -> input de texto, deshabilitado si mode !== "human"
  ControlPanel.tsx       -> panel derecho: estado, acciones, semáforo, métricas
  ModeToggle.tsx          -> switch bot/humano en el header del chat
  statusStyles.ts         -> mapeo centralizado de colores por estado

store/
  useChatStore.ts    -> estado global con Zustand (conversaciones, activeId,
                        selectConversation, setMode, sendMessage)

data/
  mockConversations.ts  -> datos simulados con el shape pedido:
                           { id, telefono, nombre, mode, estado, mensajes[] }

types/
  index.ts           -> tipos compartidos + getStatus() (deriva bot/escalado/human)
```

## Conectar con el backend (n8n + Twilio)

Los únicos puntos que hay que tocar están en `store/useChatStore.ts`:

1. **Cargar conversaciones reales**: reemplazar `mockConversations` por un
   `fetch("/api/conversations")` dentro de un `useEffect` (o mejor, usar
   `create` con un middleware async / React Query) que traiga las
   conversaciones desde tu backend n8n.

2. **Enviar mensajes**: en `sendMessage`, además de actualizar el estado
   local, hacer un `POST` al webhook de n8n que dispara el envío por Twilio.
   Ejemplo:
   ```ts
   sendMessage: async (id, text) => {
     await fetch("/api/n8n/send-message", {
       method: "POST",
       body: JSON.stringify({ conversationId: id, text }),
     });
     set((state) => ({ ...actualiza igual que ahora... }));
   }
   ```

3. **Mensajes entrantes en tiempo real**: agregar un websocket o polling
   (ej. Server-Sent Events desde n8n) que dispare `set()` sobre
   `conversations` cuando llegue un mensaje nuevo del cliente o del bot.

4. **Cambiar de modo**: `setMode` debería también notificar a n8n para que
   el flujo del bot se pause o reanude según corresponda.

## Notas de diseño

- El color de estado (verde/naranja/azul) se deriva siempre con
  `getStatus()` a partir de `mode` + `estado`, nunca se guarda como campo
  aparte, para evitar que ambos datos queden desincronizados.
- Las conversaciones escaladas se ordenan primero en la lista, para que el
  agente no tenga que buscarlas.
- El input de chat queda deshabilitado automáticamente si `mode !== "human"`.
