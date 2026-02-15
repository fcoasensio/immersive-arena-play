import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Crosshair, Ghost, Swords, Users, Baby, DoorOpen } from 'lucide-react';
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
  {
    title: 'Penguin Rescue',
    category: 'party',
    minAge: 5,
    maxPlayers: 16,
    description: 'Rescata a adorables pingüinos bebés y ayúdalos a encontrar su camino a casa. ¡Actúa con rapidez y amabilidad!',
    emoji: '🐧',
  },
  {
    title: 'Shark Lifeguard',
    category: 'party',
    minAge: 5,
    maxPlayers: 16,
    description: '¡Conviértete en un verdadero salvavidas! Rescata a personas de los dentudos tiburones blancos.',
    emoji: '🦈',
  },
  {
    title: 'Paint Battle',
    category: 'party',
    minAge: 5,
    maxPlayers: 16,
    description: '¡Cubre el suelo con el color de tu equipo! Usa paraguas como escudo y contraataca pintando las zonas enemigas.',
    emoji: '🎨',
  },
  {
    title: 'Dino Dance',
    category: 'party',
    minAge: 5,
    maxPlayers: 16,
    description: '¡Muestra tus mejores movimientos! Repite los pasos de baile de Dino-boy para ganar la competición.',
    emoji: '🦕',
  },
  {
    title: 'Wild Safari',
    category: 'party',
    minAge: 5,
    maxPlayers: 16,
    description: 'Explora animales asombrosos y toma las mejores fotos para convertirte en el mejor fotógrafo del safari.',
    emoji: '📷',
  },
  {
    title: 'Snowball Fight',
    category: 'party',
    minAge: 5,
    maxPlayers: 16,
    description: '¡Sumérgete en la atmósfera invernal mágica! ¿Qué puede ser mejor que una guerra de bolas de nieve con amigos?',
    emoji: '❄️',
  },
  {
    title: 'Tactical Ops',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 16,
    description: '¡La batalla más dura y realista! Solo tendrás un intento para idear una estrategia y ganar antes de ser eliminado.',
    emoji: '🎯',
  },
  {
    title: 'Arms Race',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 16,
    description: 'Ambos equipos empiezan con las mismas armas, pero cada eliminación desbloquea más opciones. ¡Lucha para ganar esta carrera!',
    emoji: '🔫',
  },
  {
    title: 'Bomb Defuse',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 16,
    description: 'Atacantes deben plantar una bomba; defensores deben eliminarlos o desactivarla. Shooter táctico puro.',
    emoji: '💣',
  },
  {
    title: 'Asia Battle',
    category: 'adventure',
    minAge: 9,
    maxPlayers: 16,
    description: 'Shooter heroico PVP en un vibrante paisaje asiático donde las tradiciones ancestrales chocan con la guerra moderna.',
    emoji: '⛩️',
  },
  {
    title: 'Olympus Arena',
    category: 'adventure',
    minAge: 9,
    maxPlayers: 16,
    description: 'Sumérgete en la Antigüedad: estatuas de mármol, columnas doradas. ¡Elige al personaje más poderoso y demuestra tu destreza!',
    emoji: '🏛️',
  },
  {
    title: 'Neon City',
    category: 'adventure',
    minAge: 9,
    maxPlayers: 16,
    description: 'Ciudad futurista con luces de neón y rascacielos. ¡Usa superhabilidades y planea la ruta más rápida para ganar!',
    emoji: '🌃',
  },
  {
    title: 'Haunted Park',
    category: 'escape',
    minAge: 16,
    maxPlayers: 16,
    description: 'Explora un parque de atracciones abandonado. Trabaja en equipo para resolver acertijos y escapar del espeluznante cautiverio.',
    emoji: '🎪',
  },
  {
    title: 'B-Block Breakout',
    category: 'escape',
    minAge: 14,
    maxPlayers: 16,
    description: 'Escapa de una prisión de máxima seguridad resolviendo puzzles y superando desafíos en equipo. ¡El tiempo corre en tu contra!',
    emoji: '🔓',
  },
  {
    title: 'Zombie Horde',
    category: 'shooter',
    minAge: 14,
    maxPlayers: 16,
    description: '¡Une fuerzas para combatir monstruos aterradores y jefes gigantes! Oleadas de ataques con armas únicas. Horror escalofriante.',
    emoji: '🧟',
  },
];

const categories: { id: GameCategory; label: string; icon: typeof Gamepad2 }[] = [
  { id: 'all', label: 'Todos', icon: Gamepad2 },
  { id: 'party', label: 'Party Games', icon: Baby },
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
            Juegos de realidad virtual de libre movimiento para todas las edades. 
            Desde party games familiares hasta shooters tácticos intensos.
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
            <span className="font-display text-2xl font-bold text-neon-blue">16</span>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Jugadores simultáneos</p>
          </div>
          <div className="text-center">
            <span className="font-display text-2xl font-bold text-neon-green">5+</span>
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
