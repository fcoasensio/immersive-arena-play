# Mantener shootandrun.es en Vercel con actualización automática desde GitHub

## Diagnóstico confirmado
- `www.shootandrun.es` apunta a Vercel (216.198.79.1), no a Lovable. Por eso los cambios hechos aquí no se ven en el dominio.
- La conexión del dominio en Lovable quedó iniciada hace 92 días sin completarse.
- El repositorio actual es interno de Lovable; no hay sincronización con GitHub todavía.
- `vercel.json` ya existe y está bien configurado (SPA + caché de assets).

## Objetivo
Que Vercel siga sirviendo shootandrun.es y se actualice automáticamente con cada cambio hecho en Lovable, vía GitHub.

## Pasos

### 1. Conectar este proyecto con GitHub (acción del usuario, 2 minutos)
- En Lovable: **Project Settings → Integrations → GitHub → Connect**.
- Elegir la organización/cuenta y crear el repositorio (p. ej. `shootandrun-web`).
- A partir de ahí, cada cambio en Lovable se sube a GitHub automáticamente (y viceversa).

### 2. Apuntar Vercel al repositorio de GitHub
- En Vercel: conectar el proyecto al repo nuevo (o cambiar el repo del proyecto existente en **Settings → Git**).
- Configuración de build: framework **Vite**, comando `npm run build` (o `bun run build`), salida `dist`.
- Añadir las variables de entorno en **Vercel → Settings → Environment Variables** (Production y Preview):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_SUPABASE_PROJECT_ID`
  (valores disponibles en el proyecto; sin ellas la web no hablaría con la base de datos).

### 3. Limpiar la conexión de dominio en Lovable
- Eliminar la entrada `www.shootandrun.es` (estado "initiated") de **Project Settings → Domains** para evitar confusiones; el DNS se queda apuntando a Vercel.
- La URL `shootandrunweb.lovable.app` sigue existiendo como secundaria (ya tiene `noindex`, así que no compite en Google).

### 4. Verificación
- Hacer un cambio pequeño en Lovable → comprobar que aparece un commit en GitHub → comprobar que Vercel despliega solo.
- Verificar en producción: `https://shootandrun.es` carga la web nueva, reservas y chat funcionan contra la misma base de datos, y `curl -s https://shootandrun.es/ | grep -i robots` no muestra `noindex` (el script solo lo inyecta en hosts `*.lovable.app`).

## Notas
- La base de datos y las funciones (reservas, emails, chat) viven en Lovable Cloud y **no cambian**: la web en Vercel las usa igual que ahora.
- Los despliegues de funciones y migraciones se siguen haciendo desde Lovable, independientemente de Vercel.
- Alternativa si no se quiere GitHub: publicar en Lovable y cambiar el DNS del dominio a Lovable. Descartada por decisión del usuario.
