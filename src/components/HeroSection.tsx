import { motion } from 'framer-motion';
import { ChevronDown, Zap, Target, Gamepad2 } from 'lucide-react';
import { Button } from './ui/button';
import heroBg from '@/assets/hero-bg.jpg';

interface HeroSectionProps {
  onReserveClick?: () => void;
}

const HeroSection = ({ onReserveClick }: HeroSectionProps) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Laser Tag Arena"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* Animated scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-neon-blue/10 to-transparent animate-scan-line" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 mb-8"
          >
            <Zap className="w-4 h-4 text-neon-blue" />
            <span className="text-sm font-body uppercase tracking-wider text-neon-blue">
              La experiencia definitiva en ocio
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-foreground">LASER TAG</span>
            <br />
            <span className="text-neon-blue text-glow-blue">&</span>
            <br />
            <span className="bg-gradient-to-r from-neon-purple to-neon-red bg-clip-text text-transparent">
              REALIDAD VIRTUAL
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experiencias inmersivas para Team Building, 
            Cumpleaños, Despedidas y Torneos.{' '}
            <span className="text-neon-blue font-semibold">Indoor</span> y{' '}
            <span className="text-neon-red font-semibold">Outdoor</span>
          </p>

          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: Target, label: 'Laser Tag' },
              { icon: Gamepad2, label: 'Realidad Virtual' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border backdrop-blur-sm"
              >
                <item.icon className="w-5 h-5 text-neon-purple" />
                <span className="font-body text-sm uppercase tracking-wider text-foreground">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="xl" onClick={onReserveClick}>
              Reserva tu experiencia
            </Button>
            <Button variant="outline" size="xl">
              Ver experiencias
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-widest font-body">Descubre más</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
