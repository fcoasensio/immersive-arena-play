import { useState } from 'react';
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

const Index = () => {
  const [outdoorOpen, setOutdoorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
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
