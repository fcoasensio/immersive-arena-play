import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Eye, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  number_of_people: number;
  activity_type: string;
  event_type: string;
  extras: string[];
  video_invitation_theme: string | null;
  special_requests: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const activityLabels: Record<string, string> = {
  laser_tag: 'Laser Tag',
  vr: 'Realidad Virtual',
  both: 'Laser Tag + VR',
};

const eventLabels: Record<string, string> = {
  casual: 'Visita casual',
  birthday: 'Cumpleaños',
  corporate: 'Centro educativo',
  team_building: 'Team Building',
  other: 'Otro',
};

const extrasLabels: Record<string, string> = {
  snacks: 'Snacks y bebidas',
  photos: 'Sesión de fotos',
  private_session: 'Sesión privada',
  diploma: 'Diploma para ganador',
  video_invitation: 'Videoinvitación',
};

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchReservations = async () => {
    setLoading(true);
    let query = supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: false });

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;
    if (error) {
      toast.error('Error al cargar reservas');
    } else {
      setReservations((data as Reservation[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, [filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Error al actualizar estado');
    } else {
      toast.success('Estado actualizado');
      fetchReservations();
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  };

  const saveNotes = async (id: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ admin_notes: adminNotes })
      .eq('id', id);

    if (error) {
      toast.error('Error al guardar notas');
    } else {
      toast.success('Notas guardadas');
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm('¿Eliminar esta reserva?')) return;
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (error) {
      toast.error('Error al eliminar');
    } else {
      toast.success('Reserva eliminada');
      setSelected(null);
      fetchReservations();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-display font-bold text-foreground">Reservas</h2>
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px] bg-background/50">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="confirmed">Confirmadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchReservations}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : reservations.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay reservas {filterStatus !== 'all' ? `con estado "${statusLabels[filterStatus]}"` : ''}.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {reservations.map((r) => (
            <Card key={r.id} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-foreground">{r.customer_name}</span>
                      <Badge className={statusColors[r.status] || ''} variant="outline">
                        {statusLabels[r.status] || r.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(r.reservation_date), "d 'de' MMMM yyyy", { locale: es })} • {r.reservation_time} • {r.number_of_people} personas
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activityLabels[r.activity_type]} — {eventLabels[r.event_type]}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setSelected(r); setAdminNotes(r.admin_notes || ''); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteReservation(r.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Detalle de Reserva</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider">Nombre</span>
                  <span className="text-foreground">{selected.customer_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider">Teléfono</span>
                  <a href={`tel:${selected.customer_phone}`} className="text-primary">{selected.customer_phone}</a>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider">Email</span>
                  <a href={`mailto:${selected.customer_email}`} className="text-primary">{selected.customer_email}</a>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider">Fecha</span>
                  <span className="text-foreground">{format(new Date(selected.reservation_date), "d MMM yyyy", { locale: es })}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider">Hora</span>
                  <span className="text-foreground">{selected.reservation_time}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider">Personas</span>
                  <span className="text-foreground">{selected.number_of_people}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider">Actividad</span>
                  <span className="text-foreground">{activityLabels[selected.activity_type]}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider">Evento</span>
                  <span className="text-foreground">{eventLabels[selected.event_type]}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider">Extras</span>
                  <span className="text-foreground">{selected.extras?.map(e => extrasLabels[e] || e).join(', ') || 'Ninguno'}</span>
                </div>
                {selected.video_invitation_theme && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Temática videoinvitación</span>
                    <span className="text-foreground">{selected.video_invitation_theme}</span>
                  </div>
                )}
                {selected.special_requests && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Peticiones especiales</span>
                    <span className="text-foreground">{selected.special_requests}</span>
                  </div>
                )}
              </div>

              {/* Status change */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Estado</span>
                <Select value={selected.status} onValueChange={(val) => updateStatus(selected.id, val)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin notes */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Notas internas</span>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notas del administrador..."
                  className="bg-background/50 min-h-[80px]"
                />
                <Button size="sm" onClick={() => saveNotes(selected.id)}>Guardar notas</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReservations;
