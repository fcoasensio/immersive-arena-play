## Ajustar edad mínima de juegos VR a 12 años

Por política, ningún juego de realidad virtual puede ofrecerse a menores de 12 años. Hay que actualizar todos los juegos del catálogo cuya `minAge` sea inferior a 12.

### Archivo a modificar

**src/data/vrGames.ts** — actualizar `minAge` a `12` en los siguientes juegos:

Battlestart (party, actualmente 5+):
- `penguins` (5 → 12)
- `dino-dance` (5 → 12)
- `vegas` (5 → 12)

Battlestart (adventure, actualmente 9+):
- `magic` (9 → 12)

VEX (shooter, actualmente 10+):
- `vex-superhero` (10 → 12)
- `vex-pixel-hack` (10 → 12)

VEX (adventure, actualmente 10+ y 8+):
- `vex-dragonfall` (10 → 12)
- `vex-kraken-island` (10 → 12)
- `vex-temple-quest` (10 → 12)
- `vex-lunar-scape` (10 → 12)
- `vex-space-academy` (8 → 12)
- `vex-school-of-magic` (8 → 12)
- `vex-alice-in-wonderland` (8 → 12)

VEX (party, actualmente 6+):
- `vex-party-playland` (6 → 12)
- `vex-kitchen-panic` (6 → 12)
- `vex-bblock` (6 → 12)
- `vex-greenium` (6 → 12)

VEX (escape, actualmente 10+):
- `vex-parvus-box` (10 → 12)

### Resultado
Todos los juegos VR mostrarán el badge `+12` como mínimo, alineado con la política de edad mínima de la actividad VR (12+) ya establecida en el sistema de reservas.

### Nota
No se requieren cambios en validaciones de reserva ni en otros componentes: el filtro de edad mínima de la actividad VR (12+) ya bloquea reservas para menores. Este cambio sólo refleja correctamente la edad mínima por juego en el catálogo público.