## Resumen

Añadir un popup de captación de leads rápido en toda la web, que se muestre tras 8s o al 40% de scroll, con frecuencia controlada por localStorage, diseño coherente con la estética cyberpunk del sitio, y envío de los datos al backend.

## Aclaración importante sobre la integración

En el proyecto **no existe actualmente una integración con Google Sheets**. Los leads del formulario de outdoor y las reservas se envían por **email vía Resend** (funciones `send-outdoor-budget-notification` y `send-reservation-notification`).

Decisión por defecto (puedes pedir cambiarla): usar el mismo patrón que ya usamos para outdoor — guardar el lead en una **nueva tabla `leads_rapidos`** en la base de datos para que aparezcan en el panel admin, **y** enviar email de notificación con Resend al buzón de reservas. Si más adelante quieres añadir Google Sheets, se puede conectar el conector de Lovable y volcarlos también allí sin tocar el frontend.

## Comportamiento

- Mostrar tras 8s en la página, o al superar 40% de scroll (lo que ocurra primero).
- Cierre con X o clic fuera → guardar `leadPopupDismissedUntil` en localStorage = +7 días.
- Envío correcto → guardar `leadPopupSubmittedUntil` = +30 días.
- Si cualquiera de las dos claves está vigente, no mostrar.
- Desktop: `Dialog` centrado. Móvil (<768px): `Drawer` como bottom sheet.
- Montado en `App.tsx` para estar disponible en todas las rutas públicas (excluir `/admin*`).

## Diseño

- Fondo `bg-background` con borde `border-neon-blue/40`, glow sutil, header con badge tipo "Contacto rápido".
- Tipografía existente, botón principal variante `hero` o `neon` con texto "Contactadme por WhatsApp" + icono WhatsApp.
- Marca "shootandrun" siempre en minúsculas y con `translate="no"`.

## Formulario

Campos: Nombre*, Teléfono/WhatsApp*, Tipo de evento (select con las 6 opciones indicadas), Nº personas (opcional), Fecha orientativa (opcional, input date), Checkbox consentimiento*.

Validación con zod + react-hook-form. Teléfono y consentimiento obligatorios. Mensajes de error inline.

Campos ocultos enviados al backend: `source: "popup_contacto_rapido"`, `page_url`, `timestamp`, y los 5 `utm_*` leídos de `window.location.search` (persistidos en sessionStorage por si el usuario navega).

Estados: idle → loading → success ("¡Recibido! Te contactaremos pronto por WhatsApp.") / error ("Ha ocurrido un error. También puedes escribirnos directamente por WhatsApp." + botón directo a WhatsApp `wa.me/34606323053`).

## Backend

1. Migración: tabla `public.leads_rapidos` con campos del formulario + metadatos (source, page_url, utm_*, timestamp, created_at). RLS: solo admin lee; inserts denegados directos (se hacen vía edge function con service role). GRANTs estándar.
2. Edge function `submit-lead-rapido` (verify_jwt=false):
   - Valida body con zod, rate-limit en memoria por IP.
   - Inserta en `leads_rapidos` con service role.
   - Envía email vía Resend al destinatario configurado (reutiliza el patrón de `send-outdoor-budget-notification`).
   - Devuelve `{ ok: true }`.
3. Cliente llama con `supabase.functions.invoke('submit-lead-rapido', { body })`.

## Archivos

- `supabase/migrations/<timestamp>_leads_rapidos.sql` (nueva tabla + RLS + GRANTs)
- `supabase/functions/submit-lead-rapido/index.ts` (nueva edge function)
- `src/components/LeadCapturePopup.tsx` (componente principal con Dialog/Drawer responsive)
- `src/hooks/useLeadPopupTrigger.ts` (lógica de 8s + 40% scroll + localStorage)
- `src/lib/utm.ts` (helper para leer/persistir UTMs)
- `src/App.tsx` (montar `<LeadCapturePopup />` fuera de rutas admin)

## Detalles técnicos

- Responsive: usar `useIsMobile()` ya existente para decidir entre `Dialog` y `Drawer` de shadcn.
- Tokens semánticos del design system (sin colores hardcodeados).
- Helmet/SEO no afectado.
- No mostrar nunca en rutas `/admin*` ni durante el flujo de reserva ya abierto.
- Tests rápidos: verificar trigger por tiempo, por scroll, dismiss 7d, submit 30d, validación zod.

¿Procedemos con esta implementación (DB + email Resend), o prefieres otra forma de almacenamiento?