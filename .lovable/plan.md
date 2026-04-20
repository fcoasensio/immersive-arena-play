

## Plan: Lista de juegos VR con miniaturas en la landing

### Objetivo
Añadir una sección nueva en `/realidad-virtual-murcia` con la lista real de juegos de los proveedores **Battlestart** y **VEX Solutions**, con miniaturas oficiales (que tú me pasarás) y filtrado/agrupación por categoría.

### Lista de juegos a incluir (extraída de las webs de los proveedores)

**Battlestart** (124 escenarios, 1-16 jugadores, agrupados por tipo):

*Tactical Shooter (14+)*
1. Battle — batalla realista, una sola vida
2. Tactics — eliminaciones desbloquean armas
3. Bomb Defuse — atacantes vs defensores
4. Agents — shooter táctico

*Action Adventure (9+)*
5. Asia Battle — shooter PVP estética asiática
6. Greek Arena — combate en la Antigüedad
7. Neon City — ciudad futurista con superpoderes
8. Mega City — batallas urbanas en azoteas
9. Magic — aventura mágica

*Horror (16+)*
10. Doll Park — parque abandonado y muñeca siniestra
11. Horror Quest

*Survival (14+)*
12. Zombies — oleadas de monstruos y jefes

*Party Games (5+)*
13. Penguins — rescatar pingüinos bebés
14. Dino Dance — baile con Dino-boy
15. Fireflies — atrapar luciérnagas
16. Fishing — pesca cooperativa
17. Sharks Rescue — salvavidas vs tiburones
18. Cannon Battle — batalla naval
19. Paint War — pintar territorio
20. Safari Photo — fotografía de animales
21. Maze Torches — laberinto con antorchas
22. Pumpkin Farm — cultivo y aplastar plantaciones
23. Treasure Hunt — castillo medieval con oro
24. Diamond Diggers — excavar diamantes
25. Apple Shooter — tiro al blanco
26. Cowboy Hats — Lejano Oeste
27. Snowball War — guerra de bolas de nieve navideña
28. Lumberjack — talar árboles
29. Dino Pizza — alimentar dinosaurios
30. Jet Boxing — entrenamiento con sacos
31. Family Quest — misión cooperativa familiar
32. Vegas — party game tipo casino

**VEX Solutions** (experiencias inmersivas premium):
33. VEX Adventure — aventura cooperativa narrativa con efectos 4D
34. VEX Arena — shooter competitivo multijugador (hasta 8)
35. VEX PartyDash — minijuegos tipo "fiesta" para grupos
36. VEX Escape Box — sala de escape VR

### Cambios técnicos

1. **Carpeta de assets**: crear `src/assets/games/` con subcarpetas `battlestart/` y `vex/` donde colocaré las miniaturas que me pases (formato esperado: JPG/PNG, slug del juego como nombre, ej. `battle.jpg`, `penguins.jpg`, `vex-adventure.jpg`).

2. **Nuevo dato**: crear `src/data/vrGames.ts` con un array tipado:
   ```ts
   { slug, name, provider: 'battlestart' | 'vex', category, minAge, maxPlayers, description, image }
   ```

3. **Nuevo componente**: `src/components/VRGamesCatalog.tsx`
   - Tabs para filtrar por categoría (Todos / Shooter / Aventura / Party / Horror / Escape & Adventure VEX)
   - Grid responsivo (2 col móvil, 3 tablet, 4 desktop) de tarjetas con: miniatura, nombre, badge categoría, badge edad, badge "1-16 jugadores", descripción corta
   - Estética cyberpunk (borde neón, hover glow azul) coherente con el resto

4. **Integrar en la landing**: insertar `<VRGamesCatalog />` en `src/pages/RealidadVirtualMurcia.tsx`, justo después de la sección "Catálogo de Experiencias VR" (donde están las 3 categorías actuales), añadiendo un encabezado "Más de 35 juegos VR para elegir".

5. **Imágenes pendientes**: como me pasarás tú las miniaturas oficiales, en una primera entrega usaré un placeholder neutro (icono + gradiente neón por categoría) para todas las tarjetas. Cuando subas las imágenes a chat las copiaré a `src/assets/games/` con el slug correcto y se mostrarán automáticamente.

### Flujo de trabajo sugerido
- **Paso 1 (esta tanda)**: implementar estructura, datos y componente con placeholders.
- **Paso 2 (cuando subas las imágenes)**: te pediré las miniaturas en uno o dos batches (Battlestart por categorías + VEX), las integraré sustituyendo placeholders.

### Notas
- No se referenciarán los nombres de los proveedores en la UI pública (son tus suministradores, no marca cara al cliente). Internamente sí se mantienen para organizar assets.
- La sección será 100% estática (sin DB), ideal para SEO.

