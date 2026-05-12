## Objetivo

Detectar reservas falsas (como "JJJJJJ...") y marcarlas como **sospechosas** para que no contaminen el calendario ni te hagan perder tiempo, sin bloquear nunca a clientes legítimos.

## Estrategia en 3 capas

### 1. Validaciones más estrictas (frontend + edge function)

Reforzar `ReservationSchema` en `create-reservation` y replicar en el formulario:

- **Nombre completo**: mínimo 2 palabras de ≥2 letras, cada palabra con al menos una vocal, solo letras (incluye acentos), espacios, guiones y apóstrofes. Sin más de 3 caracteres iguales seguidos (`/(.)\1{3,}/i` rechaza "JJJJ").
- **Teléfono**: se acepta extranjero. Regla mínima: 6–20 dígitos, opcional `+` inicial, no más de 4 dígitos iguales consecutivos (`6666...` se penaliza, no se bloquea).
- **Email**: además del formato válido, comprobar que el dominio tenga **registros MX reales** vía DNS-over-HTTPS (`https://dns.google/resolve?type=MX`) desde la edge function. Esto descarta `@jjj.es` y similares.
- **DNI / NIE / CIF español**: validar con algoritmo oficial de letra de control. Si no es español válido pero el teléfono parece extranjero, no se penaliza (por respeto a tu opción 1).
- **Código postal**: regex `^\d{4,10}$` (permisivo para extranjeros).
- **Repetición de caracteres**: cualquier campo de texto con >4 caracteres iguales consecutivos suma sospecha.

Las reglas duras (formato email, longitudes) se aplican en cliente y servidor; las reglas "blandas" alimentan el score.

### 2. Score de sospecha + nuevo estado

Migración de BD:
- Añadir valor `sospechosa` al enum `estado_reserva`.
- Añadir columnas `score_sospecha int default 0` y `motivos_sospecha text[]` a `reservas`.

En `create-reservation`, calcular score con pesos:

| Señal | Puntos |
|---|---|
| Email con dominio sin MX | +40 |
| DNI español inválido (y teléfono parece ES) | +30 |
| Nombre con 4+ caracteres iguales seguidos o sin vocales | +30 |
| Cualquier otro campo con 5+ caracteres iguales seguidos | +15 |
| Misma IP creando >2 reservas en 10 min | +25 |

- **Score ≥ 50** → estado `sospechosa`. **No** se crea evento en Google Calendar y **no** se envía email de confirmación al cliente.
- **Score < 50** → flujo normal.

### 3. Aviso por email al admin + revisión rápida

- Nueva edge function `send-suspicious-reservation-alert` (vía Resend, ya configurado) que te envía a ti un correo con: datos de la reserva, score, lista de `motivos_sospecha` y enlace directo al panel admin. Se dispara solo cuando el score ≥ 50.
- En `AdminReservas.tsx`:
  - Filtro nuevo "Sospechosas" con badge de contador.
  - En el detalle, mostrar `motivos_sospecha` como chips rojos y el score.
  - Botones **"Aprobar"** (cambia estado a `pendiente_pago`, dispara email al cliente + evento en Calendar) y **"Eliminar"**.

Así nunca pierdes una reserva legítima: si hay un falso positivo, la apruebas en 1 click.

## Cambios técnicos resumidos

- **Migración**: enum `estado_reserva` + `sospechosa`, columnas `score_sospecha` y `motivos_sospecha`.
- **Edge function `create-reservation`**: helpers `validarDNI`, `comprobarMX`, `calcularScore`; bifurcación según score; saltar Calendar/email si sospechosa; invocar `send-suspicious-reservation-alert` si score ≥ 50.
- **Nueva edge function `send-suspicious-reservation-alert`** (Resend).
- **Frontend `ReservationForm.tsx` / `ReservaForm.tsx`**: validaciones zod replicadas para feedback inmediato (nombre, repeticiones).
- **`AdminReservas.tsx`**: filtro Sospechosas, chips de motivos, botones Aprobar/Eliminar.
- Tipos Supabase se regeneran solos.

## Lo que no se cambia

- Flujo de pago (Bizum 50€), lógica de precios, chatbot, otras reservas existentes.