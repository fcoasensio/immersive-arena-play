import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import logoImg from '@/assets/logo-shootandrun.png';
import PrivacyPolicyDialog from './PrivacyPolicyDialog';
import TermsDialog from './TermsDialog';
import CookiesPolicyDialog from './CookiesPolicyDialog';
import LegalNoticeDialog from './LegalNoticeDialog';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logoImg} alt="Shoot and Run" className="h-[52px] w-auto" translate="no" />
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <PrivacyPolicyDialog>
              <button className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                Política de Privacidad
              </button>
            </PrivacyPolicyDialog>
            <TermsDialog>
              <button className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                Términos y Condiciones
              </button>
            </TermsDialog>
            <CookiesPolicyDialog>
              <button className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                Política de Cookies
              </button>
            </CookiesPolicyDialog>
            <LegalNoticeDialog>
              <button className="font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors">
                Aviso Legal
              </button>
            </LegalNoticeDialog>
          </div>

          {/* Social */}
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
