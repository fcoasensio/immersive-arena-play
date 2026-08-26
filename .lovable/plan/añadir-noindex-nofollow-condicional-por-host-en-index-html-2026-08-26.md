# Añadir `noindex,nofollow` condicional por host en `index.html`

## Cambio (único)
En `index.html`, dentro de `<head>` y antes del bundle de React, añadir un `<script>` inline que inyecte `<meta name="robots" content="noindex,nofollow">` cuando el host pertenezca a la publicación de Lovable (`shootandrunweb.lovable.app` y en general cualquier `*.lovable.app`):

```html
<script>
  (function () {
    try {
      var h = (location.hostname || "").toLowerCase();
      if (h === "shootandrunweb.lovable.app" || h.indexOf("lovable.app") !== -1) {
        var m = document.createElement("meta");
        m.name = "robots";
        m.content = "noindex,nofollow";
        document.head.appendChild(m);
      }
    } catch (e) {}
  })();
</script>
```

## Efecto
- En `shootandrunweb.lovable.app` (y previews `*.lovable.app`) → Google ve `noindex,nofollow` y deja de indexarlas.
- En `shootandrun.es` y `www.shootandrun.es` → no se inyecta nada → siguen indexables.
- El `<link rel="canonical" href="https://shootandrun.es/">` existente se mantiene.

## Verificación
- `curl -sL https://shootandrunweb.lovable.app/ | grep -i robots` → aparece `noindex,nofollow`.
- `curl -sL https://shootandrun.es/ | grep -i robots` → no aparece `noindex`.
