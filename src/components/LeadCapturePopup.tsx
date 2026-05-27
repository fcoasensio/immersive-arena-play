import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X, MessageCircle, Zap, Check } from "lucide-react";
import { motion } from "framer-motion";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import {
  useLeadPopupTrigger,
  markDismissed,
  markSubmitted,
} from "@/hooks/useLeadPopupTrigger";
import { captureUtmsFromUrl, getAllUtms } from "@/lib/utm";

const WHATSAPP_URL = "https://wa.me/34606323053";

const schema = z.object({
  nombre: z.string().trim().min(2, "Indica tu nombre").max(100),
  telefono: z
    .string()
    .trim()
    .min(9, "Teléfono obligatorio")
    .max(30)
    .regex(/^[+\d\s().-]{9,30}$/, "Teléfono inválido"),
  tipo_evento: z.enum(
    ["cumpleanos", "empresa", "despedida", "colegio", "amigos", "otro"],
    { required_error: "Selecciona el tipo de evento" }
  ),
  num_personas: z.string().max(30).optional().or(z.literal("")),
  fecha_orientativa: z.string().max(20).optional().or(z.literal("")),
  consentimiento: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar para continuar" }),
  }),
});

type FormData = z.infer<typeof schema>;

type Status = "idle" | "loading" | "success" | "error";

const isAdminRoute = (pathname: string) =>
  pathname.startsWith("/admin") || pathname.startsWith("/reservar");

const FormBody = ({ onClose }: { onClose: () => void }) => {
  const [status, setStatus] = useState<Status>("idle");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      telefono: "",
      num_personas: "",
      fecha_orientativa: "",
      consentimiento: false as unknown as true,
    },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const utms = getAllUtms();
      const { error } = await supabase.functions.invoke("submit-lead-rapido", {
        body: {
          nombre: data.nombre,
          telefono: data.telefono,
          tipo_evento: data.tipo_evento,
          num_personas: data.num_personas || "",
          fecha_orientativa: data.fecha_orientativa || "",
          consentimiento: data.consentimiento === true,
          source: "popup_contacto_rapido",
          page_url: typeof window !== "undefined" ? window.location.href : "",
          timestamp: new Date().toISOString(),
          ...utms,
        },
      });
      if (error) throw error;
      markSubmitted();
      setStatus("success");
      setTimeout(onClose, 3500);
    } catch (e) {
      console.error("Lead submit error", e);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/15 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-display font-bold mb-2">¡Recibido!</h3>
        <p className="text-muted-foreground">
          Te contactaremos pronto por WhatsApp.
        </p>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} className="bg-background/60" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono / WhatsApp *</FormLabel>
              <FormControl>
                <Input
                  inputMode="tel"
                  placeholder="+34 600 000 000"
                  {...field}
                  className="bg-background/60"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo_evento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de evento *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background/60">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cumpleanos">🎂 Cumpleaños</SelectItem>
                  <SelectItem value="empresa">💼 Empresa / Team Building</SelectItem>
                  <SelectItem value="despedida">🎉 Despedida</SelectItem>
                  <SelectItem value="colegio">🏫 Colegio / Instituto</SelectItem>
                  <SelectItem value="amigos">👥 Grupo de amigos</SelectItem>
                  <SelectItem value="otro">✨ Otro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="num_personas"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Nº personas</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    placeholder="Aprox."
                    {...field}
                    className="bg-background/60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fecha_orientativa"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Fecha orientativa</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-background/60" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="consentimiento"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border border-border bg-background/40 p-3">
              <FormControl>
                <Checkbox
                  checked={field.value === true}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-xs font-normal text-muted-foreground">
                  Acepto que <span translate="no">shootandrun</span> contacte
                  conmigo para informarme sobre disponibilidad, packs y reservas.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {status === "error" && (
          <div className="text-sm rounded-md border border-destructive/40 bg-destructive/10 text-destructive p-3">
            Ha ocurrido un error. También puedes{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              escribirnos directamente por WhatsApp
            </a>
            .
          </div>
        )}

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4 mr-2" />
              Contactadme por WhatsApp
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

const Header = () => (
  <div className="mb-4">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-body uppercase tracking-wider mb-3">
      <Zap className="w-3 h-3" />
      Contacto rápido
    </div>
    <h2 className="text-2xl font-display font-bold leading-tight">
      ¿Quieres organizar una partida?
    </h2>
    <p className="text-sm text-muted-foreground mt-2">
      Déjanos tus datos y te contactamos rápido por WhatsApp para ayudarte con
      disponibilidad, packs y reservas.
    </p>
  </div>
);

const LeadCapturePopup = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const disabled = isAdminRoute(location.pathname);
  const { open, setOpen } = useLeadPopupTrigger(!disabled);

  useEffect(() => {
    captureUtmsFromUrl();
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (!next && open) {
      markDismissed();
    }
    setOpen(next);
  };

  if (disabled) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="bg-background border-t border-primary/30 px-4 pb-6 pt-2 max-h-[92vh]">
          <div className="mx-auto w-full max-w-md overflow-y-auto">
            <Header />
            <FormBody onClose={() => handleOpenChange(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="bg-background border border-primary/30 shadow-[0_0_40px_hsl(var(--primary)/0.25)] max-w-md p-6"
        onInteractOutside={() => handleOpenChange(false)}
      >
        <button
          type="button"
          onClick={() => handleOpenChange(false)}
          aria-label="Cerrar"
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <Header />
        <FormBody onClose={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default LeadCapturePopup;
