import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReservaForm from "@/components/reservas/ReservaForm";
import { Helmet } from "react-helmet-async";
import { absoluteUrl, breadcrumbJsonLd, businessData } from "@/lib/siteData";

const reservationJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Reservar Laser Tag o Realidad Virtual",
    description: "Formulario oficial de reserva de shootandrun en Alcantarilla, Murcia.",
    url: absoluteUrl("/reservar"),
    isPartOf: { "@type": "WebSite", name: businessData.name, url: absoluteUrl("/") },
  },
  breadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Reservar", path: "/reservar" },
  ]),
];

const Reservar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Reservar Laser Tag o Realidad Virtual | shootandrun</title>
        <meta name="description" content="Reserva online tu experiencia de Laser Tag o Realidad Virtual Free Roaming en Alcantarilla, Murcia." />
        <link rel="canonical" href="https://shootandrun.es/reservar" />
        <meta property="og:title" content="Reservar Laser Tag o Realidad Virtual | shootandrun" />
        <meta property="og:description" content="Reserva online tu experiencia de Laser Tag o Realidad Virtual Free Roaming en Alcantarilla, Murcia." />
        <meta property="og:url" content="https://shootandrun.es/reservar" />
        <script type="application/ld+json">{JSON.stringify(reservationJsonLd)}</script>
      </Helmet>
      <Navbar />

      <main className="min-h-screen pt-16">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-10">
              <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">
                Reserva tu <span className="text-primary">Experiencia</span>
              </h1>
              <p className="mt-3 text-muted-foreground font-body">
                Elige entre Láser Tag o Realidad Virtual y completa tu reserva en minutos
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <ReservaForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Reservar;
