import { motion } from "framer-motion";
import { CalendarCheck, CreditCard, Swords, Trophy } from "lucide-react";

const steps = [
  { icon: CalendarCheck, title: "Elige tu Pack", desc: "Selecciona la experiencia y la fecha perfecta." },
  { icon: CreditCard, title: "Reserva Online", desc: "Confirma con solo 50€ de señal por Bizum o transferencia." },
  { icon: Swords, title: "¡A Jugar!", desc: "Llega al centro, recibe el briefing y vive la acción." },
  { icon: Trophy, title: "Victoria", desc: "Llévate los recuerdos y comparte la experiencia." },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block font-body text-sm uppercase tracking-widest text-neon-blue mb-4">
            Paso a paso
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-foreground">
            Cómo <span className="text-neon-blue text-glow-blue">Funciona</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="relative mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 shadow-[0_0_20px_hsl(var(--neon-blue)/0.4)]">
                <step.icon size={28} className="text-primary-foreground" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-background border-2 border-primary text-primary text-xs font-display font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
