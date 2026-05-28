## Objetivo

Importar automáticamente los leads que llegan por Instagram a una Google Sheet hacia la tabla `leads_rapidos`, pasando por el mismo motor de scoring y borradores de email que el popup de la web. Sin trabajo manual.

## Cómo va a funcionar

```
Instagram → Google Sheet ── (cada 10 min) ──▶ Edge Function `sync-leads-instagram`
                                                    │
                                                    ├─ Lee filas nuevas de la Sheet
                                                    ├─ Marca cada fila como "procesada" en la propia Sheet
                                                    ├─ Calcula score + categoría (mismo motor)
                                                    ├─ Inserta en `leads_rapidos` (source = "instagram_sheet")
                                                    ├─ Genera borrador en `lead_emails_pendientes` (A/B con email)
                                                    └─ Envía notificación interna al admin (Resend)
```

## Pasos

### 1. Conectar Google Sheets
Conectar el connector `google_sheets` al proyecto (un click). El connector se autentica con tu cuenta Google y deja disponibles `LOVABLE_API_KEY` y `GOOGLE_SHEETS_API_KEY` para usarlas desde la edge function.

### 2. Preparar la Google Sheet (tú, una vez)
Estructura recomendada de columnas (en este orden):

```
A: Fecha | B: Nombre | C: Email | D: Tipo evento | E: Nº personas | F: Fecha evento | G: Procesado
```

- Las 6 primeras ya las tienes.
- Añadir **columna G "Procesado"** vacía. La edge function la rellenará con la fecha al importar para no duplicar.
- Opcional pero recomendado: columna `Teléfono` si lo capturas en algún momento. Si no llega teléfono desde Instagram, el sistema permitirá guardar el lead solo con email (ver punto 5).

Me das el ID de la Sheet (cadena entre `/d/` y `/edit` en la URL) y el nombre de la pestaña.

### 3. Refactor mínimo del scoring
Extraer la función `calcScore` y `buildLeadDraft` de `submit-lead-rapido/index.ts` a un módulo compartido `supabase/functions/_shared/lead-scoring.ts` para reutilizar desde la nueva función sin duplicar lógica.

### 4. Nueva edge function `sync-leads-instagram`
Hace:
- `GET` a la Sheet vía gateway: `…/spreadsheets/{ID}/values/Instagram!A2:G1000`
- Filtra filas con columna G vacía (no procesadas)
- Mapea valores → estructura de `leads_rapidos` (con valores por defecto razonables: `actividad_interes = "no_se"`, `como_nos_conociste = "instagram"`, `cuando` deducido de la fecha del evento)
- Ejecuta scoring, inserta lead, genera borrador si A/B, envía email interno
- `BATCH UPDATE` a la Sheet marcando columna G con timestamp de procesado
- Devuelve resumen `{ procesados, errores }`

### 5. Ajuste pequeño del esquema
El campo `telefono` en `leads_rapidos` es `NOT NULL`. Como Instagram normalmente solo trae email, hacerlo nullable o aceptar string vacío. Migración mínima:
- `ALTER TABLE leads_rapidos ALTER COLUMN telefono DROP NOT NULL`

### 6. Programación cada 10 minutos
Usar `pg_cron` + `pg_net` para invocar la función periódicamente (vía `supabase--insert`, no migration, porque incluye URL/anon key específicos del proyecto).

### 7. UI admin (mínimo)
En `AdminLeads.tsx` ya se ve el `source`. Añadir badge visual cuando `source = "instagram_sheet"` y filtro por origen para diferenciarlos del popup web. Sin pantallas nuevas.

## Detalles técnicos

**Mapeo Sheet → lead:**
- `cuando` se calcula automáticamente comparando `Fecha evento` con hoy: ≤7 días → `esta_semana`, ≤30 → `este_mes`, resto → `1_2_meses`.
- `num_personas`: se intenta parsear el número y mapear al rango (`1-7`, `8-15`, `16-25`, `+25`).
- `tipo_evento`: normalización flexible (acepta "cumple", "cumpleaños", "birthday" → `cumpleanos`; "empresa", "team building" → `empresa`; etc.). Si no matchea, → `otro`.
- `consentimiento = true` (contacto vino por DM voluntario, queda registrado en notas internas).

**Idempotencia:** la columna "Procesado" en la Sheet evita duplicados aunque el cron solape ejecuciones. Además, validación extra: si ya existe un lead con mismo email + fecha_orientativa en las últimas 24h, se omite.

**Errores:** si una fila falla el parseo, se loguea pero no se marca como procesada → se reintenta en la siguiente pasada. Si falla 3 veces, se marca con `ERROR: <motivo>` para revisión manual.

## Archivos

- **Nuevo:** `supabase/functions/_shared/lead-scoring.ts` (extracción)
- **Nuevo:** `supabase/functions/sync-leads-instagram/index.ts`
- **Modificado:** `supabase/functions/submit-lead-rapido/index.ts` (importa el módulo compartido)
- **Modificado:** `src/components/admin/AdminLeads.tsx` (badge de origen + filtro)
- **Migración:** `telefono` nullable en `leads_rapidos`
- **Cron job:** vía `supabase--insert` con `cron.schedule(...)` cada 10 min

## Lo que necesito de ti antes de implementar

1. Aprobar la conexión del conector **Google Sheets** cuando aparezca el prompt.
2. Pasarme el **ID de la Sheet** y el **nombre de la pestaña** (ej: `Instagram`).
3. Añadir la columna **"Procesado"** al final de la Sheet (vacía).
