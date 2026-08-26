# Integración Chat API de Botpress — El Parrillero Argentino

## Resumen
El chatbot de la web se conecta directamente a **Botpress Chat API** (integración "Chat" del bot).
**n8n ya NO recibe mensajes de chat** — queda exclusivamente para reservas/pedidos → Google Sheets → Gmail.

## Paso 1 — Activar la integración en Botpress Studio
1. Abrir el bot en **Botpress Studio**
2. Ir a **Integration Hub**
3. Activar la integración **"Chat"** (aparte de la de Webchat que ya está instalada)
4. Copiar el **webhookId** que genera (es distinto del configUrl del widget embebido)

## Paso 2 — Configurar el frontend
Dos opciones en `script.js` (sección CHATBOT, al final del archivo):

**Opción A — fijarlo en el código:**
```js
const BOTPRESS_WEBHOOK_ID_CODIGO = 'AQUI_EL_WEBHOOK_ID';
```

**Opción B — sin editar código** (consola del navegador, F12):
```js
localStorage.setItem('parrillaBpWebhookId', 'AQUI_EL_WEBHOOK_ID')
location.reload()
```

La API base es: `https://chat.botpress.cloud/{webhookId}`

## Flujo de conexión

### Con SDK oficial (`npm install @botpress/chat`) — para Node/bundlers
```js
import { Client } from '@botpress/chat'

const client = new Client({ apiUrl: `https://chat.botpress.cloud/${WEBHOOK_ID}` })

// una vez por visitante, guardar user.id y key (ej. localStorage)
const { user, key: xChatKey } = await client.createUser({})

// una vez por sesión de chat, guardar conversation.id
const { conversation } = await client.createConversation({ xChatKey, participants: [user.id] })

// cada vez que el visitante escribe:
await client.createMessage({
  xChatKey,
  conversationId: conversation.id,
  payload: { type: 'text', text: mensajeDelUsuario }
})

// para recibir respuestas en tiempo real:
const listener = await client.listenConversation({ id: conversation.id, xChatKey })
listener.on('message_created', (ev) => { /* mostrar mensaje del bot */ })
```

### Sin SDK (REST plano) — lo que usa esta web (sitio estático sin bundler)
Mismos pasos contra `https://chat.botpress.cloud/{webhookId}/...` con header `x-user-key: <xChatKey>`:

| Acción | Endpoint |
|---|---|
| Crear usuario | `POST /users` |
| Crear conversación | `POST /conversations` |
| Enviar mensaje | `POST /conversations/{id}/messages` — body `{ payload: { type:'text', text } }` |
| Leer mensajes (polling) | `GET /conversations/{id}/messages?nextToken=` |

## Arquitectura final del chatbot web

```
Mensaje del visitante
        │
        ▼
┌─────────────────────────────┐
│ 1. Motor local (chatbot-reservas.js)     │
│    • Disponibilidad de mesas             │
│    • Horarios, menú, ubicación           │
│    • Flujo guiado de reserva             │
│    → Si responde, no sale de la web      │
└──────────────┬──────────────┘
               │ si no aplica (pregunta general)
               ▼
┌─────────────────────────────┐
│ 2. Botpress Chat API                     │
│    createUser → createConversation       │
│    → createMessage → polling respuestas  │
│    sessionId = conversation.id           │
└──────────────┬──────────────┘
               │ si falla
               ▼
┌─────────────────────────────┐
│ 3. Mensaje de respaldo                   │
│    (WhatsApp directo del restaurante)    │
└─────────────────────────────┘
```

- El `sessionId` que manejaba el front ahora es simplemente el `conversation.id` que devuelve Botpress.
- El tipo `"chat"` al webhook de n8n **ya no aplica**.
- Las reservas confirmadas por el motor local siguen llegando a n8n con `tipo: "reserva"` (flujo intacto).

## Archivos involucrados
- `script.js` — configuración + conexión Botpress (sección CHATBOT)
- `chatbot-reservas.js` — motor local de disponibilidad/reservas
- `index.html` / `styles.css` — UI estilo WhatsApp
