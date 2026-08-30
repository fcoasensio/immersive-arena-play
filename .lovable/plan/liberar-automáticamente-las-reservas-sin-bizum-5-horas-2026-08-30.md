# Liberar automáticamente las reservas sin Bizum (5 horas)

Hoy, al crear una reserva se genera el evento en Google Calendar aunque esté en estado "pendiente de pago", así que esa hora bloquea a otros clientes indefinidamente. El plan añade un plazo de 5 horas, avisos claros al cliente, un recordatorio y la liberación automática de la hora.

## 1. Avisos al cliente (antes y después de reservar)

- En el formulario de reserva, junto al paso final: aviso destacado "Tu hora queda bloqueada 5 horas. Si no recibimos el Bizum de 50 € al 606323053 en ese plazo, la hora se liberará para otros clientes y la reserva quedará cancelada."
- En la pantalla de reserva enviada: mismo aviso con la hora límite concreta (fecha y hora exacta en que expira).
- En el email de confirmación al cliente: bloque destacado con el importe, el número de Bizum y la hora límite.
- En el email interno al equipo: se indica también la hora límite.
- Nuevo aviso interno para ti en cuanto se crea cualquier reserva: email a `hola@shootandrun.es` con el asunto "Nueva reserva pendiente de confirmación (Bizum 50 €)", indicando nombre, teléfono, email, actividad, fecha/hora, importe total, el anticipo de 50 € y la hora límite de expiración, para que estés pendiente de la cuenta del banco. Este aviso también sirve de cabecera del email interno ya existente, asegurando que el "pendiente de Bizum" quede claro y destacado.

## 2. Recordatorio antes de expirar

- A ~1 hora antes del límite (es decir, unas 4 horas después de crear la reserva), si sigue sin pago, se envía un email recordatorio al cliente: "Quedan menos de 60 minutos para confirmar tu reserva con el Bizum".
- Se envía una sola vez por reserva.

## 3. Liberación automática

- Pasadas 5 horas sin pago, la reserva pasa a estado "cancelada" (motivo: no confirmada), se elimina su evento de Google Calendar y la hora vuelve a estar disponible.
- Se envía un email al cliente informando de la cancelación por falta de confirmación, con enlace para volver a reservar, y aviso interno al equipo.
- Las reservas marcadas como pagadas/confirmadas por el administrador nunca se cancelan. Las marcadas como "sospechosas" no se tocan por este proceso (las revisa el admin).

## 4. Panel de administración

- En el detalle de la reserva se muestra el tiempo restante para expirar (o "expirada").
- El administrador puede ampliar el plazo de una reserva concreta si el cliente avisa de que pagará más tarde.
- El plazo de 5 horas y la antelación del recordatorio quedan configurables desde la sección de configuración.

## Detalles técnicos

- Migración: añadir a `reservas` las columnas `expira_at timestamptz`, `recordatorio_enviado_at timestamptz`, `cancelada_motivo text`. Backfill: `created_at + interval '5 hours'` para las pendientes actuales.
- `create-reservation`: calcular y guardar `expira_at = now() + plazo` (plazo leído de `configuracion`, clave nueva `reserva_hold_horas`, valor por defecto 5; `reserva_recordatorio_minutos`, por defecto 60).
- Nueva Edge Function `expirar-reservas-pendientes` (service role):
  1. Selecciona `estado = 'pendiente_pago'` con `expira_at - recordatorio <= now() < expira_at` y sin recordatorio → envía email recordatorio y marca `recordatorio_enviado_at`.
  2. Selecciona `estado = 'pendiente_pago'` con `expira_at <= now()` → borra el evento de calendario reutilizando `check-calendar-availability` con `action: "delete"` y `google_calendar_event_id`, actualiza estado a `cancelada` con `cancelada_motivo = 'no_confirmada'`, y envía emails al cliente y a `hola@shootandrun.es`.
  Ambos pasos son idempotentes y acotados por lote.
- Cron con `pg_cron` + `pg_net` cada 15 minutos invocando la función (vía `run_sql`, no migración, porque incluye URL y clave del proyecto).
- Plantillas de email nuevas (recordatorio y cancelación) siguiendo el estilo de `send-reservation-notification` e incluyendo el pie RGPD de `_shared/gdpr-footer.ts`.
- Frontend: textos de aviso en `ReservaForm.tsx` (paso final y pantalla de éxito) y columna/indicador de expiración en `AdminReservas.tsx`, con acción "Ampliar plazo" (+5 h).
