import { useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import { absoluteUrl, businessData, publicServices } from '@/lib/siteData';

const VRGamesSection = lazy(() => import('@/components/VRGamesSection'));
const LaserGamesSection = lazy(() => import('@/components/LaserGamesSection'));
const HowItWorksSection = lazy(() => import('@/components/HowItWorksSection'));
const PacksSection = lazy(() => import('@/components/PacksSection'));
const EventsSection = lazy(() => import('@/components/EventsSection'));
const EquipmentSection = lazy(() => import('@/components/EquipmentSection'));
const CTASection = lazy(() => import('@/components/CTASection'));
const Footer = lazy(() => import('@/components/Footer'));
const OutdoorBudgetDialog = lazy(() => import('@/components/OutdoorBudgetDialog'));

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "name": businessData.name,
  "description": businessData.description,
  "url": absoluteUrl('/'),
  "telephone": businessData.telephone,
  "email": businessData.email,
  "address": {
    "@type": "PostalAddress",
    ...businessData.address,
  },
  "geo": {
    "@type": "GeoCoordinates",
    ...businessData.geo,
  },
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Efectivo, Bizum, Transferencia",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 37.9693, "longitude": -1.2265 },
    "geoRadius": "50000"
  },
  "sameAs": businessData.social,
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Actividades",
    "itemListElement": publicServices.map((service) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "url": absoluteUrl(service.path),
      },
    })),
  }
};

const Index = () => {
  const [outdoorOpen, setOutdoorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Shoot and Run | Laser Tag y Realidad Virtual en Murcia</title>
        <meta name="description" content="Centro de laser tag y realidad virtual Free Roaming en Alcantarilla, Murcia. Cumpleaños, eventos de empresa, despedidas y ocio. Desde 18€/persona. ¡Reserva ahora!" />
        <link rel="canonical" href="https://shootandrun.es/" />
        <meta property="og:title" content="shootandrun | Laser Tag y Realidad Virtual en Murcia" />
        <meta property="og:description" content="Centro de laser tag y realidad virtual Free Roaming para grupos, cumpleaños y eventos en Alcantarilla, Murcia." />
        <meta property="og:url" content="https://shootandrun.es/" />
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
      </Helmet>
      <Navbar />
      <HeroSection />
      <Suspense fallback={null}>
        <LaserGamesSection />
        <VRGamesSection />
        <HowItWorksSection />
        <PacksSection />
        <EventsSection />
        <EquipmentSection />
        <CTASection onOutdoorClick={() => setOutdoorOpen(true)} />
        <Footer />
        <OutdoorBudgetDialog open={outdoorOpen} onOpenChange={setOutdoorOpen} />
      </Suspense>
    </div>
  );
};

export default Index;
