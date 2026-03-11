import { motion } from 'framer-motion';
import { Users, Cake, PartyPopper, Trophy, Landmark, Music, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';

const events = [
  {
    icon: Users,
    title: 'Team Building',
    description: 'Fortalece los lazos de tu equipo con actividades que fomentan la comunicación, estrategia y trabajo en equipo.',
    features: ['Grupos de 10-50 personas', 'Dinámicas personalizadas', 'Catering disponible'],
    accent: 'from-neon-blue to-neon-purple',
  },
  {
    icon: Cake,
    title: 'Cumpleaños',
    description: 'Celebra tu día especial con una fiesta llena de acción. Packs completos con merienda y tiempo de juego ilimitado.',
    features: ['Desde 8 invitados', 'Zona privada', 'Tarta incluida'],
    accent: 'from-neon-purple to-neon-red',
  },
  {
    icon: PartyPopper,
    title: 'Despedidas',
    description: 'La despedida de soltero/a más épica. Combina adrenalina, risas y recuerdos inolvidables.',
    features: ['Experiencia VIP', 'Fotografías incluidas', 'Personalizable'],
    accent: 'from-neon-red to-orange-500',
  },
  {
    icon: Trophy,
    title: 'Torneos',
    description: 'Compite en nuestros torneos oficiales o crea el tuyo propio. Premios, clasificaciones y gloria eterna.',
    features: ['Rankings online', 'Premios en metálico', 'Streaming'],
    accent: 'from-neon-green to-neon-blue',
  },
  {
    icon: Landmark,
    title: 'Eventos Municipales',
    description: 'Lleva la diversión a tu municipio. Montamos experiencias de laser tag y VR en ferias, fiestas patronales y eventos públicos.',
    features: ['Montaje completo outdoor', 'Adaptable a cualquier espacio', 'Para todas las edades'],
    accent: 'from-amber-500 to-neon-red',
  },
  {
    icon: Music,
    title: 'Festivales',
    description: 'Añade una atracción única a tu festival. Zonas de juego interactivas que atraen y entretienen a miles de asistentes.',
    features: ['Gran capacidad', 'Experiencia inmersiva', 'Soporte técnico incluido'],
    accent: 'from-pink-500 to-neon-purple',
  },
  {
    icon: GraduationCap,
    title: 'Centros Educativos',
    description: 'Actividades extraescolares, excursiones y jornadas especiales. Diversión segura que fomenta el trabajo en equipo.',
    features: ['Adaptado por edades', 'Monitores especializados', 'Precios especiales para colegios'],
    accent: 'from-cyan-500 to-neon-green',
  },
];

const EventsSection = () => {
  return (
    <section id="events" className="py-20 md:py-32 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-neon-red/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-body text-sm uppercase tracking-widest text-neon-red mb-4">
            Eventos especiales
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            CELEBRA CON <span className="text-neon-red text-glow-red">NOSOTROS</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Sea cual sea la ocasión, tenemos el evento perfecto para ti
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <div className="group relative h-full rounded-2xl bg-card border border-border overflow-hidden hover:border-transparent transition-all duration-500">
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${event.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                <div className="absolute inset-[2px] bg-card rounded-2xl" />

                {/* Content */}
                <div className="relative p-8">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${event.accent} flex items-center justify-center`}>
                      <event.icon className="w-7 h-7 text-background" />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                        {event.title}
                      </h3>
                      <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {event.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm font-body text-foreground/80">
                            <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${event.accent}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button variant="outline" size="sm" className="group-hover:border-neon-blue group-hover:text-neon-blue transition-colors duration-300">
                        Más información
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
