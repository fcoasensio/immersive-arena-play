import { motion } from 'framer-motion';
import { Target, Glasses, Building2, TreePine } from 'lucide-react';
import vrExperience from '@/assets/vr-card.jpg';
import vrAdventure from '@/assets/vr-adventure.png';
import laserTagEquipment from '@/assets/laser-tag-card.webp';

const services = [
  {
    icon: Target,
    title: 'Laser Tag',
    description: 'Equipamiento militar de última generación con tecnología infrarroja de precisión. Partidas épicas con diferentes modos de juego a partir de 8 años.',
    color: 'neon-blue',
    glowClass: 'box-glow-blue',
    image: laserTagEquipment,
    modes: [
      { icon: Building2, label: 'Indoor', desc: 'Pista de 500 m2 con obstaculos hinchables, adaptable a cualquier modo de juego. Hasta 16 jugadores.' },
      { icon: TreePine, label: 'Outdoor', desc: 'Juega al aire libre en terrenos naturales y estructuras tácticas. Hasta 24 jugadores en modo normal y +200 en modo rueda infinita.' },
    ],
  },
  {
    icon: Glasses,
    title: 'Realidad Virtual',
    description: 'Juegos de realidad virtual de libre movimiento con tecnología Free Roaming. Party games para toda la familia desde 12 años, shooters tácticos, escape rooms y aventuras de acción para hasta 12 jugadores simultáneos.',
    color: 'neon-purple',
    glowClass: 'box-glow-purple',
    image: vrExperience,
    modes: [
      { icon: Building2, label: 'Indoor', desc: 'Arena VR de 200m² con tracking de última generación y hasta 12 jugadores simultáneos.' },
      { icon: TreePine, label: 'Outdoor', desc: 'Experiencias VR móviles al aire libre con libertad de movimiento total. Hasta 12 jugadores.' },
    ],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-body text-sm uppercase tracking-widest text-neon-blue mb-4">
            Nuestras experiencias
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            ELIGE TU <span className="text-neon-blue text-glow-blue">AVENTURA</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Combina tecnología de vanguardia con adrenalina pura en nuestras dos modalidades de juego
          </p>
        </motion.div>

        {/* Services Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <div className="group h-full gradient-border rounded-2xl bg-card overflow-hidden hover:scale-[1.02] transition-all duration-300">
                {/* Image */}
                {service.image && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  </div>
                )}
                {!service.image && (
                  <div className={`relative h-56 bg-gradient-to-br from-${service.color}/20 via-card to-${service.color}/5 flex items-center justify-center`}>
                    <service.icon className={`w-24 h-24 text-${service.color} opacity-30`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${service.color}/10 flex items-center justify-center`}>
                      <service.icon className={`w-6 h-6 text-${service.color}`} />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {service.title}
                    </h3>
                  </div>

                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Indoor / Outdoor modes */}
                  <div className="space-y-3">
                    <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                      Modalidades disponibles
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {service.modes.map((mode) => (
                        <div
                          key={mode.label}
                          className={`p-3 rounded-lg bg-background/50 border border-border hover:border-${service.color}/40 transition-colors`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <mode.icon className={`w-4 h-4 text-${service.color}`} />
                            <span className="font-display text-sm font-semibold text-foreground">
                              {mode.label}
                            </span>
                          </div>
                          <p className="font-body text-xs text-muted-foreground leading-relaxed">
                            {mode.desc}
                          </p>
                        </div>
                      ))}
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

export default ServicesSection;
