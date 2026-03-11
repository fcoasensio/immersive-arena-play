import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Crosshair } from 'lucide-react';
import logoImg from '@/assets/logo-shootandrun.png';
import { Button } from './ui/button';

interface NavbarProps {
  onReserveClick?: () => void;
}

const Navbar = ({ onReserveClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Experiencias', href: '#services' },
    { name: 'Eventos', href: '#events' },
    { name: 'Equipamiento', href: '#equipment' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <img src={logoImg} alt="Shoot and Run" className="h-10 md:h-12 w-auto" translate="no" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-body text-sm uppercase tracking-wider text-muted-foreground hover:text-neon-blue transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <Button variant="neon" size="sm" onClick={onReserveClick}>
              Reservar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-neon-blue transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-body text-lg uppercase tracking-wider text-muted-foreground hover:text-neon-blue transition-colors duration-300 py-2"
                  >
                    {link.name}
                  </a>
                ))}
                <Button variant="neon" className="mt-2" onClick={() => { setIsOpen(false); onReserveClick?.(); }}>
                  Reservar Ahora
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
