import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, CalendarCheck, Settings, CalendarDays, Package, MessageCircle, Flame, Mail, Instagram } from "lucide-react";
import AdminReservas from "@/components/admin/AdminReservas";
import AdminConfiguracion from "@/components/admin/AdminConfiguracion";
import AdminFestivos from "@/components/admin/AdminFestivos";
import AdminPacks from "@/components/admin/AdminPacks";
import AdminChatbotStats from "@/components/admin/AdminChatbotStats";
import AdminLeads from "@/components/admin/AdminLeads";
import AdminEmailsPendientes from "@/components/admin/AdminEmailsPendientes";
import AdminInstagramSync from "@/components/admin/AdminInstagramSync";

const Admin = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("reservas");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
            <TabsTrigger value="leads" className="gap-2">
              <Flame size={16} /> Leads
            </TabsTrigger>
            <TabsTrigger value="emails" className="gap-2">
              <Mail size={16} /> Emails pendientes
            </TabsTrigger>
            <TabsTrigger value="instagram" className="gap-2">
              <Instagram size={16} /> Instagram
            </TabsTrigger>
            <TabsTrigger value="packs" className="gap-2">
              <Package size={16} /> Packs
            </TabsTrigger>
            <TabsTrigger value="configuracion" className="gap-2">
              <Settings size={16} /> Configuración
            </TabsTrigger>
            <TabsTrigger value="festivos" className="gap-2">
              <CalendarDays size={16} /> Festivos
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="gap-2">
              <MessageCircle size={16} /> Chatbot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservas">
            <AdminReservas />
          </TabsContent>
          <TabsContent value="leads">
            <AdminLeads />
          </TabsContent>
          <TabsContent value="emails">
            <AdminEmailsPendientes />
          </TabsContent>
          <TabsContent value="packs">
            <AdminPacks />
          </TabsContent>
          <TabsContent value="configuracion">
            <AdminConfiguracion />
          </TabsContent>
          <TabsContent value="festivos">
            <AdminFestivos />
          </TabsContent>
          <TabsContent value="chatbot">
            <AdminChatbotStats />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
