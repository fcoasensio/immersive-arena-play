import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, CalendarDays, DollarSign, ClipboardList, Loader2 } from 'lucide-react';
import AdminReservations from '@/components/admin/AdminReservations';
import AdminHolidays from '@/components/admin/AdminHolidays';
import AdminPricing from '@/components/admin/AdminPricing';

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Shoot&Run Admin
            </h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { signOut(); navigate('/admin/login'); }}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="reservations" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Reservas</span>
            </TabsTrigger>
            <TabsTrigger value="holidays" className="gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Festivos</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Precios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <AdminReservations />
          </TabsContent>
          <TabsContent value="holidays">
            <AdminHolidays />
          </TabsContent>
          <TabsContent value="pricing">
            <AdminPricing />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
