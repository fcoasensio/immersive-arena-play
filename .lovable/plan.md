

## Añadir imágenes a las fichas de juegos VR

### Contexto
Has subido `juegos_vr.rar` con imágenes para usar en las miniaturas del catálogo VR (`src/components/VRGamesCatalog.tsx`, datos en `src/data/vrGames.ts`). Actualmente las tarjetas muestran un placeholder (icono + degradado) porque ningún juego tiene `image` definido.

En modo plan no puedo extraer archivos `.rar` ni copiar binarios. Necesito modo default para procesarlo.

### Pasos al aprobar

1. **Extraer el .rar** a un directorio temporal y listar las imágenes que contiene.
2. **Mapear cada imagen a su juego** por nombre de fichero (ej: `battle.jpg` → slug `battle`, `doll-park.png` → slug `doll-park`). Para los nombres ambiguos te preguntaré antes de asignar.
3. **Copiar las imágenes** a `src/assets/vr-games/` con nombres normalizados (kebab-case = slug del juego).
4. **Actualizar `src/data/vrGames.ts`**:
   - Importar cada imagen como módulo ES6 (`import battleImg from '@/assets/vr-games/battle.jpg'`) para que Vite las optimice.
   - Asignar la ruta importada al campo `image` de cada juego correspondiente.
5. **Verificar el render** en `VRGamesCatalog.tsx` — ya soporta `game.image` con `<img>` + `object-cover` y fallback al icono si no hay imagen, así que no hace falta tocar el componente.

### Si faltan imágenes
Para los juegos sin imagen en el .rar, se mantendrá el placeholder actual (icono + degradado por categoría). Te listaré cuáles han quedado sin imagen al terminar para que puedas enviarme las que falten en otra tanda.

### Si hay imágenes que no corresponden a ningún juego
Te las listaré para confirmar a qué juego asignarlas o si deben descartarse.

