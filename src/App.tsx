import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Reservar from "./pages/Reservar";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import AvisoLegal from "./pages/AvisoLegal";
import LaserTagMurcia from "./pages/LaserTagMurcia";
import CumpleanosLaserTagMurcia from "./pages/CumpleanosLaserTagMurcia";
import EventosEmpresaLaserTag from "./pages/EventosEmpresaLaserTag";
import RealidadVirtualMurcia from "./pages/RealidadVirtualMurcia";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import CookieBanner from "./components/CookieBanner";
import Blog from "./pages/Blog";
import TopPlanesCumpleanosMurcia from "./pages/blog/TopPlanesCumpleanosMurcia";
import LaserTagVsPaintball from "./pages/blog/LaserTagVsPaintball";
import IdeasEventosEmpresaMurcia from "./pages/blog/IdeasEventosEmpresaMurcia";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reservar" element={<Reservar />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/aviso-legal" element={<AvisoLegal />} />
            <Route path="/laser-tag-murcia" element={<LaserTagMurcia />} />
            <Route path="/cumpleanos-laser-tag-murcia" element={<CumpleanosLaserTagMurcia />} />
            <Route path="/eventos-empresa-laser-tag" element={<EventosEmpresaLaserTag />} />
            <Route path="/realidad-virtual-murcia" element={<RealidadVirtualMurcia />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/top-5-planes-cumpleanos-murcia" element={<TopPlanesCumpleanosMurcia />} />
            <Route path="/blog/laser-tag-vs-paintball-cual-elegir" element={<LaserTagVsPaintball />} />
            <Route path="/blog/ideas-eventos-empresa-murcia" element={<IdeasEventosEmpresaMurcia />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
