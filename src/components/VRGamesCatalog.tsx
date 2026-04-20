import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Compass, Ghost, Skull, PartyPopper, KeyRound, Sparkles } from 'lucide-react';
import { vrGames, categoryLabels, type GameCategory, type VRGame } from '@/data/vrGames';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const categoryIcon: Record<GameCategory, typeof Crosshair> = {
  shooter: Crosshair,
  adventure: Compass,
  horror: Ghost,
  survival: Skull,
  party: PartyPopper,
  escape: KeyRound,
  premium: Sparkles,
};

const categoryGradient: Record<GameCategory, string> = {
  shooter: 'from-neon-blue/30 via-background to-background',
  adventure: 'from-neon-purple/30 via-background to-background',
  horror: 'from-accent/30 via-background to-background',
  survival: 'from-accent/40 via-background to-background',
  party: 'from-neon-pink/30 via-background to-background',
  escape: 'from-neon-green/30 via-background to-background',
  premium: 'from-neon-blue/40 via-neon-purple/20 to-background',
};

type FilterValue = 'all' | GameCategory;

const filterTabs: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'shooter', label: 'Shooter' },
  { value: 'adventure', label: 'Aventura' },
  { value: 'party', label: 'Party' },
  { value: 'horror', label: 'Terror' },
  { value: 'survival', label: 'Supervivencia' },
  { value: 'escape', label: 'Escape' },
  { value: 'premium', label: 'Premium' },
];

const GameCard = ({ game, index }: { game: VRGame; index: number }) => {
  const Icon = categoryIcon[game.category];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      className="group relative rounded-xl border border-border bg-card/50 overflow-hidden hover:border-neon-blue/60 hover:shadow-[0_0_25px_hsl(var(--neon-blue)/0.25)] transition-all duration-300"
    >
      {/* Thumbnail / placeholder */}
      <div className={cn('relative aspect-video w-full overflow-hidden bg-gradient-to-br', categoryGradient[game.category])}>
        {game.image ? (
          <img
            src={game.image}
            alt={`${game.name} — juego de realidad virtual`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-12 h-12 text-neon-blue/70 group-hover:text-neon-blue transition-colors" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-background/80 backdrop-blur border-neon-blue/40 text-neon-blue text-[10px]">
            {categoryLabels[game.category]}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-display text-sm font-bold text-foreground mb-2 line-clamp-1">{game.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">{game.description}</p>
      </div>
    </motion.div>
  );
};

const VRGamesCatalog = () => {
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? vrGames : vrGames.filter((g) => g.category === filter)),
    [filter]
  );

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
          Más de <span className="text-neon-blue">35 juegos VR</span> para elegir
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Catálogo completo de experiencias Free Roaming: desde party games para los más pequeños hasta shooters tácticos y experiencias de terror para adultos.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {filterTabs.map((tab) => {
          const active = filter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-body uppercase tracking-wider border transition-all',
                active
                  ? 'bg-neon-blue text-background border-neon-blue shadow-[0_0_15px_hsl(var(--neon-blue)/0.5)]'
                  : 'bg-card/50 text-muted-foreground border-border hover:border-neon-blue/50 hover:text-neon-blue'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((game, i) => (
          <GameCard key={game.slug} game={game} index={i} />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6 italic">
        * Catálogo en constante actualización. Algunos juegos pueden requerir reserva previa según el grupo.
      </p>
    </div>
  );
};

export default VRGamesCatalog;
