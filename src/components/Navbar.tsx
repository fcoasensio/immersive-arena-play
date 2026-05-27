import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import logoImg from '@/assets/logo-shootandrun.png';
import { Button } from './ui/button';

const actividadesLinks = [
  { name: 'Laser Tag', href: '/laser-tag-murcia' },
  { name: 'Realidad Virtual', href: '/realidad-virtual-murcia' },
  { name: 'Cumpleaños', href: '/cumpleanos-laser-tag-murcia' },
  { name: 'Eventos Empresa', href: '/eventos-empresa-laser-tag' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Cómo Funciona', href: '#como-funciona' },
    { name: 'Packs', href: '#packs' },
    { name: 'Equipamiento', href: '#equipment' },
    { name: 'Contacto', href: '#contact' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const id = href.replace('#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const linkClass = "font-body uppercase tracking-wider text-foreground hover:text-neon-blue transition-colors duration-300 relative group text-xl";
  const mobileLinkClass = "font-body text-lg uppercase tracking-wider text-muted-foreground hover:text-neon-blue transition-colors duration-300 py-2";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 font-bold text-xl">
          <a href="/" onClick={handleLogoClick} className="flex items-center group">
            <img src={logoImg} alt="Shoot and Run" className="h-[52px] md:h-[62px] w-auto" translate="no" />
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={linkClass}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300" />
              </a>
            ))}

            {/* Actividades dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`${linkClass} flex items-center gap-1 cursor-pointer`}
              >
                Actividades
                <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-lg border border-border rounded-lg py-2 min-w-[180px] shadow-lg">
                  {actividadesLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => { setDropdownOpen(false); navigate(link.href); }}
                      className="block w-full text-left px-4 py-2 font-body text-sm text-muted-foreground hover:text-neon-blue hover:bg-neon-blue/5 transition-colors"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/blog"
              onClick={(e) => { e.preventDefault(); navigate('/blog'); }}
              className={linkClass}
            >
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300" />
            </a>
            <Button variant="neon" size="sm" onClick={() => navigate('/reservar')}>
              Reservar
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-neon-blue transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile */}
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
                    onClick={(e) => { handleNavClick(e, link.href); setIsOpen(false); }}
                    className={mobileLinkClass}
                  >
                    {link.name}
                  </a>
                ))}

                {/* Mobile Actividades */}
                <button
                  onClick={() => setMobileSubmenu(!mobileSubmenu)}
                  className={`${mobileLinkClass} flex items-center justify-between w-full text-left`}
                >
                  Actividades
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubmenu && (
                  <div className="pl-4 flex flex-col gap-2">
                    {actividadesLinks.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => { setIsOpen(false); setMobileSubmenu(false); navigate(link.href); }}
                        className="font-body text-base text-muted-foreground hover:text-neon-blue transition-colors text-left py-1"
                      >
                        {link.name}
                      </button>
                    ))}
                  </div>
                )}

                <a
                  href="/blog"
                  onClick={(e) => { e.preventDefault(); setIsOpen(false); navigate('/blog'); }}
                  className={mobileLinkClass}
                >
                  Blog
                </a>
                <Button variant="neon" className="mt-2" onClick={() => { setIsOpen(false); navigate('/reservar'); }}>
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
