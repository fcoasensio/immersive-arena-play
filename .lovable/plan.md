## Objetivo

Saber cuánto se usa el chatbot, sin guardar contenido de las conversaciones. Solo métricas anónimas.

## Qué se registra (y qué NO)

**Sí:**
- Una fila por cada **mensaje del usuario** enviado al asistente.
- Timestamp.
- `session_id` (uuid generado en el cliente y guardado en `sessionStorage`, se renueva al cerrar la pestaña) — sirve para contar conversaciones únicas sin identificar a nadie.
- `escalada` (bool) — si esa interacción terminó con `[ESCALAR]`.

**No:**
- Ni el texto del usuario, ni la respuesta del asistente.
- Ni IP, ni email, ni user agent.

Esto evita cualquier problema de RGPD: no hay datos personales.

## Cambios técnicos

### 1. Nueva tabla `chat_eventos`
```
id uuid pk
created_at timestamptz default now()
session_id uuid not null
escalada boolean not null default false
```
RLS:
- SELECT solo para `admin` (vía `has_role`).
- Sin INSERT desde cliente. La edge function inserta con `SERVICE_ROLE_KEY`.
- Sin UPDATE/DELETE.

Índice por `created_at` para las consultas del panel.

### 2. Edge function `chat-asistente`
- Generar/recibir `session_id` desde el body (lo manda el cliente).
- Insertar una fila en `chat_eventos` justo al recibir el mensaje (antes del stream, no añade latencia perceptible).
- Detectar `[ESCALAR]` en la respuesta acumulada y, al terminar el stream, hacer un `update` poniendo `escalada=true` en esa fila.

### 3. Cliente (`useChatStream.ts` + `ChatWidget.tsx`)
- Generar `session_id` con `crypto.randomUUID()` y persistirlo en `sessionStorage` (`shootandrun_chat_session`).
- Reutilizarlo en cada `send()` y enviarlo en el body.
- El botón "Reiniciar chat" genera un nuevo `session_id`.

### 4. Nueva pestaña en `/admin` → "Chatbot"
Componente `AdminChatbotStats.tsx` con KPIs simples:
- **Mensajes hoy / 7 días / 30 días**.
- **Conversaciones únicas** (distinct `session_id`) hoy / 7d / 30d.
- **Escalados** totales y % sobre conversaciones.
- **Gráfico de barras** (recharts, ya está en el proyecto) con mensajes por día de los últimos 30 días.

Consultas vía `supabase.from('chat_eventos').select(...)` desde el cliente admin (RLS ya bloquea a los demás).

## Lo que NO se hace

- Sin retención automática (los eventos no contienen nada sensible, ocupan ~50 bytes/fila).
- Sin tabla de mensajes ni guardado de contenido.
- Sin cambios en la política de privacidad (no hay datos personales).

## Resumen de archivos

- **Migración SQL**: crear tabla `chat_eventos` + RLS + índice.
- **Editar** `supabase/functions/chat-asistente/index.ts`: aceptar `session_id`, insertar evento, marcar `escalada` post-stream.
- **Editar** `src/hooks/useChatStream.ts`: gestión de `session_id`.
- **Editar** `src/components/chat/ChatWidget.tsx`: pasar reset de sesión.
- **Crear** `src/components/admin/AdminChatbotStats.tsx`.
- **Editar** `src/pages/Admin.tsx`: añadir pestaña "Chatbot".
