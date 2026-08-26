# Evitar que Google indexe `shootandrunweb.lovable.app`

## Diagnóstico (confirmado)
- `shootandrun.es` ya sirve la web (Vercel, HTTP 200) y su canonical apunta a sí mismo. Correcto.
- `shootandrunweb.lovable.app` (publicación de Lovable) también sirve HTTP 200 el mismo `index.html` y el mismo `robots.txt`.
- Ese `robots.txt` permite rastrear todo (`Allow: /`); y aunque el canonical ya apunta a `shootandrun.es`, canonical es solo una pista que Google puede ignorar cuando la URL está viva y rastreable.
- No existe `noindex` ni redirección 301 desde `lovable.app` → `shootandrun.es`. Por eso Google sigue mostrándola.

No podemos poner cabeceras HTTP ni redirecciones en el dominio `lovable.app` (lo gestiona Lovable), y mover el DNS a Lovable rompería tu hosting en Vercel. La solución fiable dentro del código es una directiva `noindex` condicional por host.

## Cambio en código

**1. `index.html` — `noindex` condicional por host (en `<head>`, antes del bundle de la app)**

Añadir un `<script>` inline al inicio del `<head>` que inyecte `<meta name="robots" content="noindex,nofollow">` solo cuando el host **no** sea `shootandrun.es` ni `www.shootandrun.es`:

```html
<script>
  (function () {
    try {
      var h = (location.hostname || '').toLowerCase();
      if (h && h !== 'shootandrun.es' && h !== 'www.shootandrun.es') {
        var m = document.createElement('meta');
        m.name = 'robots';
        m.content = 'noindex,nofollow';
        document.head.appendChild(m);
      }
    } catch (e) {}
  })();
</script>
```

Efecto:
- En `shootandrunweb.lovable.app` y en las URLs de preview (`id-preview--...lovable.app`) → se inyecta `noindex,nofollow` → Google deja de indexarlas.
- En `shootandrun.es` y `www.shootandrun.es` → no se inyecta nada → siguen indexables.
- El `<link rel="canonical" href="https://shootandrun.es/">` existente se mantiene como señal de consolidación.

Notas:
- Google sí respeta un `noindex` inyectado por JS (lo procesa su Web Rendering Service). Puede haber un retardo hasta que lo renderice; por eso se complementa con los pasos externos de GSC.
- El script se ejecuta antes que el bundle de React, así que la meta está presente lo antes posible.

## Pasos externos (los haces tú desde Google Search Console)

2. Verifica la propiedad **`https://shootandrun.es`** en Google Search Console (si no lo está ya), para que el dominio canónico sea el que controlas.
3. Una vez desplegado el `noindex`, usa la herramienta de **Eliminación temporal de URLs** de GSC sobre `https://shootandrunweb.lovable.app/` para acelerar la retirada (es temporal ~6 meses; la retirada definitiva la garantiza el `noindex`).
4. Confirma que no quedan enlaces internos ni el sitemap apuntan a `lovable.app` (ya verificado: `robots.txt` y `sitemap.xml` usan `shootandrun.es`).

## Opcional (medida más definitiva)
Si **no** usas la publicación de Lovable para nada (despliegas por GitHub → Vercel), podrías **despublicar** el proyecto en Lovable: la URL `shootandrunweb.lovable.app` dejaría de existir y Google la eliminaría del índice por sí sola. Esto es decisión tuya; si la necesitas para previsualizar compartidos, mantén la publicación y aplica solo el `noindex` del paso 1.

## Verificación tras aplicar
- `curl -sL https://shootandrunweb.lovable.app/ | grep -i robots` debe mostrar el `noindex,nofollow`.
- `curl -sL https://shootandrun.es/ | grep -i robots` **no** debe mostrar `noindex`.
- En GSC, Inspección de URL de `lovable.app` pasará a "no indexada" tras el siguiente rastreo.
