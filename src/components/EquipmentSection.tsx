import { motion } from 'framer-motion';
import { Shield, Cpu, Wifi, Battery, Glasses, Footprints } from 'lucide-react';
import vrAdventure from '@/assets/vr-adventure.png';
import laserTagBlasters from '@/assets/laser-tag-blasters.jpg';

const laserFeatures = [
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

const vrFeatures = [
  {
    icon: Glasses,
    title: 'Free Roaming',
    description: 'Juegos de realidad virtual de libre movimiento donde caminas, corres y te agachas en el mundo virtual.',
  },
  {
    icon: Footprints,
    title: '+124 Escenarios',
    description: 'Más de 74 horas de contenido original: party games, shooters tácticos, aventuras y juegos de terror.',
  },
  {
    icon: Cpu,
    title: 'Hasta 24 Jugadores',
    description: 'Hasta 16 jugadores en indoor y 24 en outdoor. Experiencias multijugador para toda la familia, desde 5 años.',
  },
  {
    icon: Wifi,
    title: 'Software BattleStart',
    description: 'Plataforma profesional con gestión de sesiones, estadísticas en tiempo real y rankings.',
  },
];

const EquipmentSection = () => {
  return (
    <section id="equipment" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Laser Tag Equipment */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-body text-sm uppercase tracking-widest text-neon-blue mb-4">
              Laser Tag
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              EQUIPAMIENTO <span className="text-neon-blue text-glow-blue">PREMIUM</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed">
              Trabajamos con los mejores proveedores del sector: LaserWar y BattleStart. 
              Nuestro equipamiento ofrece la experiencia más realista y profesional del mercado.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {laserFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-neon-blue" />
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
              <img
                src={laserTagBlasters}
                alt="Equipamiento LaserWar X-Generation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />

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
                className="absolute bottom-8 left-8 px-4 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-neon-blue/30"
              >
                <span className="font-body text-xs text-neon-blue uppercase tracking-wider">+500m alcance</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* VR Equipment */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden gradient-border">
              <img
                src={vrAdventure}
                alt="VEX Adventure - Realidad Virtual"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-8 left-8 px-4 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-neon-purple/30"
              >
                <span className="font-body text-xs text-neon-purple uppercase tracking-wider">Free Roaming</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 right-8 px-4 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-neon-purple/30"
              >
                <span className="font-body text-xs text-neon-purple uppercase tracking-wider">Efectos 4D</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block font-body text-sm uppercase tracking-widest text-neon-purple mb-4">
              Realidad Virtual
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              REALIDAD <span className="text-neon-purple text-glow-purple">VIRTUAL</span> FREE ROAMING
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed">
              Desarrollamos experiencias con los mejores juegos de realidad virtual de libre movimiento del mercado. 
              Party games infantiles, shooters tácticos y aventuras de acción para grupos de hasta 16 jugadores.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {vrFeatures.map((feature, index) => (
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
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;
