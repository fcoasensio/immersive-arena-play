import { motion } from 'framer-motion';
import { Target, Glasses, TreePine, Building2 } from 'lucide-react';

const services = [
  {
    icon: Target,
    title: 'Laser Tag',
    description: 'Equipamiento militar de última generación con tecnología infrarroja de precisión. Partidas épicas con diferentes modos de juego.',
    color: 'neon-blue',
    glowClass: 'box-glow-blue',
  },
  {
    icon: Glasses,
    title: 'Realidad Virtual',
    description: 'Sumérgete en mundos virtuales con las mejores gafas VR del mercado. Experiencias multijugador increíbles.',
    color: 'neon-purple',
    glowClass: 'box-glow-purple',
  },
  {
    icon: Building2,
    title: 'Indoor',
    description: 'Arenas climatizadas con escenografía inmersiva. Iluminación UV, niebla y efectos especiales para una experiencia única.',
    color: 'neon-red',
    glowClass: 'box-glow-red',
  },
  {
    icon: TreePine,
    title: 'Outdoor',
    description: 'Campos al aire libre con terrenos naturales y estructuras tácticas. Partidas de gran escala con hasta 30 jugadores.',
    color: 'neon-green',
    glowClass: '',
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
            Combina tecnología de vanguardia con adrenalina pura en nuestras modalidades de juego
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="group h-full gradient-border rounded-xl bg-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-lg bg-${service.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-8 h-8 text-${service.color}`} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-neon-blue transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Hover accent line */}
                <div className={`mt-6 h-0.5 bg-gradient-to-r from-${service.color} to-transparent w-0 group-hover:w-full transition-all duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
