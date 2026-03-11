import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Swords, DoorOpen, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

type GameCategory = 'shooter' | 'adventure' | 'escape';

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
  { title: 'Tactical Ops', category: 'shooter', minAge: 14, maxPlayers: 12, description: '¡La batalla más dura y realista! Solo tendrás un intento para idear una estrategia y ganar antes de ser eliminado.', emoji: '🎯' },
  { title: 'Arms Race', category: 'shooter', minAge: 14, maxPlayers: 12, description: 'Ambos equipos empiezan con las mismas armas, pero cada eliminación desbloquea más opciones. ¡Lucha para ganar esta carrera!', emoji: '🔫' },
  { title: 'Bomb Defuse', category: 'shooter', minAge: 14, maxPlayers: 12, description: 'Atacantes deben plantar una bomba; defensores deben eliminarlos o desactivarla. Shooter táctico puro.', emoji: '💣' },
  { title: 'Zombie Horde', category: 'shooter', minAge: 14, maxPlayers: 12, description: '¡Une fuerzas para combatir monstruos aterradores y jefes gigantes! Oleadas de ataques con armas únicas.', emoji: '🧟' },
  { title: 'Death Squad', category: 'shooter', minAge: 14, maxPlayers: 12, description: 'Forma tu escuadrón de élite y enfréntate a oleadas de enemigos en combate cooperativo intenso.', emoji: '💀' },
  { title: 'Cyberclash', category: 'shooter', minAge: 14, maxPlayers: 12, description: 'Combate futurista en arenas cibernéticas. Domina las armas de alta tecnología y derrota al equipo rival.', emoji: '⚡' },
  { title: 'Cyberclash: Tournament', category: 'shooter', minAge: 14, maxPlayers: 12, description: 'La versión competitiva del Cyberclash. Torneos intensos donde solo el mejor equipo se lleva la victoria.', emoji: '🏆' },
  { title: 'Mission Z', category: 'shooter', minAge: 14, maxPlayers: 12, description: 'Misión de supervivencia contra zombis. Trabaja en equipo para completar objetivos mientras hordas de no-muertos te acechan.', emoji: '☣️' },
  { title: 'Mission Z II', category: 'shooter', minAge: 14, maxPlayers: 12, description: 'La secuela de Mission Z con nuevos escenarios, enemigos más letales y misiones aún más desafiantes.', emoji: '☠️' },
  { title: 'Dark Z', category: 'shooter', minAge: 14, maxPlayers: 12, description: 'Sumérgete en la oscuridad y lucha contra zombis en entornos terroríficos.', emoji: '🌑' },
  { title: 'Rush Z', category: 'shooter', minAge: 14, maxPlayers: 12, description: 'Acción frenética contra zombis a toda velocidad. No pares de moverte o serás el siguiente en caer.', emoji: '💨' },
  { title: 'Zombie Urban Factory', category: 'shooter', minAge: 14, maxPlayers: 12, description: 'Explora una fábrica urbana infestada de zombis. Sobrevive al caos industrial.', emoji: '🏭' },
  { title: 'Cops vs Robbers', category: 'shooter', minAge: 12, maxPlayers: 12, description: 'Policías contra ladrones en un enfrentamiento épico. Elige tu bando y demuestra quién domina las calles.', emoji: '🚔' },
  // === AVENTURA ===
  { title: 'Asia Battle', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Shooter heroico PVP en un vibrante paisaje asiático donde las tradiciones ancestrales chocan con la guerra moderna.', emoji: '⛩️' },
  { title: 'Olympus Arena', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Sumérgete en la Antigüedad: estatuas de mármol, columnas doradas. ¡Elige al personaje más poderoso!', emoji: '🏛️' },
  { title: 'Neon City', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Ciudad futurista con luces de neón y rascacielos. ¡Usa superhabilidades y planea la ruta más rápida!', emoji: '🌃' },
  { title: 'Temple Quest', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Explora templos antiguos llenos de trampas y misterios. Resuelve enigmas y encuentra el tesoro.', emoji: '🏛️' },
  { title: 'Hunter VR', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Conviértete en un cazador en entornos salvajes inmersivos. Rastrea y enfrenta criaturas.', emoji: '🏹' },
  { title: 'DragonFall', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Aventura épica de fantasía donde deberás enfrentarte a dragones y criaturas míticas.', emoji: '🐉' },
  { title: 'Kraken Island: Captain\'s Curse', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Navega hacia una isla maldita y enfréntate al temible Kraken. Rompe la maldición del capitán.', emoji: '🦑' },
  { title: 'Kraken Island: Arena', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Combate PVP en la isla pirata con tesoros y trampas por todas partes.', emoji: '🏴‍☠️' },
  { title: 'Space Academy Adventure', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Aventura espacial donde explorarás estaciones orbitales y completarás misiones intergalácticas.', emoji: '🚀' },
  { title: 'Space Academy', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Entrena como cadete espacial en una academia futurista. Supera pruebas y demuestra tu valía.', emoji: '🛸' },
  { title: 'Arctic Olympics', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Desafío de tirachinas en un paisaje ártico. Compite en los juegos olímpicos más fríos.', emoji: '❄️' },
  { title: 'Kitchen Panic!', category: 'adventure', minAge: 12, maxPlayers: 12, description: '¡Caos en la cocina! Trabaja en equipo para preparar pedidos a contrarreloj.', emoji: '👨‍🍳' },
  { title: 'School of Magic', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Aprende hechizos y encantamientos en una escuela de magia.', emoji: '🧙' },
  { title: 'Pixel Hack', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Adéntrate en un mundo pixelado retro. Hackea sistemas y supera desafíos digitales.', emoji: '👾' },
  { title: 'Lunarscape: Breakdown', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Misión de supervivencia en la superficie lunar. Repara tu base antes de quedarte sin oxígeno.', emoji: '🌙' },
  { title: 'Alice in Wonderland', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Sumérgete en el País de las Maravillas. Aventura surrealista llena de personajes fantásticos.', emoji: '🐇' },
  { title: 'Greenium', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Aventura ecológica donde deberás salvar el planeta resolviendo puzzles medioambientales.', emoji: '🌿' },
  { title: 'Parvus Box', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Encógete y explora un mundo en miniatura lleno de sorpresas.', emoji: '📦' },
  { title: 'The Smurfs: Blueberry Battle', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Únete a los Pitufos en una divertida batalla de arándanos.', emoji: '🫐' },
  { title: 'Party Playland', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'Zona de juegos virtual con minijuegos variados para competir y divertirse en grupo.', emoji: '🎉' },
  { title: 'Party Playland Adventure', category: 'adventure', minAge: 12, maxPlayers: 12, description: 'La versión aventura del Party Playland con misiones cooperativas.', emoji: '🎊' },
  // === ESCAPE ROOM ===
  { title: 'Horror', category: 'escape', minAge: 16, maxPlayers: 12, description: 'Explora un parque de atracciones abandonado. Trabaja en equipo para resolver acertijos y escapar.', emoji: '🎪' },
  { title: 'B-Block Breakout', category: 'escape', minAge: 14, maxPlayers: 12, description: 'Escapa de una prisión de máxima seguridad resolviendo puzzles. ¡El tiempo corre en tu contra!', emoji: '🔓' },
  { title: 'SuperHero', category: 'escape', minAge: 12, maxPlayers: 12, description: 'Escape room de superhéroes. Usa tus superpoderes para resolver puzzles y salvar el mundo.', emoji: '🦸' },
  { title: 'Mansion of Death', category: 'escape', minAge: 16, maxPlayers: 12, description: 'Explora una mansión tenebrosa llena de secretos mortales. Escapa antes de ser su próxima víctima.', emoji: '🏚️' },
  { title: 'Insanity: The Haunting', category: 'escape', minAge: 16, maxPlayers: 12, description: 'Terror psicológico inmersivo. Enfrenta tus peores miedos mientras intentas escapar.', emoji: '👻' },
];

interface CategoryCard {
  id: GameCategory;
  label: string;
  icon: typeof Crosshair;
  color: string;
  glowClass: string;
  description: string;
  emoji: string;
}

const categoryCards: CategoryCard[] = [
  {
    id: 'shooter',
    label: 'Shooters',
    icon: Crosshair,
    color: 'neon-red',
    glowClass: 'hover:shadow-[0_0_30px_hsl(var(--laser-red)/0.3)]',
    description: 'Combate táctico, zombis y acción frenética. Shooters inmersivos para los más valientes.',
    emoji: '🔫',
  },
  {
    id: 'adventure',
    label: 'Aventura',
    icon: Swords,
    color: 'neon-blue',
    glowClass: 'hover:shadow-[0_0_30px_hsl(var(--neon-blue)/0.3)]',
    description: 'Explora mundos fantásticos, resuelve puzzles y vive aventuras épicas en equipo.',
    emoji: '⚔️',
  },
  {
    id: 'escape',
    label: 'Escape Room VR',
    icon: DoorOpen,
    color: 'neon-purple',
    glowClass: 'hover:shadow-[0_0_30px_hsl(var(--neon-purple)/0.3)]',
    description: 'Resuelve acertijos, descubre secretos y escapa antes de que se acabe el tiempo.',
    emoji: '🔐',
  },
];

const colorMap: Record<string, { border: string; text: string; bg: string; badgeBorder: string }> = {
  'neon-red': {
    border: 'border-laser-red/40',
    text: 'text-laser-red',
    bg: 'bg-laser-red/10',
    badgeBorder: 'border-laser-red/30',
  },
  'neon-blue': {
    border: 'border-neon-blue/40',
    text: 'text-neon-blue',
    bg: 'bg-neon-blue/10',
    badgeBorder: 'border-neon-blue/30',
  },
  'neon-purple': {
    border: 'border-neon-purple/40',
    text: 'text-neon-purple',
    bg: 'bg-neon-purple/10',
    badgeBorder: 'border-neon-purple/30',
  },
};

const VRGamesSection = () => {
  const [openCategory, setOpenCategory] = useState<GameCategory | null>(null);

  const filteredGames = openCategory ? games.filter(g => g.category === openCategory) : [];
  const activeCard = categoryCards.find(c => c.id === openCategory);
  const activeColors = activeCard ? colorMap[activeCard.color] : null;

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

        {/* 3 Category Cards */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {categoryCards.map((cat, i) => {
            const colors = colorMap[cat.color];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <button
                  onClick={() => setOpenCategory(cat.id)}
                  className={`w-full text-left group rounded-xl bg-card border border-border ${colors.border.replace('/40', '/0')} hover:${colors.border} p-8 transition-all duration-300 hover:bg-card/80 ${cat.glowClass} cursor-pointer`}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <span className="text-5xl">{cat.emoji}</span>
                    <div>
                      <h3 className={`font-display text-xl font-bold text-foreground group-hover:${colors.text} transition-colors mb-2`}>
                        {cat.label}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                    <Badge variant="outline" className={`${colors.text} ${colors.badgeBorder} text-xs`}>
                      {games.filter(g => g.category === cat.id).length} juegos
                    </Badge>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Games Dialog */}
      <Dialog open={!!openCategory} onOpenChange={(open) => !open && setOpenCategory(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-3">
              {activeCard && (
                <>
                  <span className="text-3xl">{activeCard.emoji}</span>
                  <span className={activeColors?.text}>{activeCard.label}</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="font-body text-muted-foreground">
              {activeCard?.description}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-3 mt-2">
              {filteredGames.map((game) => (
                <div
                  key={game.title}
                  className={`rounded-lg bg-background/50 border border-border p-4 hover:${activeColors?.border} transition-colors`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{game.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-base font-bold text-foreground">
                        {game.title}
                      </h4>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mt-1">
                        {game.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs font-body text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          1-{game.maxPlayers}
                        </span>
                        <span>{game.minAge}+ años</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VRGamesSection;
