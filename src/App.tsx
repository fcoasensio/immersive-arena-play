import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";

// Lazy-load non-critical routes to reduce initial JS bundle
const NotFound = lazy(() => import("./pages/NotFound"));
const Reservar = lazy(() => import("./pages/Reservar"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const PoliticaPrivacidad = lazy(() => import("./pages/PoliticaPrivacidad"));
const AvisoLegal = lazy(() => import("./pages/AvisoLegal"));
const LaserTagMurcia = lazy(() => import("./pages/LaserTagMurcia"));
const CumpleanosLaserTagMurcia = lazy(() => import("./pages/CumpleanosLaserTagMurcia"));
const EventosEmpresaLaserTag = lazy(() => import("./pages/EventosEmpresaLaserTag"));
const RealidadVirtualMurcia = lazy(() => import("./pages/RealidadVirtualMurcia"));
const ProtectedAdminRoute = lazy(() => import("./components/admin/ProtectedAdminRoute"));
const CookieBanner = lazy(() => import("./components/CookieBanner"));
const ChatWidget = lazy(() => import("./components/chat/ChatWidget"));
const LeadCapturePopup = lazy(() => import("./components/LeadCapturePopup"));
const Blog = lazy(() => import("./pages/Blog"));
const TopPlanesCumpleanosMurcia = lazy(() => import("./pages/blog/TopPlanesCumpleanosMurcia"));
const LaserTagVsPaintball = lazy(() => import("./pages/blog/LaserTagVsPaintball"));
const IdeasEventosEmpresaMurcia = lazy(() => import("./pages/blog/IdeasEventosEmpresaMurcia"));
const LaserTagInstitutosMurcia = lazy(() => import("./pages/blog/LaserTagInstitutosMurcia"));
const LaserTagAyuntamientosFiestas = lazy(() => import("./pages/blog/LaserTagAyuntamientosFiestas"));
const RealidadVirtualFreeRoamNoMarea = lazy(() => import("./pages/blog/RealidadVirtualFreeRoamNoMarea"));
const CatalogoJuegosVRMurcia = lazy(() => import("./pages/blog/CatalogoJuegosVRMurcia"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={null}>
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
              <Route path="/blog/laser-tag-institutos-murcia" element={<LaserTagInstitutosMurcia />} />
              <Route path="/blog/laser-tag-ayuntamientos-fiestas-patronales" element={<LaserTagAyuntamientosFiestas />} />
              <Route path="/blog/realidad-virtual-free-roam-no-marea" element={<RealidadVirtualFreeRoamNoMarea />} />
              <Route path="/blog/catalogo-juegos-vr-murcia" element={<CatalogoJuegosVRMurcia />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieBanner />
            <ChatWidget />
            <LeadCapturePopup />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
