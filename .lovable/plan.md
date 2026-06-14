# Carrusel "Empresas que confían en nosotros"

Añadir una sección con un marquee infinito en escala de grises a la página `/eventos-empresa-laser-tag`, mostrando los logos (versiones monocromas estilizadas) de las 10 empresas indicadas.

## Empresas

Decathlon Almería · Decathlon Toledo · Abundantia Investments SL · CITROMUR SL · ASEGRICOLA SL · VERISURE · EPAM · NEORIS · SKYNET SYSTEMS SL · SIM SEGURIDAD SL · LIDL

(EPAM y NEORIS se tratan como dos marcas separadas — confírmame si debieran ser una sola "EPAM NEORIS".)

## Diseño visual

- Banda horizontal con scroll continuo (sin botones), pausa al hover.
- Logos en blanco/gris claro sobre fondo oscuro, opacidad ~50%, al hover sube a 100%.
- Altura uniforme (~48–56px), separación generosa, máscara con fade en los bordes laterales para que entren/salgan suavemente.
- Encabezado discreto: "Empresas que ya han confiado en nosotros".
- Ubicación: nueva sección dentro de `SEOLandingLayout`, colocada justo después del bloque de "Beneficios" y antes de "Cómo organizar tu evento".

## Logos (monocromos estilizados)

Para evitar problemas con marcas registradas y mantener coherencia visual:

- Generaré 10 SVG monocromos (blanco) tipográficos/marca-denominativa con el nombre de cada empresa en una tipografía sobria que evoque su identidad sin reproducir el logo oficial.
- Se guardarán como SVGs inline en un único archivo `src/components/seo/ClientLogosMarquee.tsx` (sin assets binarios), lo que mantiene el bundle ligero y permite recolorearlos con `currentColor`.

## Implementación técnica

1. **Nuevo componente** `src/components/seo/ClientLogosMarquee.tsx`
   - Array con `{ name, Logo }` (10 entradas, SVG monocromos inline).
   - Renderiza dos copias consecutivas de la lista dentro de un contenedor con `overflow-hidden`, aplicando animación CSS `translateX(-50%)` infinita (~40s lineal).
   - Máscara con `mask-image: linear-gradient(...)` para fade lateral.
   - `pause-on-hover` mediante `:hover { animation-play-state: paused }`.
   - Accesibilidad: cada logo con `aria-label`, contenedor con `role="region"` y `aria-label="Empresas que confían en nosotros"`.

2. **Keyframes** añadidos en `tailwind.config.ts`:
   ```
   "marquee": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } }
   ```
   y `animation: { marquee: "marquee 40s linear infinite" }`.

3. **Integración** en `src/pages/EventosEmpresaLaserTag.tsx`: importar el componente y colocarlo entre los bloques "Beneficios" y "Cómo organizar tu evento".

## Fuera de alcance

- No se descargan logos oficiales ni se suben binarios.
- No se modifican otras páginas (puede replicarse después si quieres).
- Sin cambios en backend ni base de datos.
