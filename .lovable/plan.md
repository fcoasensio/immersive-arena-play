## Plan: Calificación automática de leads + emails con aprobación

### 1. Ampliar el popup de captación (`LeadCapturePopup.tsx`)

Añadir campos al formulario actual (manteniendo nombre, teléfono, tipo de evento, fecha, consentimiento) y dividirlo en 2 pasos para no saturar:

**Paso 1 — Contacto:** nombre, teléfono, consentimiento.
**Paso 2 — Detalles del evento:**

- **Actividad de interés**: Laser Tag (8+) / Realidad Virtual (12+) / No lo sé aún
- **Edad de los participantes**: 8-11 años (solo Laser Tag) / 12+ años / Mixto adultos y niños
- **Nº personas** (rangos): 1-7 / 8-15 / 16-25 / 25+
- **Presupuesto orientativo** (opcional): <200€ / 200-400€ / >400€ / No lo sé
- **Cuándo sería**: Esta semana / Este mes / 1-2 meses / Solo informándome
- **Código postal** (opcional)
- **¿Cómo nos conociste?** (opcional): Google / Instagram / TikTok / Recomendación / Otro

Validación cruzada: si actividad = VR y edad = "8-11 años" → mostrar aviso "VR es a partir de 12 años, te sugerimos Laser Tag".

### 2. Motor de scoring automático en backend

Añadir lógica en `submit-lead-rapido/index.ts` que calcule un score 0-100 y categoría **A/B/C** antes de guardar:

```text
Positivos
+25  Cuándo = "Esta semana"
+15  Cuándo = "Este mes"
+20  Tipo evento = empresa o despedida
+15  Personas 16-25
+20  Personas 25+
+15  Presupuesto > 400€
+10  Presupuesto 200-400€
+10  Actividad VR (ticket más alto)
+5   CP de Murcia capital o Alcantarilla
+5   Origen Google / Instagram

Negativos
-15  Cuándo = "Solo informándome"
-15  Actividad VR + Edad 8-11 (incompatible)
-10  Personas 1-7 con tipo "amigos"

Categorías
A: score >= 50    B: 25-49    C: <25
```

Guardar `score`, `categoria`, `motivos_score` (jsonb) en BD.

### 3. Columna score en `leads_rapidos` + panel admin

- **Migración**: añadir columnas `score` (int), `categoria` (text A/B/C), `motivos_score` (jsonb) a `leads_rapidos`.
- **Nuevo `AdminLeads.tsx**` (pestaña en `/admin`):
  - Tabla ordenable por categoría (A→C) y score desc
  - Badge color por categoría (A verde neón, B ámbar, C gris)
  - Filtros por categoría, tipo evento y rango de fechas
  - Botón directo "WhatsApp" y "Ver detalles" (motivos del score, datos completos)

### 4. Notificaciones diferenciadas + emails con aprobación

#### 4a. Email interno al admin (siempre)

Enriquecido con score, categoría y motivos:

- A: asunto `🔥 LEAD A - {nombre} ({tipo})` con CTA WhatsApp prominente
- B: `⚡ LEAD B - {nombre}`
- C: `📋 Lead C - {nombre}`

#### 4b. Borrador de email comercial al lead (solo categoría A y B)

Al recibir un lead A o B, el sistema:

1. Genera automáticamente un borrador de email comercial personalizado al cliente, según `tipo_evento` + `categoria` + datos del formulario.
2. Guarda el borrador en una nueva tabla `lead_emails_pendientes` con estado `pendiente_aprobacion`.
3. **NO se envía al cliente.** En su lugar, te llega un email interno con:
  - El borrador renderizado tal y como lo recibiría el cliente
  - Enlace al panel admin con dos botones: **✅ Aprobar y enviar** / **✏️ Editar antes de enviar**

#### 4c. Panel de aprobación en `/admin` (nueva pestaña "Emails pendientes")

Lista de borradores pendientes con:

- Datos del lead (nombre, email, teléfono, categoría)
- Vista previa del email (asunto + cuerpo HTML)
- Editor inline (textarea para asunto + cuerpo)
- Botones:
  - **Aprobar y enviar** → llama a edge function `enviar-email-lead-aprobado` que envía el email al cliente vía Resend, marca el borrador como `enviado` y registra `enviado_at`
  - **Editar** → permite modificar asunto/cuerpo, luego "Guardar y enviar"
  - **Descartar** → marca como `descartado` sin enviar

Estado posibles: `pendiente_aprobacion` | `enviado` | `descartado`

#### 4d. Plantillas de borradores (redacción para conversión)

**Email A — Cumpleaños/Despedida/Amigos:**

> **Asunto:** {nombre}, tu {tipo_evento} en shootandrun: propuesta lista 🎯
>
> Hola {nombre},
>
> Gracias por dejarnos tus datos — hemos preparado una propuesta para vuestro {tipo_evento} de {num_personas} personas el próximo {fecha_orientativa}.
>
> En shootandrun no hacemos partidas "de relleno": diseñamos cada experiencia para que cada minuto cuente.
>
> 🎯 **{actividad}** en arena indoor con equipo profesional láser tag  
> ⚡ Briefing táctico + 3-4 modos de juego adaptados al grupo.  
> 🎁 Zona privada para descanso o picoteo si lo necesitas
>
> **Reserva con solo 50€ de Bizum** al 606 32 30 53. El resto se paga el día de la actividad y se calcula sobre los jugadores reales que asistan (el número de la reserva es solo orientativo).
>
> Las franjas más demandadas vuelan rápido. Responde a este email o escríbenos por WhatsApp y te confirmo disponibilidad hoy mismo.
>
> Nos vemos en la arena ⚡
> Equipo shootandrun · Alcantarilla, Murcia · +34 606 32 30 53

**Email A — Empresa/Team building:**

> **Asunto:** Propuesta team building shootandrun para {nombre}
>
> Hola {nombre},
>
> Gracias por pensar en shootandrun para vuestro evento de empresa. Os hemos preparado una propuesta enfocada en lo que de verdad funciona en team building: cooperación bajo presión, decisiones rápidas y mucho que celebrar después.
>
> **Para vuestro grupo de {num_personas} personas proponemos:**
>
> ⚡ Sesión de laser tag indoor (90 min) con modos por equipos rotativos
> 🥽 Bloque opcional de VR free roam multijugador (sin mareos, hasta 6 simultáneos)
> 🍕 Zona privada con catering opcional
> 📊 Briefing inicial + entrega de "MVP del día" al final
>
> Los precios bajan a partir de 15 personas. Reserva de franja con transferencia de 150€, el resto se factura tras el evento sobre asistentes reales.
>
> ¿Cerramos fecha esta semana? Responde a este email o llámanos al 606 32 30 53.
>
> Un saludo,
> Equipo shootandrun

**Email B — Genérico informativo:**
Tono más informativo, menos urgencia, foco en resolver dudas y enviar info de packs.

#### 4e. Requisito previo: capturar **email** del lead

Para poder enviarles emails, hay que añadir el campo **email** al formulario del popup (actualmente solo se pide teléfono). Se añadirá como campo **opcional**: si no lo dejan, no se genera borrador y solo queda como contacto WhatsApp.

### Infraestructura de email

Para enviar emails al cliente desde botón de aprobación, se necesita:

- Lovable Emails (infraestructura de envío) — se configurará si no está ya activa
- Plantilla "app email" (transaccional) que renderiza el borrador aprobado

### Archivos afectados

- `src/components/LeadCapturePopup.tsx` — formulario en 2 pasos, nuevos campos, email opcional
- `supabase/functions/submit-lead-rapido/index.ts` — scoring + generación de borradores
- Nueva edge function `enviar-email-lead-aprobado` — envío del email aprobado al cliente
- Nueva migración: columnas en `leads_rapidos` + tabla `lead_emails_pendientes`
- `src/pages/Admin.tsx` + nuevos `src/components/admin/AdminLeads.tsx` y `AdminEmailsPendientes.tsx`
- Plantilla email transaccional

### Notas

- Los emails al cliente **nunca** se envían sin tu aprobación explícita en el panel admin.
- Puedes editar libremente asunto y cuerpo antes de enviar.
- Categoría C no genera borrador automático (baja prioridad, solo notificación interna).
- El chat-asistente y el flujo de reserva no se tocan.