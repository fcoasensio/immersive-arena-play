import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Eye, CalendarClock, Percent, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Reserva = {
  id: string;
  created_at: string;
  tipo_reserva: string;
  actividad: string;
  estado: string;
  nombre_completo: string;
  telefono: string;
  email: string;
  dni_cif: string;
  direccion: string;
  codigo_postal: string;
  fecha: string;
  hora: string;
  duracion: string;
  num_participantes: number;
  nombre_menor: string | null;
  edad_menor: number | null;
  tematica_invitacion: string | null;
  precio_base: number | null;
  precio_final: number | null;
  anticipo: number | null;
  notas: string | null;
  google_calendar_event_id: string | null;
  score_sospecha?: number | null;
  motivos_sospecha?: string[] | null;
};

const estadoColors: Record<string, string> = {
  pendiente_pago: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  pago_recibido: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  confirmada: "bg-neon-green/20 text-neon-green border-neon-green/30",
  cancelada: "bg-neon-red/20 text-neon-red border-neon-red/30",
  sospechosa: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const estadoLabels: Record<string, string> = {
  pendiente_pago: "Pendiente pago",
  pago_recibido: "Pago recibido",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  sospechosa: "⚠️ Sospechosa",
};

const AdminReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [selected, setSelected] = useState<Reserva | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rescheduling, setRescheduling] = useState(false);
  const [discountValue, setDiscountValue] = useState<string>("");
  const [discountType, setDiscountType] = useState<"eur" | "pct">("eur");
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  const computeDiscountedPrice = (): number | null => {
    if (!selected || selected.precio_base == null) return null;
    const base = Number(selected.precio_base);
    const v = parseFloat(discountValue.replace(",", "."));
    if (isNaN(v) || v < 0) return null;
    const final = discountType === "pct" ? base * (1 - v / 100) : base - v;
    return Math.max(0, Math.round(final * 100) / 100);
  };

  const applyDiscount = async () => {
    if (!selected) return;
    const nuevoPrecio = computeDiscountedPrice();
    if (nuevoPrecio == null) {
      toast.error("Introduce un descuento válido");
      return;
    }
    setApplyingDiscount(true);
    const { error } = await supabase
      .from("reservas")
      .update({ precio_final: nuevoPrecio } as any)
      .eq("id", selected.id);
    setApplyingDiscount(false);
    if (error) {
      console.error(error);
      toast.error("Error aplicando descuento");
      return;
    }
    setReservas((prev) => prev.map((r) => r.id === selected.id ? { ...r, precio_final: nuevoPrecio } : r));
    setSelected({ ...selected, precio_final: nuevoPrecio });
    setDiscountValue("");
    toast.success(`Precio actualizado a ${nuevoPrecio}€`);
  };

  const resetPrecio = async () => {
    if (!selected || selected.precio_base == null) return;
    const base = Number(selected.precio_base);
    // recalcular con recargo: si precio_final original era base + recargo*part, no lo sabemos sin recalcular.
    // Simplificación: restablecer a precio_base.
    setApplyingDiscount(true);
    const { error } = await supabase
      .from("reservas")
      .update({ precio_final: base } as any)
      .eq("id", selected.id);
    setApplyingDiscount(false);
    if (error) { toast.error("Error restableciendo precio"); return; }
    setReservas((prev) => prev.map((r) => r.id === selected.id ? { ...r, precio_final: base } : r));
    setSelected({ ...selected, precio_final: base });
    toast.success("Precio restablecido al base");
  };

  const openReschedule = (r: Reserva) => {
    setSelected(r);
    setNewDate(r.fecha);
    setNewTime(r.hora.slice(0, 5));
    setRescheduleOpen(true);
  };

  const handleReschedule = async () => {
    if (!selected) return;
    if (!newDate || !newTime) {
      toast.error("Indica fecha y hora");
      return;
    }
    if (newDate === selected.fecha && newTime === selected.hora.slice(0, 5)) {
      toast.info("No has cambiado la fecha ni la hora");
      return;
    }

    setRescheduling(true);
    try {
      // 1. Check availability for the new slot (1-min window to avoid blocking other slots)
      const { data: availData, error: availError } = await supabase.functions.invoke(
        "check-calendar-availability",
        { body: { date: newDate, time: newTime, duration: "1" } }
      );
      if (availError) throw availError;
      if (availData && (availData as any).available === false) {
        toast.error("Esa fecha y hora no está disponible");
        setRescheduling(false);
        return;
      }

      const previousDate = selected.fecha;
      const previousTime = selected.hora;
      const previousEventId = selected.google_calendar_event_id;

      // 2. Update DB
      const { error: updateError } = await supabase
        .from("reservas")
        .update({ fecha: newDate, hora: newTime } as any)
        .eq("id", selected.id);
      if (updateError) throw updateError;

      // 3. Update Google Calendar (delete old, create new) if there was an event
      let nextEventId: string | null = previousEventId;
      if (previousEventId) {
        try {
          await supabase.functions.invoke("check-calendar-availability", {
            body: { action: "delete", eventId: previousEventId },
          });
        } catch (e) {
          console.error("Error deleting old calendar event:", e);
        }

        // Clear the old event ID from DB so the create step actually creates a new one
        // (the create endpoint skips creation if the reservation already has an event ID).
        const { error: clearError } = await supabase
          .from("reservas")
          .update({ google_calendar_event_id: null } as any)
          .eq("id", selected.id);
        if (clearError) {
          console.error("Error clearing old calendar event ID:", clearError);
        }
        nextEventId = null;

        try {
          const { data: createData, error: createError } = await supabase.functions.invoke(
            "check-calendar-availability",
            {
              body: {
                action: "create",
                reservationId: selected.id,
                date: newDate,
                time: newTime,
                duration: selected.duracion,
                customerName: selected.nombre_completo,
                customerPhone: selected.telefono,
                customerEmail: selected.email,
                activityType: selected.actividad,
                reservationType: selected.tipo_reserva,
                numberOfPeople: selected.num_participantes,
                notes: selected.notas || undefined,
              },
            }
          );
          if (createError) throw createError;
          nextEventId = (createData as { eventId?: string } | null)?.eventId ?? null;
        } catch (e) {
          console.error("Error creating new calendar event:", e);
          toast.warning("Reserva actualizada, pero no se pudo recrear el evento del calendario");
        }
      }

      // 4. Send notification emails (fire-and-forget)
      supabase.functions.invoke("send-reschedule-notification", {
        body: {
          customerName: selected.nombre_completo,
          customerEmail: selected.email,
          customerPhone: selected.telefono,
          previousDate,
          previousTime,
          newDate,
          newTime,
          numberOfPeople: selected.num_participantes,
          activityType: selected.actividad,
          reservationType: selected.tipo_reserva,
        },
      }).then(({ error: emailError }) => {
        if (emailError) console.error("Error sending reschedule emails:", emailError);
      });

      // 5. Update local state
      const updated = { ...selected, fecha: newDate, hora: newTime, google_calendar_event_id: nextEventId };
      setReservas((prev) => prev.map((r) => r.id === selected.id ? updated : r));
      setSelected(updated);
      setRescheduleOpen(false);
      toast.success("Reserva reprogramada y notificaciones enviadas");
    } catch (e: any) {
      console.error("Error rescheduling:", e);
      toast.error("Error al reprogramar la reserva");
    } finally {
      setRescheduling(false);
    }
  };

  const syncCalendarEvent = async (reserva: Reserva) => {
    const { data, error } = await supabase.functions.invoke("check-calendar-availability", {
      body: {
        action: "create",
        reservationId: reserva.id,
        date: reserva.fecha,
        time: reserva.hora.slice(0, 5),
        duration: reserva.duracion,
        customerName: reserva.nombre_completo,
        customerPhone: reserva.telefono,
        customerEmail: reserva.email,
        activityType: reserva.actividad,
        reservationType: reserva.tipo_reserva,
        numberOfPeople: reserva.num_participantes,
        notes: reserva.notas || undefined,
      },
    });

    if (error) throw error;

    return (data as { eventId?: string } | null)?.eventId ?? null;
  };

  const fetchReservas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reservas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) { toast.error("Error cargando reservas"); console.error(error); }
    else setReservas((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchReservas(); }, []);

  const updateEstado = async (id: string, estado: string) => {
    const reserva = reservas.find((r) => r.id === id);
    if (!reserva) return;

    const previousEstado = reserva.estado;
    let nextCalendarEventId = reserva.google_calendar_event_id;

    const { error } = await supabase
      .from("reservas")
      .update({ estado } as any)
      .eq("id", id);

    if (error) { toast.error("Error actualizando estado"); return; }

    // Send status change notification emails
    supabase.functions.invoke("send-status-change-notification", {
      body: {
        customerName: reserva.nombre_completo,
        customerEmail: reserva.email,
        customerPhone: reserva.telefono,
        reservationDate: reserva.fecha,
        reservationTime: reserva.hora,
        numberOfPeople: reserva.num_participantes,
        activityType: reserva.actividad,
        reservationType: reserva.tipo_reserva,
        duration: reserva.duracion,
        priceFinal: reserva.precio_final,
        newStatus: estado,
        previousStatus: previousEstado,
      },
    }).then(({ error: emailError }) => {
      if (emailError) console.error("Error sending status change email:", emailError);
    });

    if (estado === "confirmada" && !reserva.google_calendar_event_id) {
      try {
        nextCalendarEventId = await syncCalendarEvent(reserva);
        toast.success("Estado actualizado y evento creado en Google Calendar");
      } catch (calendarError) {
        console.error("Error creating calendar event on confirmation:", calendarError);
        toast.warning("Estado actualizado, pero no se pudo sincronizar con Google Calendar");
      }
    }

    // If cancelling and there's a calendar event, delete it
    if (estado === "cancelada" && reserva?.google_calendar_event_id) {
      const { error: calError } = await supabase.functions.invoke("check-calendar-availability", {
        body: { action: "delete", eventId: reserva.google_calendar_event_id },
      });

      if (calError) {
        console.error("Error deleting calendar event:", calError);
        toast.warning("Reserva cancelada, pero no se pudo eliminar del calendario");
      } else {
        await supabase.from("reservas").update({ google_calendar_event_id: null } as any).eq("id", id);
        nextCalendarEventId = null;
        toast.success("Estado actualizado y evento eliminado del calendario");
      }
    } else if (!(estado === "confirmada" && !reserva.google_calendar_event_id)) {
      toast.success("Estado actualizado");
    }

    setReservas((prev) => prev.map((r) => r.id === id ? { ...r, estado, google_calendar_event_id: nextCalendarEventId } : r));
    if (selected?.id === id) setSelected({ ...selected, estado, google_calendar_event_id: nextCalendarEventId });
  };

  const filtered = reservas.filter((r) => {
    const matchSearch = !search || 
      r.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.telefono.includes(search);
    const matchEstado = filterEstado === "all" || r.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="sospechosa">⚠️ Sospechosas</SelectItem>
            <SelectItem value="pendiente_pago">Pendiente pago</SelectItem>
            <SelectItem value="pago_recibido">Pago recibido</SelectItem>
            <SelectItem value="confirmada">Confirmada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">{filtered.length} reserva(s)</div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Actividad</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Part.</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.fecha}</TableCell>
                <TableCell className="font-mono text-xs">{r.hora}</TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{r.nombre_completo}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {r.actividad === "laser_tag" ? "Láser Tag" : "VR"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs capitalize">{r.tipo_reserva.replace("_", " ")}</TableCell>
                <TableCell className="text-center">{r.num_participantes}</TableCell>
                <TableCell className="font-mono text-sm">{r.precio_final}€</TableCell>
                <TableCell>
                  <Select value={r.estado} onValueChange={(v) => updateEstado(r.id, v)}>
                    <SelectTrigger className="h-7 text-xs w-36 border-0 p-0">
                      <Badge className={`${estadoColors[r.estado]} border text-xs`}>
                        {estadoLabels[r.estado]}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(estadoLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => setSelected(r)}>
                    <Eye size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No hay reservas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Detalle de Reserva</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Cliente" value={selected.nombre_completo} />
              <Detail label="Teléfono" value={selected.telefono} />
              <Detail label="Email" value={selected.email} full />
              <Detail label="DNI/CIF" value={selected.dni_cif} />
              <Detail label="Dirección" value={`${selected.direccion}, ${selected.codigo_postal}`} />
              <Detail label="Fecha" value={selected.fecha} />
              <Detail label="Hora" value={selected.hora} />
              <Detail label="Duración" value={`${selected.duracion} min`} />
              <Detail label="Actividad" value={selected.actividad === "laser_tag" ? "Láser Tag" : "Realidad Virtual"} />
              <Detail label="Tipo" value={selected.tipo_reserva} />
              <Detail label="Participantes" value={String(selected.num_participantes)} />
              <Detail label="Precio base" value={`${selected.precio_base}€`} />
              <Detail label="Precio final" value={`${selected.precio_final}€`} />
              <Detail label="Anticipo" value={`${selected.anticipo}€`} />
              {selected.nombre_menor && <Detail label="Menor" value={`${selected.nombre_menor} (${selected.edad_menor} años)`} full />}
              {selected.tematica_invitacion && <Detail label="Temática" value={selected.tematica_invitacion} full />}
              {selected.notas && <Detail label="Notas" value={selected.notas} full />}
              {selected.estado === "sospechosa" && (
                <div className="col-span-2 p-3 rounded-md border border-orange-500/40 bg-orange-500/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                      ⚠️ Reserva sospechosa · score {selected.score_sospecha ?? 0}/100
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-orange-500/40 text-orange-300 hover:bg-orange-500/10"
                      onClick={() => updateEstado(selected.id, "pendiente_pago")}
                    >
                      Aprobar
                    </Button>
                  </div>
                  {selected.motivos_sospecha && selected.motivos_sospecha.length > 0 && (
                    <ul className="text-xs text-orange-200/90 list-disc pl-5 space-y-0.5">
                      {selected.motivos_sospecha.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    No se ha enviado email al cliente ni evento al calendario. Aprueba si es válida o cambia el estado a "Cancelada" para descartarla.
                  </p>
                </div>
              )}
              <div className="col-span-2 pt-2">
                <span className="text-muted-foreground text-xs">Estado:</span>
                <Select value={selected.estado} onValueChange={(v) => updateEstado(selected.id, v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(estadoLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => openReschedule(selected)}
                >
                  <CalendarClock size={16} /> Cambiar fecha u hora
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <CalendarClock size={18} /> Cambiar fecha u hora
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Cliente: <span className="font-medium text-foreground">{selected.nombre_completo}</span>
              </div>
              <div className="text-xs p-3 rounded-md bg-muted">
                Actual: <span className="font-mono">{selected.fecha} · {selected.hora.slice(0, 5)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="new-date" className="text-xs">Nueva fecha</Label>
                  <Input
                    id="new-date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="new-time" className="text-xs">Nueva hora</Label>
                  <Input
                    id="new-time"
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Se actualizará la reserva, se reprogramará el evento del calendario (si existe) y se enviará un email de confirmación al cliente y al administrador.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRescheduleOpen(false)} disabled={rescheduling}>
              Cancelar
            </Button>
            <Button onClick={handleReschedule} disabled={rescheduling}>
              {rescheduling ? <><Loader2 size={14} className="animate-spin mr-1" /> Procesando...</> : "Confirmar cambio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Detail = ({ label, value, full }: { label: string; value: string; full?: boolean }) => (
  <div className={full ? "col-span-2" : ""}>
    <div className="text-muted-foreground text-xs">{label}</div>
    <div className="font-medium">{value}</div>
  </div>
);

export default AdminReservas;
