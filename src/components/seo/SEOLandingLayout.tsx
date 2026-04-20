import { motion } from 'framer-motion';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQ {
  question: string;
  answer: string;
}

interface SEOLandingLayoutProps {
  title: string;
  subtitle: string;
  heroImage: string;
  heroImagePosition?: string;
  children: React.ReactNode;
  faqs: FAQ[];
  metaDescription?: string;
}

const SEOLandingLayout = ({ title, subtitle, heroImage, heroImagePosition = 'center', children, faqs }: SEOLandingLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt={title} className="w-full h-full object-cover" style={{ objectPosition: heroImagePosition }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {title}
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="glow" size="lg" onClick={() => navigate('/reservar')}>
                Reservar ahora
              </Button>
              <Button variant="neon" size="lg" asChild>
                <a href="https://wa.me/34606323053" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose-invert font-body text-base md:text-lg text-muted-foreground leading-relaxed space-y-8"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* FAQ */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">
                Preguntas <span className="text-neon-blue text-glow-blue">frecuentes</span>
              </h2>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-6 bg-card/50">
                  <AccordionTrigger className="font-body text-base md:text-lg text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-6">
            ¿Listo para la <span className="text-neon-blue text-glow-blue">acción</span>?
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Reserva tu experiencia ahora o contáctanos por WhatsApp para resolver cualquier duda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="glow" size="lg" onClick={() => navigate('/reservar')}>
              Reservar ahora
            </Button>
            <Button variant="neon" size="lg" asChild>
              <a href="https://wa.me/34606323053" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SEOLandingLayout;
