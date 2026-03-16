import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addHours, format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Crosshair, Glasses, PartyPopper, Users, Wine,
  ArrowLeft, ArrowRight, Loader2, CheckCircle2, CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useConfiguracion, type ConfigValues } from "@/hooks/useConfiguracion";

const tipoOptions = [
  { value: "cumpleanos", label: "Cumpleaños", icon: PartyPopper, desc: "El cumple más épico" },
  { value: "grupos", label: "Grupos / Amigos", icon: Users, desc: "Acción con tu grupo" },
  { value: "despedida", label: "Despedida", icon: Wine, desc: "Despedida inolvidable" },
] as const;

const actividadOptions = [
  { value: "laser_tag", label: "Láser Tag", icon: Crosshair, desc: "Combates tácticos en 1200m²" },
  { value: "realidad_virtual", label: "Realidad Virtual", icon: Glasses, desc: "Free roam multijugador" },
] as const;

function calcularPrecio(
  fecha: Date | undefined,
  duracion: string,
  numParticipantes: number,
  config: ConfigValues,
  festivos: string[]
): { base: number; final: number; recargo: number } {
  let precioBase = config.precio_90min;
  if (duracion === "270") precioBase = config.precio_270min;
  else if (duracion === "150") precioBase = config.precio_150min;

  let recargo = 0;

  if (fecha) {
    const dia = fecha.getDay();
    const fechaStr = format(fecha, "yyyy-MM-dd");
    const esFestivo = festivos.includes(fechaStr);
    if (dia === 6 || dia === 0 || esFestivo) {
      recargo = config.recargo_finde_festivo;
    }
  }

  const base = precioBase * numParticipantes;
  const final_ = base + recargo * numParticipantes;
  return { base, final: final_, recargo };
}

function getDuracion(tipo: string, _actividad: string): "90" | "150" {
  return tipo === "cumpleanos" ? "150" : "90";
}

function getMaxParticipantes(actividad: string, config: ConfigValues): number {
  if (actividad === "realidad_virtual") return config.max_participantes_realidad_virtual;
  
  return config.max_participantes_laser_tag;
}

function buildSchema(config: ConfigValues) {
  const minDate = addHours(new Date(), config.antelacion_horas);
  return {
    minDate,
    schema: z.object({
      tipo_reserva: z.enum(["cumpleanos", "grupos", "despedida"]),
      actividad: z.enum(["laser_tag", "realidad_virtual"]),
      nombre_completo: z.string().trim().min(2, "Nombre requerido").max(200),
      telefono: z.string().trim().min(9, "Teléfono inválido").max(15),
      email: z.string().trim().email("Email inválido"),
      dni_cif: z.string().trim().min(8, "DNI/CIF requerido").max(20),
      direccion: z.string().trim().min(5, "Dirección requerida").max(300),
      codigo_postal: z.string().trim().min(4, "Código postal requerido").max(10),
      fecha: z.date({ required_error: "Selecciona una fecha" }).refine(
        (d) => d >= minDate, `La reserva debe hacerse con al menos ${config.antelacion_horas}h de antelación`
      ),
      hora: z.string().min(1, "Selecciona una hora"),
      duracion: z.enum(["90", "150", "270"]),
      num_participantes: z.number()
        .min(config.min_participantes, `Mínimo ${config.min_participantes} participantes`),
      nombre_menor: z.string().optional(),
      edad_menor: z.number().optional(),
      tematica_invitacion: z.string().optional(),
      notas: z.string().max(500).optional(),
    }).refine((data) => {
      if (data.tipo_reserva === "cumpleanos") {
        return !!data.nombre_menor && !!data.edad_menor;
      }
      return true;
    }, { message: "Datos del menor requeridos para cumpleaños", path: ["nombre_menor"] })
    .refine((data) => {
      if (data.tipo_reserva === "cumpleanos" && data.edad_menor) {
        if (data.actividad === "realidad_virtual") return data.edad_menor >= 12;
        if (data.actividad === "laser_tag") return data.edad_menor >= 8;
      }
      return true;
    }, { message: "Edad mínima: 8 años para Láser Tag, 12 años para Realidad Virtual", path: ["edad_menor"] }),
  };
}

type ReservaValues = z.infer<ReturnType<typeof buildSchema>["schema"]>;

const STEPS = ["Tipo y Actividad", "Fecha y Hora", "Datos personales", "Confirmar"];

const ReservaForm = () => {
  const { config, loading: configLoading } = useConfiguracion();
  const { minDate, schema } = buildSchema(config);

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [festivos, setFestivos] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("festivos").select("fecha").then(({ data }) => {
      if (data) setFestivos(data.map((d: any) => d.fecha));
    });
  }, []);

  const form = useForm<ReservaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo_reserva: "grupos",
      actividad: "laser_tag",
      duracion: "90",
      num_participantes: 10,
      nombre_completo: "",
      telefono: "",
      email: "",
      dni_cif: "",
      direccion: "",
      codigo_postal: "",
      hora: "",
      notas: "",
      nombre_menor: "",
      tematica_invitacion: "",
    },
  });

  const watchAll = form.watch();
  const precio = calcularPrecio(watchAll.fecha, watchAll.duracion, watchAll.num_participantes || 10, config, festivos);

  const canAdvance = async () => {
    if (step === 0) return true;
    if (step === 1) {
      return await form.trigger(["fecha", "hora", "duracion", "num_participantes"]);
    }
    if (step === 2) {
      const fields: (keyof ReservaValues)[] = ["nombre_completo", "telefono", "email", "dni_cif", "direccion", "codigo_postal"];
      if (watchAll.tipo_reserva === "cumpleanos") fields.push("nombre_menor", "edad_menor");
      return await form.trigger(fields);
    }
    return true;
  };

  const next = async () => {
    if (await canAdvance()) setStep((s) => Math.min(s + 1, 3));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: ReservaValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("reservas").insert({
        tipo_reserva: data.tipo_reserva,
        actividad: data.actividad,
        nombre_completo: data.nombre_completo,
        telefono: data.telefono,
        email: data.email,
        dni_cif: data.dni_cif,
        direccion: data.direccion,
        codigo_postal: data.codigo_postal,
        fecha: format(data.fecha, "yyyy-MM-dd"),
        hora: data.hora,
        duracion: data.duracion,
        num_participantes: data.num_participantes,
        nombre_menor: data.nombre_menor || null,
        edad_menor: data.edad_menor || null,
        tematica_invitacion: data.tematica_invitacion || null,
        precio_base: precio.base,
        precio_final: precio.final,
        anticipo: config.anticipo,
        notas: data.notas || null,
      } as any);

      if (error) throw error;

      // Send email notifications via Resend edge function
      const tipoLabel = tipoOptions.find(t => t.value === data.tipo_reserva)?.label || data.tipo_reserva;
      const actLabel = actividadOptions.find(a => a.value === data.actividad)?.label || data.actividad;

      const { error: emailError } = await supabase.functions.invoke("send-reservation-notification", {
        body: {
          customerName: data.nombre_completo,
          customerEmail: data.email,
          customerPhone: data.telefono,
          reservationDate: format(data.fecha, "yyyy-MM-dd"),
          reservationTime: data.hora,
          numberOfPeople: data.num_participantes,
          activityType: data.actividad === "realidad_virtual" ? "vr" : "laser_tag",
          eventType: data.tipo_reserva === "cumpleanos" ? "birthday" : data.tipo_reserva === "despedida" ? "other" : "casual",
          extras: [],
          specialRequests: data.notas || undefined,
          videoInvitationTheme: data.tematica_invitacion || undefined,
        },
      });

      if (emailError) {
        console.error("Error sending email notification:", emailError);
        // Don't fail the reservation if email fails
      }

      setSubmitted(true);
      toast.success("¡Reserva registrada! Te hemos enviado un email de confirmación.");
    } catch (e: any) {
      console.error(e);
      toast.error("Error al enviar la reserva. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (configLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-6"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center">
          <CheckCircle2 size={40} className="text-primary-foreground" />
        </div>
        <h3 className="font-display text-2xl font-bold">¡Reserva Registrada!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Te hemos enviado un email de confirmación con los detalles de tu reserva. Nos pondremos en contacto contigo para confirmar y gestionar el anticipo de <span className="text-primary font-bold">{config.anticipo}€</span>.
        </p>
        <p className="text-sm text-muted-foreground">
          Si no recibes el email, revisa tu carpeta de spam.
        </p>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-1.5 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
              <span className={`text-[10px] font-medium hidden sm:block ${
                i <= step ? "text-primary" : "text-muted-foreground"
              }`}>{s}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* STEP 0: Tipo y Actividad */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold mb-3">¿Qué tipo de evento?</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {tipoOptions.map((opt) => {
                      const selected = watchAll.tipo_reserva === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            form.setValue("tipo_reserva", opt.value);
                            form.setValue("duracion", getDuracion(opt.value, form.getValues("actividad")));
                          }}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            selected
                              ? "border-primary bg-primary/10 box-glow-blue"
                              : "border-border bg-card hover:border-muted-foreground"
                          }`}
                        >
                          <opt.icon size={28} className={`mx-auto mb-2 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                          <div className={`font-display text-sm font-bold ${selected ? "text-primary" : "text-foreground"}`}>{opt.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-1">{opt.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold mb-3">¿Qué actividad?</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {actividadOptions.map((opt) => {
                      const selected = watchAll.actividad === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            form.setValue("actividad", opt.value);
                            form.setValue("duracion", getDuracion(form.getValues("tipo_reserva"), opt.value));
                            const newMax = getMaxParticipantes(opt.value, config);
                            const current = form.getValues("num_participantes");
                            if (current > newMax) form.setValue("num_participantes", newMax);
                          }}
                          className={`p-5 rounded-xl border-2 transition-all text-center ${
                            selected
                              ? "border-primary bg-primary/10 box-glow-blue"
                              : "border-border bg-card hover:border-muted-foreground"
                          }`}
                        >
                          <opt.icon size={32} className={`mx-auto mb-2 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                          <div className={`font-display text-base font-bold ${selected ? "text-primary" : "text-foreground"}`}>{opt.label}</div>
                          <div className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{opt.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Fecha y hora */}
            {step === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-display text-lg font-bold">Fecha</FormLabel>
                      <div className="flex justify-center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < minDate}
                          locale={es}
                          className="rounded-xl border border-border bg-card"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hora"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecciona hora" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {config.horas_disponibles.map((h) => (
                              <SelectItem key={h} value={h}>{h}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Duración</FormLabel>
                    <div className="h-10 px-3 flex items-center rounded-md border border-border bg-muted text-sm text-foreground">
                      {watchAll.duracion === "270"
                        ? `270 min — ${config.precio_270min}€/pers`
                        : watchAll.duracion === "150"
                          ? `150 min — ${config.precio_150min}€/pers`
                          : `90 min — ${config.precio_90min}€/pers`}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {watchAll.tipo_reserva === "cumpleanos"
                          ? "Los cumpleaños incluyen 150 min"
                          : "Duración estándar de 90 min"}
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="num_participantes"
                  render={({ field }) => {
                    const maxP = getMaxParticipantes(watchAll.actividad, config);
                    return (
                      <FormItem>
                        <FormLabel>Nº de participantes ({field.value})</FormLabel>
                        <FormControl>
                          <input
                            type="range"
                            min={config.min_participantes}
                            max={maxP}
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-full accent-[hsl(var(--primary))]"
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{config.min_participantes}</span><span>{maxP}</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Price preview */}
                {watchAll.fecha && (
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Precio estimado</span>
                      <span className="font-display font-bold text-primary">{precio.final.toFixed(2)}€</span>
                    </div>
                    {precio.recargo > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        +{precio.recargo}€/jugador recargo fin de semana / festivo
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Anticipo requerido: <span className="text-primary font-semibold">{config.anticipo}€</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Datos personales */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-display text-lg font-bold">Datos de contacto y facturación</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="nombre_completo" render={({ field }) => (
                    <FormItem><FormLabel>Nombre completo</FormLabel><FormControl><Input placeholder="Juan Pérez" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="telefono" render={({ field }) => (
                    <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input type="tel" placeholder="600 000 000" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="tu@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="dni_cif" render={({ field }) => (
                    <FormItem><FormLabel>DNI / CIF</FormLabel><FormControl><Input placeholder="12345678A" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="direccion" render={({ field }) => (
                    <FormItem className="sm:col-span-2"><FormLabel>Dirección</FormLabel><FormControl><Input placeholder="Calle Mayor 1, Murcia" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="codigo_postal" render={({ field }) => (
                  <FormItem className="max-w-[160px]"><FormLabel>Código Postal</FormLabel><FormControl><Input placeholder="30001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                {watchAll.tipo_reserva === "cumpleanos" && (
                  <div className="border-t border-border pt-5 space-y-4">
                    <h4 className="font-display text-base font-bold text-primary">Datos del cumpleañero/a</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="nombre_menor" render={({ field }) => (
                        <FormItem><FormLabel>Nombre del menor</FormLabel><FormControl><Input placeholder="Pablo" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="edad_menor" render={({ field }) => {
                        const minEdad = watchAll.actividad === "realidad_virtual" ? 12 : 8;
                        return (
                          <FormItem>
                            <FormLabel>Edad {watchAll.actividad === "realidad_virtual" ? <span className="text-xs text-muted-foreground">(mín. 12 años para RV)</span> : <span className="text-xs text-muted-foreground">(mín. 8 años para Láser Tag)</span>}</FormLabel>
                            <FormControl><Input type="number" min={minEdad} max={17} placeholder={String(minEdad)} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }} />
                    </div>
                    <FormField control={form.control} name="tematica_invitacion" render={({ field }) => (
                      <FormItem><FormLabel>Temática invitación (opcional)</FormLabel><FormControl><Input placeholder="Militar, Sci-Fi, Neón..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                )}

                <FormField control={form.control} name="notas" render={({ field }) => (
                  <FormItem><FormLabel>Notas adicionales (opcional)</FormLabel><FormControl><Textarea placeholder="Algún detalle que debamos saber..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            )}

            {/* STEP 3: Confirmar */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="font-display text-lg font-bold">Resumen de tu reserva</h3>
                <div className="bg-card border border-border rounded-xl divide-y divide-border">
                  <Row label="Tipo" value={tipoOptions.find(t => t.value === watchAll.tipo_reserva)?.label || ""} />
                  <Row label="Actividad" value={actividadOptions.find(a => a.value === watchAll.actividad)?.label || ""} />
                  <Row label="Fecha" value={watchAll.fecha ? format(watchAll.fecha, "EEEE d 'de' MMMM yyyy", { locale: es }) : ""} />
                  <Row label="Hora" value={watchAll.hora} />
                  <Row label="Duración" value={`${watchAll.duracion} min`} />
                  <Row label="Participantes" value={String(watchAll.num_participantes)} />
                  <Row label="Precio total" value={`${precio.final.toFixed(2)}€`} highlight />
                  <Row label="Anticipo (Bizum/Transferencia)" value={`${config.anticipo}€`} highlight />
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
                  <CreditCard size={20} className="text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Pago por Bizum o transferencia</p>
                    <p className="text-muted-foreground mt-1">
                      Tras enviar la reserva recibirás un email con los datos para realizar el anticipo de {config.anticipo}€. La reserva se confirma al recibir el pago.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={prev} className="flex-1">
              <ArrowLeft size={16} /> Anterior
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" onClick={next} className="flex-1 font-display tracking-wide">
              Siguiente <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 font-display tracking-wide h-12"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={18} />}
              {isSubmitting ? "Enviando..." : "Confirmar Reserva"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-primary font-display font-bold" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

export default ReservaForm;
