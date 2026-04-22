
## Badges de edad y jugadores en catálogo VR

Implementar etiquetas visuales en las tarjetas de juegos que muestren:
- Edad mínima (ej: "+12")
- Jugadores máximos (ej: "6-12 jugadores")

### Cambios necesarios

**src/components/VRGamesCatalog.tsx**
- Añadir import de componente `Badge` de shadcn/ui
- Modificar el render de cada tarjeta para incluir dos badges debajo del título:
  - Edad mínima: `+{game.minAge}` con variante "outline" o "secondary"
  - Jugadores: `{game.maxPlayers} jugadores` con variante "outline"
- Opcional: añadir icono `Users` para jugadores y `User` para edad mínima

**src/data/vrGames.ts**
- Verificar que todos los juegos tengan definidos `minAge` y `maxPlayers` (ya deberían tenerlos según el array actual)

### Resultado esperado
Tarjetas de juegos VR con título completo, descripción y dos badges visibles: edad mínima y capacidad de jugadores.
