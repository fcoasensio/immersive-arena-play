## Plan: Añadir FAQ sobre número de jugadores en reservas

**Objetivo:** Añadir una nueva pregunta frecuente (FAQ) a todas las páginas de actividades que aclare que el número de jugadores de la reserva es orientativo y se calcula el importe final con los jugadores reales.

### Cambios a realizar

#### 1. Páginas de actividades (4 archivos)
Añadir la siguiente FAQ a los arrays `faqs` de cada página:

- **Pregunta:** "¿Qué pasa si el número real de jugadores no coincide con mi reserva?"
- **Respuesta:** "No pasa nada. El número de jugadores que indicas en la reserva es orientativo. El importe final se calcula con los jugadores reales que asistan el día de la actividad."

Archivos a modificar:
- `src/pages/LaserTagMurcia.tsx`
- `src/pages/RealidadVirtualMurcia.tsx`
- `src/pages/CumpleanosLaserTagMurcia.tsx`
- `src/pages/EventosEmpresaLaserTag.tsx`

#### 2. Chat-asistente
Actualizar `supabase/functions/chat-asistente/knowledge.ts` para incluir esta información en la base de conocimiento del asistente, en la sección de reservas/pagos.

### Notas
- Se usa el componente `SEOLandingLayout` existente que renderiza las FAQs en acordeón automáticamente.
- No requiere cambios de diseño ni estructura, solo contenido.
