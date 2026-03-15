import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, PartyPopper, Wine } from "lucide-react";

const packs = [
  {
    name: "Pack Básico",
    description: "Ideal para amigos y grupos que buscan acción pura.",
    price: "Desde 18€/pers.",
    duration: "90 min",
    players: "6–16 jugadores",
    icon: Star,
    features: ["Láser Tag o VR", "Equipamiento completo", "Briefing táctico", "Sáb, dom y festivos: +2€/pers."],
    popular: false,
    color: "neon-blue" as const,
  },
  {
    name: "Cumpleaños",
    description: "El cumpleaños más épico que puedan imaginar. ¡Recuerdos para siempre!",
    price: "Desde 20€/pers.",
    duration: "150 min",
    players: "Hasta 16 (LT) / 12 (VR)",
    icon: PartyPopper,
    features: ["Láser Tag (+8 años) o VR (+12 años)", "Pack Básico incluido", "Zona de merienda privada (resto hasta 150 min)", "Vídeo invitación personalizado", "Coordinador dedicado", "Sáb, dom y festivos: +2€/pers."],
    popular: true,
    color: "neon-purple" as const,
  },
  {
    name: "Despedidas",
    description: "La mejor despedida de soltero/a de Murcia. Adrenalina garantizada.",
    price: "Desde 20€/pers.",
    duration: "90 min",
    players: "8–20 jugadores",
    icon: Wine,
    features: ["Láser Tag o VR", "Foto grupal", "Diploma al ganador"],
    popular: false,
    color: "neon-blue" as const,
  },
];

const PacksSection = () => {
  return (
    <section id="packs" className="py-20 md:py-28 relative overflow-hidden bg-muted/30">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block font-body text-sm uppercase tracking-widest text-neon-purple mb-4">
            Experiencias
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-foreground">
            Packs y <span className="text-neon-purple text-glow-purple">Precios</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto font-body">
            Elige la experiencia perfecta para tu grupo. Precios dinámicos según día y disponibilidad.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl p-7 flex flex-col ${
                pack.popular
                  ? "gradient-border bg-card box-glow-blue"
                  : "bg-card border border-border"
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-display font-semibold px-4 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_hsl(var(--neon-blue)/0.5)]">
                  Más Popular
                </span>
              )}

              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <pack.icon size={24} className="text-primary" />
              </div>

              <h3 className="font-display text-xl font-bold mb-2 text-foreground">{pack.name}</h3>
              <p className="text-muted-foreground text-sm mb-4 flex-grow font-body">{pack.description}</p>

              <div className="text-2xl font-display font-bold text-primary mb-4">{pack.price}</div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5 font-body">
                <span className="flex items-center gap-1"><Clock size={14} /> {pack.duration}</span>
                <span className="flex items-center gap-1"><Users size={14} /> {pack.players}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {pack.features.map((f) => (
                  <li key={f} className="text-sm text-foreground flex items-start gap-2 font-body">
                    <span className="text-primary mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>

              <Link to="/reservar" className="mt-auto">
                <Button
                  className="w-full font-display tracking-wide"
                  variant={pack.popular ? "glow" : "neon"}
                >
                  Reservar
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PacksSection;
