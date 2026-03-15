import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "shootandrun_cookie_consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="bg-card border border-border rounded-xl shadow-lg p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
              <Cookie size={24} className="text-primary flex-shrink-0 mt-0.5 md:mt-0" />
              <div className="flex-1 text-sm text-muted-foreground font-body leading-relaxed">
                Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación y analizar el uso del sitio.
                Puedes aceptar todas las cookies, rechazarlas o consultar más información en nuestra{" "}
                <Link to="/politica-privacidad" className="text-primary hover:underline font-medium">
                  Política de Privacidad
                </Link>.
              </div>
              <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReject}
                  className="flex-1 md:flex-none"
                >
                  Rechazar
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="flex-1 md:flex-none"
                >
                  Aceptar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
