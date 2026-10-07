import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Una página inexistente no debe declarar dirección canónica
    document.head.querySelectorAll('link[rel="canonical"][data-fallback]').forEach((l) => l.remove());
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Helmet>
        <title>Página no encontrada | shootandrun</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="text-center px-4">
        <h1 className="mb-4 font-display text-5xl font-bold text-primary">404</h1>
        <p className="mb-6 font-body text-xl text-muted-foreground">Esta página no existe o se ha movido.</p>
        <Link to="/" className="font-body text-primary underline hover:text-primary/90">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
