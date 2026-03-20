import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Flag, Skull, Shield, MapPin, Users, Biohazard, Ghost } from 'lucide-react';
import { Badge } from './ui/badge';

type GameMode = 'all' | 'team' | 'solo';

interface LaserGame {
  title: string;
  mode: GameMode;
  emoji: string;
  icon: typeof Target;
  description: string;
  players: string;
  duration: string;
}

const games: LaserGame[] = [
  {
    title: 'Captura la Bandera',
    mode: 'team',
    emoji: '🚩',
    icon: Flag,
    description: 'Dos equipos compiten por capturar la bandera del equipo contrario y llevarla a su base. Protege tu bandera mientras atacas al enemigo. ¡Estrategia y trabajo en equipo son la clave!',
    players: '4-16',
    duration: '15 min',
  },
  {
    title: 'Deathmatch',
    mode: 'team',
    emoji: '💀',
    icon: Skull,
    description: 'Batalla total entre dos equipos. Cada eliminación suma puntos para tu equipo. El equipo con más eliminaciones al final del tiempo gana. ¡Acción sin parar de principio a fin!',
    players: '4-24',
    duration: '15 min',
  },
  {
    title: 'Último Héroe',
    mode: 'solo',
    emoji: '🦸',
    icon: Shield,
    description: 'Todos contra todos. Cada jugador tiene un número limitado de vidas. El último jugador en pie se corona como el héroe definitivo. ¡Supervivencia en estado puro!',
    players: '4-24',
    duration: '15 min',
  },
  {
    title: 'Dominación',
    mode: 'team',
    emoji: '📍',
    icon: MapPin,
    description: 'Controla puntos estratégicos del mapa para sumar puntos. Los equipos luchan por mantener el dominio de las zonas clave. ¡Coordinación y posicionamiento táctico son esenciales!',
    players: '6-24',
    duration: '15 min',
  },
  {
    title: 'Pandora',
    mode: 'team',
    emoji: '☢️',
    icon: Biohazard,
    description: 'Abre las cajas de seguridad y extrae las probetas radiactivas para llevarlas a tu base. Por el camino te irán restando vida. Si tu equipo consigue poner a salvo las tres probetas, ¡ganáis! Pero cuidado, el otro equipo intentará robarlas y devolverlas a su sitio.',
    players: '4-24',
    duration: '15 min',
  },
  {
    title: 'Zombies vs Vampiros',
    mode: 'team',
    emoji: '🧟',
    icon: Ghost,
    description: 'Dos bandos sobrenaturales se enfrentan. Cuando te infectan, ¡cambias de bando! La partida es una lucha constante por convertir a los rivales. Gana el equipo que más componentes tenga cuando acabe el tiempo.',
    players: '4-24',
    duration: '15 min',
  },
];

const filters: { id: GameMode; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'team', label: 'Por equipos' },
  { id: 'solo', label: 'Individual' },
];

const LaserGamesSection = () => {
  const [activeFilter, setActiveFilter] = useState<GameMode>('all');

  const filtered = activeFilter === 'all' ? games : games.filter(g => g.mode === activeFilter);

  return (
    <section id="laser-games" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-neon-red/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block font-body text-sm uppercase tracking-widest text-neon-blue mb-4">
            Modos de juego
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            MODOS DE <span className="text-neon-blue text-glow-blue">LASER TAG</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Diferentes modalidades para partidas épicas. Desde combates por equipos hasta supervivencia individual.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center gap-3 mb-12"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-5 py-2.5 rounded-full font-body text-sm uppercase tracking-wider border transition-all duration-300 ${
                activeFilter === f.id
                  ? 'bg-neon-blue/20 border-neon-blue/50 text-neon-blue'
                  : 'bg-card/50 border-border text-muted-foreground hover:border-muted-foreground/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Games Grid */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((game) => (
              <motion.div
                key={game.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="group h-full rounded-xl bg-card border border-border hover:border-neon-blue/40 p-6 transition-all duration-300 hover:bg-card/80">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-neon-blue/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <game.icon className="w-7 h-7 text-neon-blue" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground group-hover:text-neon-blue transition-colors">
                        {game.title}
                      </h3>
                      <Badge variant="outline" className={`text-[10px] px-2 py-0 mt-1 ${
                        game.mode === 'team' ? 'text-neon-blue border-neon-blue/30' : 'text-neon-red border-neon-red/30'
                      }`}>
                        {game.mode === 'team' ? 'Por equipos' : 'Individual'}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                    {game.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-5 text-xs font-body text-muted-foreground border-t border-border pt-4">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-neon-blue" />
                      {game.players} jugadores
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-neon-blue" />
                      {game.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LaserGamesSection;
