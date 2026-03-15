import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, CalendarCheck, Settings, CalendarDays } from "lucide-react";
import AdminReservas from "@/components/admin/AdminReservas";
import AdminConfiguracion from "@/components/admin/AdminConfiguracion";
import AdminFestivos from "@/components/admin/AdminFestivos";

const Admin = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("reservas");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-primary">shootandrun <span className="text-muted-foreground font-body text-sm font-normal">Admin</span></h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} /> Salir
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="reservas" className="gap-2">
              <CalendarCheck size={16} /> Reservas
            </TabsTrigger>
            <TabsTrigger value="configuracion" className="gap-2">
              <Settings size={16} /> Configuración
            </TabsTrigger>
            <TabsTrigger value="festivos" className="gap-2">
              <CalendarDays size={16} /> Festivos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservas">
            <AdminReservas />
          </TabsContent>
          <TabsContent value="configuracion">
            <AdminConfiguracion />
          </TabsContent>
          <TabsContent value="festivos">
            <AdminFestivos />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
