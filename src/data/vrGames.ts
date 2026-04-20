export type GameCategory =
  | 'shooter'
  | 'adventure'
  | 'horror'
  | 'survival'
  | 'party'
  | 'escape'
  | 'premium';

export type GameProvider = 'battlestart' | 'vex';

export interface VRGame {
  slug: string;
  name: string;
  provider: GameProvider;
  category: GameCategory;
  minAge: number;
  maxPlayers: number;
  description: string;
  image?: string; // optional: when not present, placeholder is shown
}

export const categoryLabels: Record<GameCategory, string> = {
  shooter: 'Shooter Táctico',
  adventure: 'Aventura',
  horror: 'Terror',
  survival: 'Supervivencia',
  party: 'Party Games',
  escape: 'Escape Room',
  premium: 'Experiencia Premium',
};

export const vrGames: VRGame[] = [
  // Battlestart - Tactical Shooter (14+)
  { slug: 'battle', name: 'Battle', provider: 'battlestart', category: 'shooter', minAge: 14, maxPlayers: 16, description: 'Batalla realista con una sola vida. Estrategia y precisión bajo presión.' },
  { slug: 'tactics', name: 'Tactics', provider: 'battlestart', category: 'shooter', minAge: 14, maxPlayers: 16, description: 'Cada eliminación desbloquea un arma nueva. Sube de nivel hasta ganar.' },
  { slug: 'bomb-defuse', name: 'Bomb Defuse', provider: 'battlestart', category: 'shooter', minAge: 14, maxPlayers: 16, description: 'Atacantes vs defensores. Plantar o desactivar la bomba antes del tiempo.' },
  { slug: 'agents', name: 'Agents', provider: 'battlestart', category: 'shooter', minAge: 14, maxPlayers: 16, description: 'Shooter táctico por equipos con misiones especiales.' },

  // Battlestart - Action Adventure (9+)
  { slug: 'asia-battle', name: 'Asia Battle', provider: 'battlestart', category: 'adventure', minAge: 9, maxPlayers: 16, description: 'Shooter PVP con estética asiática y escenarios espectaculares.' },
  { slug: 'greek-arena', name: 'Greek Arena', provider: 'battlestart', category: 'adventure', minAge: 9, maxPlayers: 16, description: 'Combate de gladiadores en la Antigua Grecia.' },
  { slug: 'neon-city', name: 'Neon City', provider: 'battlestart', category: 'adventure', minAge: 9, maxPlayers: 16, description: 'Ciudad futurista cyberpunk con superpoderes y combate aéreo.' },
  { slug: 'mega-city', name: 'Mega City', provider: 'battlestart', category: 'adventure', minAge: 9, maxPlayers: 16, description: 'Batallas urbanas en azoteas de rascacielos.' },
  { slug: 'magic', name: 'Magic', provider: 'battlestart', category: 'adventure', minAge: 9, maxPlayers: 16, description: 'Aventura mágica con hechizos y criaturas fantásticas.' },

  // Battlestart - Horror (16+)
  { slug: 'doll-park', name: 'Doll Park', provider: 'battlestart', category: 'horror', minAge: 16, maxPlayers: 12, description: 'Parque de atracciones abandonado y una muñeca siniestra que te acecha.' },
  { slug: 'horror-quest', name: 'Horror Quest', provider: 'battlestart', category: 'horror', minAge: 16, maxPlayers: 12, description: 'Misión de terror cooperativa. No apta para cardíacos.' },

  // Battlestart - Survival (14+)
  { slug: 'zombies', name: 'Zombies', provider: 'battlestart', category: 'survival', minAge: 14, maxPlayers: 16, description: 'Sobrevive a oleadas de zombies y derrota a los jefes finales.' },

  // Battlestart - Party Games (5+)
  { slug: 'penguins', name: 'Penguins', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Rescata pingüinos bebés en una aventura helada cooperativa.' },
  { slug: 'dino-dance', name: 'Dino Dance', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Baila siguiendo los pasos de Dino-boy. Risas garantizadas.' },
  { slug: 'fireflies', name: 'Fireflies', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Atrapa luciérnagas en un bosque mágico nocturno.' },
  { slug: 'fishing', name: 'Fishing', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Pesca cooperativa: ¿quién consigue el pez más grande?' },
  { slug: 'sharks-rescue', name: 'Sharks Rescue', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Salvavidas vs tiburones. Rescata a los bañistas a tiempo.' },
  { slug: 'cannon-battle', name: 'Cannon Battle', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Batalla naval con cañones. Hunde la flota enemiga.' },
  { slug: 'paint-war', name: 'Paint War', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Pinta más territorio que tus rivales en esta guerra colorida.' },
  { slug: 'safari-photo', name: 'Safari Photo', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Safari fotográfico: captura los mejores animales con tu cámara VR.' },
  { slug: 'maze-torches', name: 'Maze Torches', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Encuentra la salida del laberinto iluminándote con antorchas.' },
  { slug: 'pumpkin-farm', name: 'Pumpkin Farm', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Cultiva calabazas y aplasta las plantaciones rivales.' },
  { slug: 'treasure-hunt', name: 'Treasure Hunt', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Caza del tesoro en un castillo medieval lleno de oro.' },
  { slug: 'diamond-diggers', name: 'Diamond Diggers', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Excava diamantes en una mina y consigue la mayor fortuna.' },
  { slug: 'apple-shooter', name: 'Apple Shooter', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Tiro al blanco con manzanas. Pulso firme y buena puntería.' },
  { slug: 'cowboy-hats', name: 'Cowboy Hats', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Duelo en el Lejano Oeste. El sombrero más rápido gana.' },
  { slug: 'snowball-war', name: 'Snowball War', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Guerra de bolas de nieve en un escenario navideño.' },
  { slug: 'lumberjack', name: 'Lumberjack', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Tala árboles a contrarreloj como un auténtico leñador.' },
  { slug: 'dino-pizza', name: 'Dino Pizza', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Alimenta dinosaurios hambrientos con pizzas voladoras.' },
  { slug: 'jet-boxing', name: 'Jet Boxing', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Entrenamiento de boxeo VR con sacos y combos rítmicos.' },
  { slug: 'family-quest', name: 'Family Quest', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Misión cooperativa familiar para todas las edades.' },
  { slug: 'vegas', name: 'Vegas', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Party game al estilo casino de Las Vegas. ¡La banca contra ti!' },

  // Premium experiences
  { slug: 'vex-adventure', name: 'Adventure 4D', provider: 'vex', category: 'premium', minAge: 12, maxPlayers: 8, description: 'Aventura cooperativa narrativa con efectos 4D (viento, vibración, calor).' },
  { slug: 'vex-arena', name: 'Arena Pro', provider: 'vex', category: 'shooter', minAge: 12, maxPlayers: 8, description: 'Shooter competitivo multijugador en arenas inmersivas premium.' },
  { slug: 'vex-partydash', name: 'Party Dash', provider: 'vex', category: 'party', minAge: 8, maxPlayers: 8, description: 'Minijuegos tipo "fiesta" perfectos para grupos y celebraciones.' },
  { slug: 'vex-escape-box', name: 'Escape Box', provider: 'vex', category: 'escape', minAge: 12, maxPlayers: 6, description: 'Sala de escape VR cooperativa: enigmas imposibles en la vida real.' },
];
