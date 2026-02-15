import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import VRGamesSection from '@/components/VRGamesSection';
import EventsSection from '@/components/EventsSection';
import EquipmentSection from '@/components/EquipmentSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import ReservationDialog from '@/components/ReservationDialog';

const Index = () => {
  const [reservationOpen, setReservationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onReserveClick={() => setReservationOpen(true)} />
      <HeroSection onReserveClick={() => setReservationOpen(true)} />
      <ServicesSection />
      <VRGamesSection />
      <EventsSection />
      <EquipmentSection />
      <CTASection onReserveClick={() => setReservationOpen(true)} />
      <Footer />
      <ReservationDialog open={reservationOpen} onOpenChange={setReservationOpen} />
    </div>
  );
};

export default Index;
