# Copia oculta en las respuestas a leads

## Cómo funciona hoy
Al pulsar "Aprobar y enviar" en /admin → Emails pendientes, el correo sale desde el servicio de envío de la web (remitente `outdoor@web.shootandrun.es`, respuestas a `hola@shootandrun.es`). No pasa por tu buzón, por eso no aparece en "Enviados". Sí queda guardado en el admin con estado "enviado", fecha y texto final.

## Cambios
1. Añadir copia oculta (CCO) a `fcoasensio@shootandrun.es` en cada respuesta a un lead. El cliente no la ve.
2. En la pestaña Emails pendientes, mostrar una nota: "Se envía desde outdoor@web.shootandrun.es · respuestas a hola@shootandrun.es · copia oculta a fcoasensio@shootandrun.es".
3. Mostrar los ya enviados con su fecha, para consultarlos desde el admin.

## Detalle técnico
- `supabase/functions/enviar-email-lead-aprobado/index.ts`: añadir `bcc: ["fcoasensio@shootandrun.es"]` a `resend.emails.send` y redesplegar.
- `AdminEmailsPendientes.tsx`: nota informativa y filtro de enviados (solo lectura).
