import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X, MessageCircle, Zap, Check, ArrowRight, ArrowLeft } from "lucide-react";
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
  // Paso 1
  nombre: z.string().trim().min(2, "Indica tu nombre").max(100),
  telefono: z
    .string()
    .trim()
    .min(9, "Teléfono obligatorio")
    .max(30)
    .regex(/^[+\d\s().-]{9,30}$/, "Teléfono inválido"),
  email: z.string().trim().email("Email inválido").max(150).optional().or(z.literal("")),
  consentimiento: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar para continuar" }),
  }),
  // Paso 2
  tipo_evento: z.enum(
    ["cumpleanos", "empresa", "despedida", "colegio", "amigos", "otro"],
    { required_error: "Selecciona el tipo de evento" }
  ),
  actividad_interes: z.enum(["laser_tag", "vr", "no_se"]).optional().or(z.literal("")),
  edad_participantes: z.enum(["8_11", "12_mas", "mixto"]).optional().or(z.literal("")),
  num_personas: z.enum(["1_7", "8_15", "16_25", "25_mas", ""]).optional().or(z.literal("")),
  presupuesto: z.enum(["menos_200", "200_400", "mas_400", "no_se", ""]).optional().or(z.literal("")),
  cuando: z.enum(["esta_semana", "este_mes", "1_2_meses", "informandome", ""]).optional().or(z.literal("")),
  fecha_orientativa: z.string().max(20).optional().or(z.literal("")),
  codigo_postal: z.string().max(10).optional().or(z.literal("")),
  como_nos_conociste: z.enum(["google", "instagram", "tiktok", "recomendacion", "otro", ""]).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;
type Status = "idle" | "loading" | "success" | "error";

const isAdminRoute = (pathname: string) =>
  pathname.startsWith("/admin") || pathname.startsWith("/reservar");

const FormBody = ({ onClose }: { onClose: () => void }) => {
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState<1 | 2>(1);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      telefono: "",
      email: "",
      num_personas: "" as any,
      fecha_orientativa: "",
      actividad_interes: "" as any,
      edad_participantes: "" as any,
      presupuesto: "" as any,
      cuando: "" as any,
      codigo_postal: "",
      como_nos_conociste: "" as any,
      consentimiento: false as unknown as true,
    },
  });

  const actividad = form.watch("actividad_interes");
  const edad = form.watch("edad_participantes");
  const showVrAgeWarning = actividad === "vr" && edad === "8_11";

  const onNext = async () => {
    const ok = await form.trigger(["nombre", "telefono", "email", "consentimiento"]);
    if (ok) setStep(2);
  };

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const utms = getAllUtms();
      const { error } = await supabase.functions.invoke("submit-lead-rapido", {
        body: {
          nombre: data.nombre,
          telefono: data.telefono,
          email: data.email || "",
          tipo_evento: data.tipo_evento,
          actividad_interes: data.actividad_interes || "",
          edad_participantes: data.edad_participantes || "",
          num_personas: data.num_personas || "",
          presupuesto: data.presupuesto || "",
          cuando: data.cuando || "",
          fecha_orientativa: data.fecha_orientativa || "",
          codigo_postal: data.codigo_postal || "",
          como_nos_conociste: data.como_nos_conociste || "",
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className={step === 1 ? "text-primary font-semibold" : ""}>1. Contacto</span>
          <ArrowRight className="w-3 h-3" />
          <span className={step === 2 ? "text-primary font-semibold" : ""}>2. Detalles</span>
        </div>

        {step === 1 && (
          <>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-muted-foreground text-xs">(opcional)</span></FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputMode="email"
                      placeholder="tu@email.com"
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

            <Button
              type="button"
              variant="hero"
              size="lg"
              className="w-full"
              onClick={onNext}
            >
              Siguiente <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        )}

        {step === 2 && (
          <>
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
                name="actividad_interes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Actividad</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-background/60">
                          <SelectValue placeholder="¿Cuál?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="laser_tag">🎯 Laser Tag (8+)</SelectItem>
                        <SelectItem value="vr">🥽 Realidad Virtual (12+)</SelectItem>
                        <SelectItem value="no_se">🤔 No lo sé aún</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="edad_participantes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Edad participantes</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-background/60">
                          <SelectValue placeholder="Edad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="8_11">8 - 11 años</SelectItem>
                        <SelectItem value="12_mas">12+ años</SelectItem>
                        <SelectItem value="mixto">Mixto adultos y niños</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showVrAgeWarning && (
              <div className="text-xs rounded-md border border-amber-400/40 bg-amber-400/10 text-amber-300 p-2">
                La Realidad Virtual es a partir de 12 años. Para 8-11 años te recomendamos Laser Tag.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="num_personas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Nº personas</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-background/60">
                          <SelectValue placeholder="Rango" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1_7">1 - 7</SelectItem>
                        <SelectItem value="8_15">8 - 15</SelectItem>
                        <SelectItem value="16_25">16 - 25</SelectItem>
                        <SelectItem value="25_mas">+25</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="presupuesto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Presupuesto</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-background/60">
                          <SelectValue placeholder="Aprox." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="menos_200">&lt; 200€</SelectItem>
                        <SelectItem value="200_400">200 - 400€</SelectItem>
                        <SelectItem value="mas_400">+ 400€</SelectItem>
                        <SelectItem value="no_se">No lo sé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="cuando"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">¿Cuándo?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-background/60">
                          <SelectValue placeholder="Plazo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="esta_semana">Esta semana</SelectItem>
                        <SelectItem value="este_mes">Este mes</SelectItem>
                        <SelectItem value="1_2_meses">1 - 2 meses</SelectItem>
                        <SelectItem value="informandome">Solo informándome</SelectItem>
                      </SelectContent>
                    </Select>
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

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="codigo_postal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">CP <span className="text-muted-foreground">(opcional)</span></FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" placeholder="30820" {...field} className="bg-background/60" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="como_nos_conociste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">¿Cómo nos conociste?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="bg-background/60">
                          <SelectValue placeholder="Origen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="recomendacion">Recomendación</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setStep(1)}
                disabled={status === "loading"}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Atrás
              </Button>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="flex-1"
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
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </>
        )}
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
