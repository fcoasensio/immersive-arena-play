# Cambiar correos de notificación: outdoor@ → hola@ y info@ → fcoasensio@

Sustituir en todas las funciones de correo las dos direcciones internas, para que las notificaciones del negocio lleguen a los bucles actualizados:

- `outdoor@shootandrun.es` → `hola@shootandrun.es`
- `info@shootandrun.es` → `fcoasensio@shootandrun.es`

## Cambios por archivo

### 1. `supabase/functions/submit-lead-rapido/index.ts` (líneas 12-13)
- `ADMIN_EMAIL`: `outdoor@shootandrun.es` → `hola@shootandrun.es`
- `CC_EMAIL`: `info@shootandrun.es` → `fcoasensio@shootandrun.es`

### 2. `supabase/functions/enviar-email-lead-aprobado/index.ts` (línea 13)
- `REPLY_TO`: `outdoor@shootandrun.es` → `hola@shootandrun.es`

### 3. `supabase/functions/sync-leads-instagram/index.ts` (líneas 12-13)
- `ADMIN_EMAIL`: `outdoor@shootandrun.es` → `hola@shootandrun.es`
- `CC_EMAIL`: `info@shootandrun.es` → `fcoasensio@shootandrun.es`

### 4. `supabase/functions/send-suspicious-reservation-alert/index.ts` (línea 9)
- `CC_EMAIL`: `info@shootandrun.es` → `fcoasensio@shootandrun.es`

### 5. `supabase/functions/send-reservation-notification/index.ts` (línea 9)
- `CC_EMAIL`: `info@shootandrun.es` → `fcoasensio@shootandrun.es`

### 6. `supabase/functions/send-outdoor-budget-notification/index.ts` (líneas 8-9)
- `ADMIN_EMAIL`: `outdoor@shootandrun.es` → `hola@shootandrun.es`
- `CC_EMAIL`: `info@shootandrun.es` → `fcoasensio@shootandrun.es`

## Despliegue
Tras editar, redesplegar las 6 funciones afectadas para que el cambio esté en producción.

## Notas
- El remitente `FROM` (`outdoor@web.shootandrun.es`) no se toca: es la dirección técnica de envío verificada en Resend, no un buzón que recibes.
- `escalar-consulta-chat` ya envía a `hola@shootandrun.es`, no necesita cambios.
