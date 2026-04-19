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
import { Loader2, Search, Eye, CalendarClock } from "lucide-react";
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
};

const estadoColors: Record<string, string> = {
  pendiente_pago: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  pago_recibido: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  confirmada: "bg-neon-green/20 text-neon-green border-neon-green/30",
  cancelada: "bg-neon-red/20 text-neon-red border-neon-red/30",
};

const estadoLabels: Record<string, string> = {
  pendiente_pago: "Pendiente pago",
  pago_recibido: "Pago recibido",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
};

const AdminReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [selected, setSelected] = useState<Reserva | null>(null);

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
            </div>
          )}
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
