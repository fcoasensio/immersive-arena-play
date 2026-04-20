// Battlestart imagery
import imgAgents from '@/assets/vr-games/agents.png';
import imgBattle from '@/assets/vr-games/battle.png';
import imgHorrorQuest from '@/assets/vr-games/horror-quest.png';
import imgMagic from '@/assets/vr-games/magic.png';
import imgParty1 from '@/assets/vr-games/party-1.png';
import imgParty2 from '@/assets/vr-games/party-2.png';
import imgTactics from '@/assets/vr-games/tactics.png';
import imgVegas from '@/assets/vr-games/vegas.png';
import imgZombies from '@/assets/vr-games/zombies.png';

// VEX imagery
import imgVexAlice from '@/assets/vr-games/vex-alice-in-wonderland.png';
import imgVexBblock from '@/assets/vr-games/vex-bblock.jpg';
import imgVexCopsRobbers from '@/assets/vr-games/vex-cops-vs-robbers.png';
import imgVexCyberclash from '@/assets/vr-games/vex-cyberclash.jpg';
import imgVexDarkZ from '@/assets/vr-games/vex-dark-z.jpg';
import imgVexDeathSquad from '@/assets/vr-games/vex-death-squad.jpg';
import imgVexDragonfall from '@/assets/vr-games/vex-dragonfall.jpg';
import imgVexGreenium from '@/assets/vr-games/vex-greenium.jpg';
import imgVexKitchenPanic from '@/assets/vr-games/vex-kitchen-panic.jpg';
import imgVexKrakenIsland from '@/assets/vr-games/vex-kraken-island.jpg';
import imgVexLunarScape from '@/assets/vr-games/vex-lunar-scape.jpg';
import imgVexMansionOfDeath from '@/assets/vr-games/vex-mansion-of-death.png';
import imgVexMissionZ from '@/assets/vr-games/vex-mission-z.jpg';
import imgVexMissionZ2 from '@/assets/vr-games/vex-mission-z-2.jpg';
import imgVexPartyPlayland from '@/assets/vr-games/vex-party-playland.jpg';
import imgVexParvusBox from '@/assets/vr-games/vex-parvus-box.jpg';
import imgVexPixelHack from '@/assets/vr-games/vex-pixel-hack.jpg';
import imgVexSchoolOfMagic from '@/assets/vr-games/vex-school-of-magic.png';
import imgVexSpaceAcademy from '@/assets/vr-games/vex-space-academy.jpg';
import imgVexSuperhero from '@/assets/vr-games/vex-superhero.png';
import imgVexTempleQuest from '@/assets/vr-games/vex-temple-quest.jpg';
import imgVexTheHaunting from '@/assets/vr-games/vex-the-haunting.jpg';
import imgVexZombieUrban from '@/assets/vr-games/vex-zombie-urban.png';

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
  { slug: 'battle', name: 'Battle', provider: 'battlestart', category: 'shooter', minAge: 14, maxPlayers: 16, description: 'Batalla realista con una sola vida. Estrategia y precisión bajo presión.', image: imgBattle },
  { slug: 'tactics', name: 'Tactics', provider: 'battlestart', category: 'shooter', minAge: 14, maxPlayers: 16, description: 'Cada eliminación desbloquea un arma nueva. Sube de nivel hasta ganar.', image: imgTactics },
  { slug: 'agents', name: 'Agents', provider: 'battlestart', category: 'shooter', minAge: 14, maxPlayers: 16, description: 'Shooter táctico por equipos con misiones especiales.', image: imgAgents },

  // Battlestart - Action Adventure (9+)
  { slug: 'magic', name: 'Magic', provider: 'battlestart', category: 'adventure', minAge: 9, maxPlayers: 16, description: 'Aventura mágica con hechizos y criaturas fantásticas.', image: imgMagic },

  // Battlestart - Horror (16+)
  { slug: 'horror-quest', name: 'Horror Quest', provider: 'battlestart', category: 'horror', minAge: 16, maxPlayers: 12, description: 'Misión de terror cooperativa. No apta para cardíacos.', image: imgHorrorQuest },

  // Battlestart - Survival (14+)
  { slug: 'zombies', name: 'Zombies', provider: 'battlestart', category: 'survival', minAge: 14, maxPlayers: 16, description: 'Sobrevive a oleadas de zombies y derrota a los jefes finales.', image: imgZombies },

  // Battlestart - Party Games (5+)
  { slug: 'penguins', name: 'Penguins', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Rescata pingüinos bebés en una aventura helada cooperativa.', image: imgParty1 },
  { slug: 'dino-dance', name: 'Dino Dance', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Baila siguiendo los pasos de Dino-boy. Risas garantizadas.', image: imgParty2 },
  { slug: 'vegas', name: 'Vegas', provider: 'battlestart', category: 'party', minAge: 5, maxPlayers: 16, description: 'Party game al estilo casino de Las Vegas. ¡La banca contra ti!', image: imgVegas },

  // ===== VEX premium experiences =====
  // Shooters / Acción
  { slug: 'vex-cyberclash', name: 'CyberClash', provider: 'vex', category: 'shooter', minAge: 12, maxPlayers: 8, description: 'Combate cyberpunk multijugador en arenas neón con armas futuristas.', image: imgVexCyberclash },
  { slug: 'vex-death-squad', name: 'Death Squad', provider: 'vex', category: 'shooter', minAge: 14, maxPlayers: 8, description: 'Escuadrón de élite contra hordas enemigas. Coordinación pura.', image: imgVexDeathSquad },
  { slug: 'vex-cops-vs-robbers', name: 'Cops vs Robbers', provider: 'vex', category: 'shooter', minAge: 12, maxPlayers: 8, description: 'Polis contra ladrones en una persecución urbana frenética.', image: imgVexCopsRobbers },
  { slug: 'vex-superhero', name: 'Superhero', provider: 'vex', category: 'shooter', minAge: 10, maxPlayers: 8, description: 'Conviértete en superhéroe con superpoderes y vuelo libre.', image: imgVexSuperhero },
  { slug: 'vex-pixel-hack', name: 'Pixel Hack', provider: 'vex', category: 'shooter', minAge: 10, maxPlayers: 8, description: 'Shooter arcade con estética pixel-art retro-futurista.', image: imgVexPixelHack },

  // Aventura
  { slug: 'vex-dragonfall', name: 'Dragonfall', provider: 'vex', category: 'adventure', minAge: 10, maxPlayers: 8, description: 'Caza dragones en un reino de fantasía épica.', image: imgVexDragonfall },
  { slug: 'vex-kraken-island', name: 'Kraken Island', provider: 'vex', category: 'adventure', minAge: 10, maxPlayers: 8, description: 'Aventura pirata: enfréntate al kraken para hacerte con el tesoro.', image: imgVexKrakenIsland },
  { slug: 'vex-temple-quest', name: 'Temple Quest', provider: 'vex', category: 'adventure', minAge: 10, maxPlayers: 8, description: 'Explora un templo ancestral lleno de trampas y reliquias.', image: imgVexTempleQuest },
  { slug: 'vex-lunar-scape', name: 'Lunar Scape', provider: 'vex', category: 'adventure', minAge: 10, maxPlayers: 8, description: 'Misión lunar con gravedad cero y paisajes alienígenas.', image: imgVexLunarScape },
  { slug: 'vex-space-academy', name: 'Space Academy', provider: 'vex', category: 'adventure', minAge: 8, maxPlayers: 8, description: 'Academia espacial: pilota naves y supera pruebas galácticas.', image: imgVexSpaceAcademy },
  { slug: 'vex-school-of-magic', name: 'School of Magic', provider: 'vex', category: 'adventure', minAge: 8, maxPlayers: 8, description: 'Aprende hechizos en una escuela de magia tipo Hogwarts.', image: imgVexSchoolOfMagic },
  { slug: 'vex-alice-in-wonderland', name: 'Alice in Wonderland', provider: 'vex', category: 'adventure', minAge: 8, maxPlayers: 8, description: 'Sumérgete en el País de las Maravillas con personajes icónicos.', image: imgVexAlice },

  // Terror
  { slug: 'vex-mansion-of-death', name: 'Mansion of Death', provider: 'vex', category: 'horror', minAge: 16, maxPlayers: 8, description: 'Mansión embrujada con sustos cooperativos. Para los más valientes.', image: imgVexMansionOfDeath },
  { slug: 'vex-the-haunting', name: 'The Haunting', provider: 'vex', category: 'horror', minAge: 16, maxPlayers: 8, description: 'Investigación paranormal en una casa con presencias hostiles.', image: imgVexTheHaunting },
  { slug: 'vex-dark-z', name: 'Dark Z', provider: 'vex', category: 'horror', minAge: 16, maxPlayers: 8, description: 'Thriller oscuro: sobrevive en un complejo abandonado infestado.', image: imgVexDarkZ },

  // Supervivencia
  { slug: 'vex-mission-z', name: 'Mission Z', provider: 'vex', category: 'survival', minAge: 14, maxPlayers: 8, description: 'Operación militar contra el apocalipsis zombie.', image: imgVexMissionZ },
  { slug: 'vex-mission-z-2', name: 'Mission Z 2', provider: 'vex', category: 'survival', minAge: 14, maxPlayers: 8, description: 'Continuación de Mission Z con nuevos escenarios y jefes finales.', image: imgVexMissionZ2 },
  { slug: 'vex-zombie-urban', name: 'Zombie Urban', provider: 'vex', category: 'survival', minAge: 14, maxPlayers: 8, description: 'Sobrevive a una ciudad tomada por los muertos vivientes.', image: imgVexZombieUrban },

  // Party / Familia
  { slug: 'vex-party-playland', name: 'Party Playland', provider: 'vex', category: 'party', minAge: 6, maxPlayers: 8, description: 'Recopilación de minijuegos festivos perfectos para grupos.', image: imgVexPartyPlayland },
  { slug: 'vex-kitchen-panic', name: 'Kitchen Panic', provider: 'vex', category: 'party', minAge: 6, maxPlayers: 8, description: 'Cocina cooperativa caótica al estilo Overcooked en VR.', image: imgVexKitchenPanic },
  { slug: 'vex-bblock', name: 'B-Block', provider: 'vex', category: 'party', minAge: 6, maxPlayers: 8, description: 'Construye y compite con bloques en un party game creativo.', image: imgVexBblock },
  { slug: 'vex-greenium', name: 'Greenium', provider: 'vex', category: 'party', minAge: 6, maxPlayers: 8, description: 'Aventura ecológica con minijuegos en escenarios naturales.', image: imgVexGreenium },

  // Escape Room
  { slug: 'vex-parvus-box', name: 'Parvus Box', provider: 'vex', category: 'escape', minAge: 10, maxPlayers: 6, description: 'Escape room cooperativo con enigmas dentro de una caja misteriosa.', image: imgVexParvusBox },
];
