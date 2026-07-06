## Conectar shootandrun.es y actualizar URLs canónicas

### 1. Conexión del dominio (acción manual del usuario)
No puedo conectar el dominio desde el chat. Tú tienes que hacerlo en:
**Project Settings → Project section → Domains → Connect Domain**, e introducir `shootandrun.es`.

Añade **dos entradas**: `shootandrun.es` y `www.shootandrun.es`. Marca una como Primary (recomiendo `shootandrun.es`). Lovable te guiará con los registros DNS (A → 185.158.133.1 y TXT `_lovable`) en tu registrador. Propagación hasta 72h; SSL se emite automático.

Requisito previo: el proyecto tiene que estar publicado (ya lo está en `shootandrunweb.lovable.app`).

### 2. Cambios de código (lo que sí hago yo)

Reemplazar todas las URLs `https://shootandrunweb.lovable.app` por `https://shootandrun.es` en:

- `index.html` — no hay canonical propio, pero conviene añadir `<link rel="canonical" href="https://shootandrun.es/" />` y `<meta property="og:url" content="https://shootandrun.es/" />` como fallback sitewide para crawlers sociales.
- `public/robots.txt` — actualizar la línea `Sitemap: https://shootandrunweb.lovable.app/sitemap.xml` → `https://shootandrun.es/sitemap.xml`.
- `public/sitemap.xml` — reemplazar los 16 `<loc>` para que apunten a `https://shootandrun.es/...`.
- `src/pages/Index.tsx` — canonical, `url` y `image` del JSON-LD `LocalBusiness`.
- `src/pages/LaserTagMurcia.tsx`, `CumpleanosLaserTagMurcia.tsx`, `EventosEmpresaLaserTag.tsx`, `RealidadVirtualMurcia.tsx` — canonicals y cualquier `og:url` / JSON-LD.
- `src/pages/Blog.tsx` y `src/pages/blog/*.tsx` (7 artículos) — canonicals.
- `src/pages/PoliticaPrivacidad.tsx`, `AvisoLegal.tsx` — canonicals si los tienen.
- `src/components/blog/BlogArticleLayout.tsx` — canonical dinámico (`/blog/${post.slug}`).
- `src/components/seo/SEOLandingLayout.tsx` — si construye canonicals.
- Cualquier otra referencia encontrada con `rg "shootandrunweb.lovable.app"`.

### 3. Verificación
Tras los cambios: `rg "shootandrunweb\.lovable\.app"` debe devolver 0 resultados (excepto quizá en `.lovable/plan.md`).

### 4. Después
- Publica de nuevo para que los canonicals actualizados lleguen al sitio en producción.
- Cuando `shootandrun.es` esté Active, resube el sitemap a Google Search Console apuntando a `https://shootandrun.es/sitemap.xml`.

### Nota
No renombro la clave `shootandrunweb.lovable.app` en la configuración de Lovable (esa URL seguirá existiendo como subdominio staging). El canonical le dice a Google que la versión indexable es `shootandrun.es`, evitando contenido duplicado.
