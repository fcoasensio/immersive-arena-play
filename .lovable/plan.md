

## Plan: Convertir logo de texto a imagen

### Objetivo
Reemplazar el texto "SHOOTANDRUN" en el Navbar por una imagen SVG que no pueda ser traducida por el navegador.

### Enfoque
Crear un archivo SVG con el texto incrustado como paths (no como texto editable), lo que previene la traducción automática del navegador.

### Cambios necesarios

1. **Crear logo SVG** (`src/assets/logo-shootandrun.svg`)
   - Texto "SHOOTANDRUN" como paths o con atributo `translate="no"`
   - Estilos consistentes con el diseño actual (font-display, bold, neon colors)

2. **Actualizar Navbar** (`src/components/Navbar.tsx`)
   - Reemplazar el `<span>` con el texto por un `<img>` que cargue el SVG
   - Mantener el icono Crosshair si se desea, o integrarlo en el SVG

### Detalles técnicos
- El SVG usará el atributo `translate="no"` para prevenir traducción
- Estilos: text-xl md:text-2xl, font-bold, color consistente con el tema
- Dimensiones aproximadas: width="200" height="40"

