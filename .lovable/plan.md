# Dónde se editan los textos de los correos de reserva

Todos los correos se generan como HTML dentro de Edge Functions en `supabase/functions/`. No hay un editor visual ni plantillas externas: el texto está embebido en el código TypeScript de cada función. Para cambiar cualquier texto, edito el archivo correspondiente.

## Mapa de archivos

```
supabase/functions/
├── send-reservation-notification/index.ts   ← Correo de "Reserva recibida" (cliente + admin)
├── send-status-change-notification/index.ts ← Correo de cambio de estado (confirmada/cancelada…)
├── send-reschedule-notification/index.ts    ← Correo de reprogramación de fecha/hora
├── send-outdoor-budget-notification/index.ts← Correo de presupuesto outdoor
├── send-suspicious-reservation-alert/index.ts← Alerta interna de reserva sospechosa
└── _shared/gdpr-footer.ts                   ← Pie legal RGPD (común a todos los correos)
```

### 1. `send-reservation-notification/index.ts` (374 líneas)
Correo que se envía al crear una reserva. Contiene **dos plantillas**:
- **Correo al cliente** — función `buildCustomerEmail` (líneas ~240-304): saludo "¡Hola {nombre}! 👋", resumen de la reserva, bloque de precio, sección "Próximos pasos" (Bizum 50€, revisión, confirmación), y caja de contacto con dirección/maps/teléfono/email/web.
- **Correo al admin** — función `buildAdminEmail` (líneas ~207-237): tabla con todos los datos del cliente, DNI, dirección, precio.
- **Constante `MAPS_URL`** (línea 11): enlace de Google Maps que usa el cliente.
- **Footer del admin** (línea 235): dice `shootandrun · C/ Independencia 31, Alcantarilla (Murcia)`.

### 2. `send-status-change-notification/index.ts` (219 líneas)
Correo cuando cambias el estado de una reserva desde el panel. Contiene:
- **Etiquetas de estado** (`estadoLabels`) y **colores** (`estadoColors`): el texto que ve el cliente según el estado.
- **Mensajes de estado** (`statusMessages`): el texto explicativo para cada estado.
- **Correo al cliente** (líneas ~60-122): cabecera, badge de estado, mensaje, tabla con datos, footer de contacto.
- **Correo al admin** (líneas ~124-157): resumen breve del cambio.
- **Footer de contacto** (línea 113): `Avda. Fernando III El Santo, 24. 30820-Alcantarilla (Murcia)` — ya correcto.

### 3. `send-reschedule-notification/index.ts` (186 líneas)
Correo cuando reprogramas fecha/hora desde el panel. Contiene:
- **Correo al cliente** (líneas ~50-108): saludo, fecha anterior tachada en rojo, nueva fecha en verde, tabla resumen.
- **Correo al admin** (líneas ~110-137): resumen breve.
- **Footer de contacto** (línea 100): `Avda. Fernando III El Santo, 24` — ya correcto.

### 4. `send-outdoor-budget-notification/index.ts` (219 líneas)
Correo del formulario de presupuesto outdoor. Contiene:
- **Correo al admin** (líneas ~134-157): datos del cliente, empresa, ubicación, evento.
- **Correo al cliente** (líneas ~164+): confirmación de recepción del presupuesto.
- **Footer del admin** (línea 154): `shootandrun · C/ Independencia 31, Alcantarilla (Murcia)`.

### 5. `send-suspicious-reservation-alert/index.ts` (5370 bytes)
Alerta interna que recibe el admin cuando una reserva se marca como sospechosa. Texto breve, solo para ti.

### 6. `_shared/gdpr-footer.ts` (48 líneas) — **Común a todos los correos**
Pie legal RGPD/LOPDGDD bilingüe (español + inglés) que se adjunta automáticamente a todos los correos. Contiene:
- Texto legal en español (líneas 11-14): confidencialidad, responsable del tratamiento (Francisco Jiménez Asensio, NIF 52806442Y), derechos.
- Texto legal en inglés (líneas 18-21).
- **Dirección postal** (líneas 21 y 32): dice `C/ Independencia, 31, 30820 - Alcantarilla (Murcia)` — debe corregirse.

## Direcciones incorrectas pendientes de corregir

Confirmaste que la dirección correcta es **Avda. Fernando III El Santo, 24, 30820 Alcantarilla (Murcia)**. Aún aparece `C/ Independencia 31` en estos sitios:

| Archivo | Línea | Texto actual | Corrección |
|---------|-------|-------------|------------|
| `send-reservation-notification/index.ts` | 11 | `MAPS_URL = "...q=C/+Independencia+31..."` | Cambiar a la dirección correcta |
| `send-reservation-notification/index.ts` | 235 | `C/ Independencia 31, Alcantarilla (Murcia)` | `Avda. Fernando III El Santo, 24, 30820 Alcantarilla (Murcia)` |
| `send-outdoor-budget-notification/index.ts` | 154 | `C/ Independencia 31, Alcantarilla (Murcia)` | Igual |
| `_shared/gdpr-footer.ts` | 21 | `C/ Independencia, 31, 30820 - Alcantarilla (Murcia)` | Igual |
| `_shared/gdpr-footer.ts` | 32 | `C/ Independencia, 31, 30820 - Alcantarilla (Murcia)` | Igual |

## Qué hacer ahora

1. **Si solo querías saber dónde están** — este plan es tu referencia. Dime qué texto concreto quieres cambiar y en qué correo, y lo edito.
2. **Corregir las 5 direcciones** — puedo aplicar las correcciones de la tabla de arriba en un único paso para que ningún correo muestre "C/ Independencia 31".
