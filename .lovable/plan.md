

## Corregir precio del Pack Cumpleaños

### Contexto
Según la indicación del usuario:
- **Cumpleaños** = 25€ por persona (actualmente mal en PacksSection: pone 20€)
- **Despedidas** = 20€ por persona (ya está correcto)

### Cambios necesarios

**1. Actualizar `src/components/PacksSection.tsx`**
- Cambiar el precio del pack "Cumpleaños" en `FALLBACK_PACKS` de `"Desde 20€/pers."` a `"Desde 25€/pers."`
- El pack "Despedidas" ya está correcto en 20€, no se toca

### Notas
- El fallback solo se muestra si la base de datos no tiene packs activos o falla la carga
- Si hay datos en la tabla `packs` de Supabase, deberían revisarse allí también para consistencia total

