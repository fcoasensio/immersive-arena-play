## Bloquear siempre 75 min en Google Calendar

Actualmente los eventos creados en Google Calendar duran lo mismo que la actividad (90, 150 o 270 min), lo que bloquea franjas adyacentes innecesariamente. El cliente confirma que físicamente solo se solapan ~75 min entre reservas (el resto es preparación/tarta/regalos sin uso de pista).

### Cambio

En la edge function `supabase/functions/check-calendar-availability/index.ts`, dentro de la rama `action === "create"`:

- Ignorar el `duration` recibido y forzar siempre **75 minutos** al calcular `endDateTimeStr`.
- Mantener `duration` recibido en la descripción del evento (campo "⏱") para que el admin sepa la duración real de la actividad reservada.

Concretamente, sustituir el bloque que calcula `endHours/endMins/endH/endM` por un cálculo fijo de start + 75 min, y dejar la línea `⏱ ${durationMinutes} min` en la descripción mostrando la duración real (90/150/270).

### Lo que NO cambia

- Las llamadas con `action === "check"` ya usan `duration: "1"` desde el frontend, así que no se tocan.
- La duración almacenada en la base de datos (`reservas.duracion`) sigue siendo 90/150/270 según el tipo de reserva.
- Los formularios y la UI siguen mostrando la duración real al cliente.
- No se tocan los emails ni el flujo de pago.

### Resultado esperado

Cualquier reserva (cumpleaños 150 min, partida/despedida 90 min, evento 270 min) crea un evento en Google Calendar de exactamente 75 min desde la hora de inicio, dejando libres las franjas adyacentes para nuevas reservas.