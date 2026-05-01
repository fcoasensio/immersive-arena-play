## Reforzar regla de comida externa en el chatbot

El asistente debe dejar inequívocamente claro que **lo único que se permite traer de fuera es la tarta**. Menús infantiles, aperitivos, snacks, bebidas y merienda de los padres están PROHIBIDOS bajo cualquier concepto.

### Cambios

**`supabase/functions/chat-asistente/knowledge.ts`**

En las dos secciones de actividades (Laser Tag y VR), reemplazar las dos líneas actuales sobre menú/merienda por una regla unificada y más explícita:

- Eliminar las líneas ambiguas tipo *"Merienda: No se puede traer merienda. Únicamente podrían traer la tarta"*.
- Sustituir por una entrada destacada con prefijo **IMPORTANTE** que enumere explícitamente lo prohibido (menús infantiles, aperitivos, snacks, bebidas, merienda de padres) y deje claro que **solo la tarta** está permitida desde el exterior. Todo lo demás debe consumirse del menú incluido o de la cantina.

La sección `## Cantina` ya contiene la línea *"No se puede traer comida del exterior (excepto la tarta)"* — se mantiene como refuerzo.

### Resultado

Si un cliente pregunta *"¿puedo traer la merienda de los padres?"*, *"¿puedo llevar mis propios sandwiches?"* o *"¿podemos traer aperitivos para los adultos?"*, el bot responderá con un **no** claro citando la regla, y solo confirmará la tarta como excepción.

No requiere redeploy manual: las edge functions se despliegan automáticamente al guardar.