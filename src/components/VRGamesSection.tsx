import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Crosshair, Ghost, Swords, Users, DoorOpen } from 'lucide-react';
import { Badge } from './ui/badge';

type GameCategory = 'all' | 'party' | 'shooter' | 'escape' | 'adventure';

interface Game {
  title: string;
  category: GameCategory;
  minAge: number;
  maxPlayers: number;
  description: string;
  emoji: string;
}

const games: Game[] = [
  // === SHOOTERS ===
  {
    title: 'Tactical Ops',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: '¡La batalla más dura y realista! Solo tendrás un intento para idear una estrategia y ganar antes de ser eliminado.',
    emoji: '🎯',
  },
  {
    title: 'Arms Race',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: 'Ambos equipos empiezan con las mismas armas, pero cada eliminación desbloquea más opciones. ¡Lucha para ganar esta carrera!',
    emoji: '🔫',
  },
  {
    title: 'Bomb Defuse',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: 'Atacantes deben plantar una bomba; defensores deben eliminarlos o desactivarla. Shooter táctico puro.',
    emoji: '💣',
  },
  {
    title: 'Zombie Horde',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: '¡Une fuerzas para combatir monstruos aterradores y jefes gigantes! Oleadas de ataques con armas únicas. Horror escalofriante.',
    emoji: '🧟',
  },
  {
    title: 'Death Squad',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: 'Forma tu escuadrón de élite y enfréntate a oleadas de enemigos en combate cooperativo intenso. Solo los mejores sobrevivirán.',
    emoji: '💀',
  },
  {
    title: 'Cyberclash',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: 'Combate futurista en arenas cibernéticas. Domina las armas de alta tecnología y derrota al equipo rival.',
    emoji: '⚡',
  },
  {
    title: 'Cyberclash: Tournament',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: 'La versión competitiva del Cyberclash. Torneos intensos donde solo el mejor equipo se lleva la victoria.',
    emoji: '🏆',
  },
  {
    title: 'Mission Z',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: 'Misión de supervivencia contra zombis. Trabaja en equipo para completar objetivos mientras hordas de no-muertos te acechan.',
    emoji: '☣️',
  },
  {
    title: 'Mission Z II',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: 'La secuela de Mission Z con nuevos escenarios, enemigos más letales y misiones aún más desafiantes.',
    emoji: '☠️',
  },
  {
    title: 'Dark Z',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: 'Sumérgete en la oscuridad y lucha contra zombis en entornos terroríficos. La tensión al máximo en cada esquina.',
    emoji: '🌑',
  },
  {
    title: 'Rush Z',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: 'Acción frenética contra zombis a toda velocidad. No pares de moverte o serás el siguiente en caer.',
    emoji: '💨',
  },
  {
    title: 'Zombie Urban Factory',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 12,
    description: 'Explora una fábrica urbana infestada de zombis. Sobrevive al caos industrial mientras eliminas hordas de no-muertos.',
    emoji: '🏭',
  },
  {
    title: 'Cops vs Robbers',
    category: 'shooter',
    minAge: 12,
    maxPlayers: 12,
    description: 'Policías contra ladrones en un enfrentamiento épico. Elige tu bando y demuestra quién domina las calles.',
    emoji: '🚔',
  },
  // === AVENTURA ===
  {
    title: 'Asia Battle',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Shooter heroico PVP en un vibrante paisaje asiático donde las tradiciones ancestrales chocan con la guerra moderna.',
    emoji: '⛩️',
  },
  {
    title: 'Olympus Arena',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Sumérgete en la Antigüedad: estatuas de mármol, columnas doradas. ¡Elige al personaje más poderoso y demuestra tu destreza!',
    emoji: '🏛️',
  },
  {
    title: 'Neon City',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Ciudad futurista con luces de neón y rascacielos. ¡Usa superhabilidades y planea la ruta más rápida para ganar!',
    emoji: '🌃',
  },
  {
    title: 'Temple Quest',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Explora templos antiguos llenos de trampas y misterios. Resuelve enigmas y encuentra el tesoro antes que nadie.',
    emoji: '🏛️',
  },
  {
    title: 'Hunter VR',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Conviértete en un cazador en entornos salvajes inmersivos. Rastrea y enfrenta criaturas en la naturaleza virtual.',
    emoji: '🏹',
  },
  {
    title: 'DragonFall',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Aventura épica de fantasía donde deberás enfrentarte a dragones y criaturas míticas en un mundo de espada y magia.',
    emoji: '🐉',
  },
  {
    title: 'Kraken Island: Captain\'s Curse',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Navega hacia una isla maldita y enfréntate al temible Kraken. Rompe la maldición del capitán antes de que sea tarde.',
    emoji: '🦑',
  },
  {
    title: 'Kraken Island: Arena',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'La versión arena de Kraken Island. Combate PVP en la isla pirata con tesoros y trampas por todas partes.',
    emoji: '🏴‍☠️',
  },
  {
    title: 'Space Academy Adventure',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Aventura espacial donde explorarás estaciones orbitales y completarás misiones intergalácticas con tu equipo.',
    emoji: '🚀',
  },
  {
    title: 'Space Academy',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Entrena como cadete espacial en una academia futurista. Supera pruebas y demuestra que tienes lo necesario.',
    emoji: '🛸',
  },
  {
    title: 'Arctic Olympics',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Desafío de tirachinas en un paisaje ártico. Compite en los juegos olímpicos más fríos y divertidos.',
    emoji: '❄️',
  },
  {
    title: 'Kitchen Panic!',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: '¡Caos en la cocina! Trabaja en equipo para preparar pedidos a contrarreloj en una cocina descontrolada.',
    emoji: '👨‍🍳',
  },
  {
    title: 'School of Magic',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Aprende hechizos y encantamientos en una escuela de magia. Usa tus poderes para superar desafíos mágicos.',
    emoji: '🧙',
  },
  {
    title: 'Pixel Hack',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Adéntrate en un mundo pixelado retro. Hackea sistemas y supera desafíos en un universo digital único.',
    emoji: '👾',
  },
  {
    title: 'Lunarscape: Breakdown',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Misión de supervivencia en la superficie lunar. Repara tu base antes de quedarte sin oxígeno.',
    emoji: '🌙',
  },
  {
    title: 'Alice in Wonderland',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Sumérgete en el País de las Maravillas. Vive una aventura surrealista llena de personajes fantásticos y acertijos.',
    emoji: '🐇',
  },
  {
    title: 'Greenium',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Aventura ecológica donde deberás salvar el planeta resolviendo puzzles medioambientales en equipo.',
    emoji: '🌿',
  },
  {
    title: 'Parvus Box',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Encógete y explora un mundo en miniatura lleno de sorpresas. Todo es gigante cuando eres diminuto.',
    emoji: '📦',
  },
  {
    title: 'The Smurfs: Blueberry Battle',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Únete a los Pitufos en una divertida batalla de arándanos. ¡Cubre a tus rivales de azul y gana la competición!',
    emoji: '🫐',
  },
  {
    title: 'Party Playland',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'Zona de juegos virtual con minijuegos variados para competir y divertirse en grupo.',
    emoji: '🎉',
  },
  {
    title: 'Party Playland Adventure',
    category: 'adventure',
    minAge: 12,
    maxPlayers: 12,
    description: 'La versión aventura del Party Playland con misiones cooperativas y desafíos por todo el parque virtual.',
    emoji: '🎊',
  },
  // === ESCAPE ROOM ===
  {
    title: 'Horror',
    category: 'escape',
    minAge: 16,
    maxPlayers: 12,
    description: 'Explora un parque de atracciones abandonado. Trabaja en equipo para resolver acertijos y escapar del espeluznante cautiverio.',
    emoji: '🎪',
  },
  {
    title: 'B-Block Breakout',
    category: 'escape',
    minAge: 14,
    maxPlayers: 12,
    description: 'Escapa de una prisión de máxima seguridad resolviendo puzzles y superando desafíos en equipo. ¡El tiempo corre en tu contra!',
    emoji: '🔓',
  },
  {
    title: 'SuperHero',
    category: 'escape',
    minAge: 12,
    maxPlayers: 12,
    description: 'Escape room de superhéroes. Usa tus superpoderes para resolver puzzles y salvar el mundo antes de que sea tarde.',
    emoji: '🦸',
  },
  {
    title: 'Mansion of Death',
    category: 'escape',
    minAge: 16,
    maxPlayers: 12,
    description: 'Explora una mansión tenebrosa llena de secretos mortales. Resuelve los misterios y escapa antes de convertirte en su próxima víctima.',
    emoji: '🏚️',
  },
  {
    title: 'Insanity: The Haunting',
    category: 'escape',
    minAge: 16,
    maxPlayers: 12,
    description: 'Terror psicológico inmersivo. Enfrenta tus peores miedos mientras intentas escapar de un lugar maldito.',
    emoji: '👻',
  },
];

const categories: { id: GameCategory; label: string; icon: typeof Gamepad2 }[] = [
  { id: 'all', label: 'Todos', icon: Gamepad2 },
  { id: 'shooter', label: 'Shooters', icon: Crosshair },
  { id: 'adventure', label: 'Aventura', icon: Swords },
  { id: 'escape', label: 'Escape Room', icon: DoorOpen },
];

const categoryColors: Record<GameCategory, string> = {
  all: 'neon-blue',
  party: 'neon-green',
  shooter: 'neon-red',
  adventure: 'neon-blue',
  escape: 'neon-purple',
};

const VRGamesSection = () => {
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');

  const filtered = activeCategory === 'all' ? games : games.filter(g => g.category === activeCategory);

  return (
    <section id="vr-games" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block font-body text-sm uppercase tracking-widest text-neon-purple mb-4">
            +124 escenarios disponibles
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            CATÁLOGO DE <span className="text-neon-purple text-glow-purple">JUEGOS VR</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Juegos de realidad virtual de libre movimiento a partir de 12 años. 
            Shooters tácticos, aventuras de acción y escape rooms inmersivos.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm uppercase tracking-wider border transition-all duration-300 ${
                activeCategory === cat.id
                  ? `bg-${categoryColors[cat.id]}/20 border-${categoryColors[cat.id]}/50 text-${categoryColors[cat.id]}`
                  : 'bg-card/50 border-border text-muted-foreground hover:border-muted-foreground/50'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-8 mb-12"
        >
          <div className="text-center">
            <span className="font-display text-2xl font-bold text-neon-purple">74h+</span>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Contenido original</p>
          </div>
          <div className="text-center">
            <span className="font-display text-2xl font-bold text-neon-blue">12</span>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Jugadores simultáneos</p>
          </div>
          <div className="text-center">
            <span className="font-display text-2xl font-bold text-neon-green">12+</span>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Edad mínima</p>
          </div>
        </motion.div>

        {/* Games Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((game) => {
              const color = categoryColors[game.category];
              return (
                <motion.div
                  key={game.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`group h-full rounded-xl bg-card border border-border hover:border-${color}/40 p-6 transition-all duration-300 hover:bg-card/80`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{game.emoji}</span>
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-neon-blue transition-colors">
                            {game.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`text-${color} border-${color}/30 text-[10px] px-2 py-0`}>
                              {game.category === 'party' ? 'Party' : game.category === 'shooter' ? 'Shooter' : game.category === 'escape' ? 'Escape Room' : 'Aventura'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                      {game.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs font-body text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        1-{game.maxPlayers}
                      </span>
                      <span>{game.minAge}+ años</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default VRGamesSection;
