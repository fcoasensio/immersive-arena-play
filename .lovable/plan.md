# Cambio de correos internos: outdoor@ → hola@ y info@ → fcoasensio@

## Objetivo
Las direcciones `outdoor@shootandrun.es` e `info@shootandrun.es` no existen como buzones reales. Sustituirlas en todo el backend:

- `outdoor@shootandrun.es` → `hola@shootandrun.es`
- `info@shootandrun.es` (copia CC) → `fcoasensio@shootandrun.es`

## Archivos a modificar (6 Edge Functions)

| Función | Cambio |
|---|---|
| `supabase/functions/send-reservation-notification/index.ts` | `CC_EMAIL` info@ → fcoasensio@ |
| `supabase/functions/send-outdoor-budget-notification/index.ts` | `ADMIN_EMAIL` outdoor@ → hola@, `CC_EMAIL` info@ → fcoasensio@ |
| `supabase/functions/submit-lead-rapido/index.ts` | `ADMIN_EMAIL` outdoor@ → hola@, `CC_EMAIL` info@ → fcoasensio@ |
| `supabase/functions/sync-leads-instagram/index.ts` | `ADMIN_EMAIL` outdoor@ → hola@, `CC_EMAIL` info@ → fcoasensio@ |
| `supabase/functions/enviar-email-lead-aprobado/index.ts` | `REPLY_TO` outdoor@ → hola@ |
| `supabase/functions/send-suspicious-reservation-alert/index.ts` | `CC_EMAIL` info@ → fcoasensio@ |

## Qué NO cambia
- El remitente `outdoor@web.shootandrun.es` se mantiene: no es un buzón, es la dirección de envío del dominio verificado en Resend (`web.shootandrun.es`). Cambiarla rompería el envío de correos.
- Textos visibles para clientes, firma de los emails y pie RGPD.

## Verificación
1. Confirmar con búsqueda (`rg`) que no queda ninguna referencia a `outdoor@shootandrun.es` ni `info@shootandrun.es` en el código.
2. Redesplegar las 6 funciones afectadas para que el cambio quede activo.
