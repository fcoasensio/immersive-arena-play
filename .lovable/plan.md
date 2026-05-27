## Plan

### Objetivo
Modificar el componente `ScrollToTop` para que, además de hacer scroll al inicio al cambiar de ruta, también detecte el `hash` en la URL (ej: `/#packs`) y haga scroll automático a la sección correspondiente.

### Cambio técnico
1. Extender `ScrollToTop` para leer `hash` de `useLocation()`.
2. En el `useEffect`, si hay `hash`, buscar el elemento con ese `id` y hacer `scrollIntoView({ behavior: 'smooth' })`.
3. Si no hay hash o el elemento no existe, mantener el comportamiento actual (`window.scrollTo(0, 0)`).

### Archivo a modificar
- `src/components/ScrollToTop.tsx`

### Resultado esperado
- Abrir `https://shootandrunweb.lovable.app/#packs` desplazará automáticamente a la sección de precios.
- Abrir `https://shootandrunweb.lovable.app/#como-funciona` desplazará a la sección correspondiente.
- Navegación normal sin hash sigue funcionando igual.