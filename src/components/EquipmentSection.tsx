import { motion } from 'framer-motion';
import { Shield, Cpu, Wifi, Battery } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Tecnología Militar',
    description: 'Equipamiento profesional LaserWar X-Generation con precisión infrarroja de grado militar.',
  },
  {
    icon: Cpu,
    title: 'Software Avanzado',
    description: 'Sistema BattleStart con estadísticas en tiempo real, rankings y múltiples modos de juego.',
  },
  {
    icon: Wifi,
    title: 'Conexión Total',
    description: 'Todos los dispositivos conectados para partidas sincronizadas y experiencias inmersivas.',
  },
  {
    icon: Battery,
    title: 'Autonomía Extrema',
    description: 'Baterías de larga duración para sesiones de juego ininterrumpidas.',
  },
];

const EquipmentSection = () => {
  return (
    <section id="equipment" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-body text-sm uppercase tracking-widest text-neon-purple mb-4">
              Equipamiento premium
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              TECNOLOGÍA DE <span className="text-neon-purple text-glow-purple">VANGUARDIA</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed">
              Trabajamos con los mejores proveedores del sector: LaserWar y BattleStart. 
              Nuestro equipamiento ofrece la experiencia más realista y profesional del mercado.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-neon-purple" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden gradient-border">
              {/* Placeholder for equipment image */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-card to-neon-blue/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-neon-purple/20 flex items-center justify-center animate-pulse-glow">
                      <Cpu className="w-16 h-16 text-neon-purple" />
                    </div>
                    <p className="font-display text-2xl font-bold text-foreground">LaserWar X-Gen</p>
                    <p className="font-body text-sm text-muted-foreground mt-2">Última generación</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-8 right-8 px-4 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-neon-blue/30"
              >
                <span className="font-body text-xs text-neon-blue uppercase tracking-wider">Precisión 99.9%</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 left-8 px-4 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-neon-purple/30"
              >
                <span className="font-body text-xs text-neon-purple uppercase tracking-wider">+500m alcance</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;
