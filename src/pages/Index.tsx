import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

import VRGamesSection from '@/components/VRGamesSection';
import LaserGamesSection from '@/components/LaserGamesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PacksSection from '@/components/PacksSection';
import EventsSection from '@/components/EventsSection';
import EquipmentSection from '@/components/EquipmentSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

import OutdoorBudgetDialog from '@/components/OutdoorBudgetDialog';

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Shoot and Run",
  "description": "Centro de laser tag y realidad virtual Free Roaming en Alcantarilla, Murcia. Cumpleaños, eventos de empresa, despedidas y actividades de ocio.",
  "url": "https://shootandrunweb.lovable.app",
  "telephone": "+34606323053",
  "email": "reservas@shootandrun.es",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Avda. Fernando III El Santo, 24",
    "addressLocality": "Alcantarilla",
    "addressRegion": "Murcia",
    "postalCode": "30820",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.9693,
    "longitude": -1.2265
  },
  "image": "https://shootandrunweb.lovable.app/og-image.jpg",
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Efectivo, Bizum, Transferencia",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 37.9693, "longitude": -1.2265 },
    "geoRadius": "50000"
  },
  "sameAs": [
    "https://www.instagram.com/shootandrunlasertag",
    "https://www.facebook.com/shootandrunlasertag/"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Actividades",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Laser Tag Indoor y Outdoor" }
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Realidad Virtual Free Roaming" }
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Cumpleaños de Laser Tag" }
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Eventos de Empresa y Team Building" }
      }
    ]
  }
};

const Index = () => {
  const [outdoorOpen, setOutdoorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Shoot and Run | Laser Tag y Realidad Virtual en Murcia</title>
        <meta name="description" content="Centro de laser tag y realidad virtual Free Roaming en Alcantarilla, Murcia. Cumpleaños, eventos de empresa, despedidas y ocio. Desde 18€/persona. ¡Reserva ahora!" />
        <link rel="canonical" href="https://shootandrunweb.lovable.app/" />
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
      </Helmet>
      <Navbar />
      <HeroSection />
      
      <LaserGamesSection />
      <VRGamesSection />
      <HowItWorksSection />
      <PacksSection />
      <EventsSection />
      <EquipmentSection />
      <CTASection onOutdoorClick={() => setOutdoorOpen(true)} />
      <Footer />
      <OutdoorBudgetDialog open={outdoorOpen} onOpenChange={setOutdoorOpen} />
    </div>
  );
};

export default Index;
