import { Crosshair, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Crosshair className="w-6 h-6 text-neon-blue" />
            <span className="font-display text-lg font-bold text-foreground">
              SHOOT<span className="text-neon-blue">&</span>RUN
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
              Términos y Condiciones
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            {[Instagram, Facebook, Youtube].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-neon-blue hover:border-neon-blue transition-colors duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="font-body text-sm text-muted-foreground">
            © {currentYear} Shoot & Run. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
