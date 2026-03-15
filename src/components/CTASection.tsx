import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';

const contactInfo = [
  { icon: Phone, label: 'Teléfono', value: '+34 606 323 053' },
  { icon: Mail, label: 'Email', value: 'hola@shootandrun.es' },
  { icon: MapPin, label: 'Ubicación', value: 'Alcantarilla (Murcia)' },
  { icon: Clock, label: 'Horario', value: 'L-D: 10:00 - 22:00' },
];

interface CTASectionProps {
  onOutdoorClick?: () => void;
}

const CTASection = ({ onOutdoorClick }: CTASectionProps) => {
  const navigate = useNavigate();
  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-neon-blue/5 to-background" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Glowing orbs */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-neon-red/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Headline */}
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
            ¿PREPARADO PARA LA <br />
            <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red bg-clip-text text-transparent">
              EXPERIENCIA DEFINITIVA
            </span>
            ?
          </h2>
          <p className="font-body text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Reserva ahora tu sesión y prepárate para vivir la adrenalina del combate láser 
            y la inmersión total de la realidad virtual
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl" onClick={() => navigate('/reservar')}>
              Reservar Ahora
            </Button>
            <Button variant="outline" size="xl" onClick={onOutdoorClick}>
              Presupuesto Outdoor
            </Button>
          </div>

          {/* Contact Info */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-6 rounded-xl bg-card/50 border border-border backdrop-blur-sm hover:border-neon-blue/50 transition-colors duration-300 group"
              >
                <item.icon className="w-8 h-8 text-neon-blue mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="font-body text-sm text-foreground font-medium">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
