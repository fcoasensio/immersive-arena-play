import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo-shootandrun.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border bg-card/30">
      <div className="container mx-auto px-4">
        {/* Top row: logo, activities, legal, social */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {/* Logo */}
          <div className="flex items-center md:items-start">
            <img src={logoImg} alt="Shoot and Run" className="h-[52px] w-auto" translate="no" />
          </div>

          {/* Actividades */}
          <div className="text-center md:text-left">
            <h4 className="font-display text-xs uppercase tracking-widest text-foreground mb-3">Actividades</h4>
            <div className="flex flex-col gap-2">
              <Link to="/laser-tag-murcia" className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                Laser Tag en Murcia
              </Link>
              <Link to="/realidad-virtual-murcia" className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                Realidad Virtual
              </Link>
              <Link to="/cumpleanos-laser-tag-murcia" className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                Cumpleaños Laser Tag
              </Link>
              <Link to="/eventos-empresa-laser-tag" className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
              Eventos de Empresa
              </Link>
              <Link to="/blog" className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                Blog
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h4 className="font-display text-xs uppercase tracking-widest text-foreground mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/politica-privacidad" className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/aviso-legal" className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                Aviso Legal
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-display text-xs uppercase tracking-widest text-foreground mb-3">Síguenos</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/shootandrunlasertag"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-neon-blue hover:border-neon-blue transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/shootandrunlasertag/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-neon-blue hover:border-neon-blue transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/34606323053"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-neon-blue hover:border-neon-blue transition-colors duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="font-body text-sm text-muted-foreground">
            © {currentYear} shootandrun. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
