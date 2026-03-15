import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import VRGamesSection from '@/components/VRGamesSection';
import LaserGamesSection from '@/components/LaserGamesSection';
import EventsSection from '@/components/EventsSection';
import EquipmentSection from '@/components/EquipmentSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import ReservationDialog from '@/components/ReservationDialog';
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
      <EventsSection />
      <EquipmentSection />
      <CTASection onOutdoorClick={() => setOutdoorOpen(true)} />
      <Footer />
      <OutdoorBudgetDialog open={outdoorOpen} onOpenChange={setOutdoorOpen} />
    </div>
  );
};

export default Index;
