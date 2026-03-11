import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Loader2, Plus, Trash2, CalendarX } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Holiday {
  id: string;
  date: string;
  reason: string | null;
  created_at: string;
}

const AdminHolidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchHolidays = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('holidays')
      .select('*')
      .order('date', { ascending: true });

    if (error) toast.error('Error al cargar festivos');
    else setHolidays((data as Holiday[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchHolidays(); }, []);

  const addHoliday = async () => {
    if (!selectedDate) return toast.error('Selecciona una fecha');
    setAdding(true);

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const { error } = await supabase.from('holidays').insert({
      date: dateStr,
      reason: reason.trim() || null,
    });

    if (error) {
      if (error.code === '23505') toast.error('Esta fecha ya está bloqueada');
      else toast.error('Error al añadir festivo');
    } else {
      toast.success('Fecha bloqueada');
      setSelectedDate(undefined);
      setReason('');
      fetchHolidays();
    }
    setAdding(false);
  };

  const removeHoliday = async (id: string) => {
    const { error } = await supabase.from('holidays').delete().eq('id', id);
    if (error) toast.error('Error al eliminar');
    else {
      toast.success('Fecha desbloqueada');
      fetchHolidays();
    }
  };

  const holidayDates = holidays.map(h => new Date(h.date + 'T00:00:00'));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-bold text-foreground">Días Festivos / Bloqueados</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add holiday */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Añadir fecha bloqueada</h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                modifiers={{ holiday: holidayDates }}
                modifiersStyles={{ holiday: { backgroundColor: 'hsl(0 100% 60% / 0.2)', color: 'hsl(0 100% 60%)' } }}
                locale={es}
              />
            </div>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motivo (opcional)"
              className="bg-background/50"
            />
            <Button onClick={addHoliday} disabled={adding || !selectedDate} className="w-full">
              {adding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Bloquear fecha
            </Button>
          </CardContent>
        </Card>

        {/* Holiday list */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Fechas bloqueadas</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : holidays.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                <CalendarX className="w-8 h-8" />
                <p>No hay fechas bloqueadas</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {holidays.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {format(new Date(h.date + 'T00:00:00'), "EEEE d 'de' MMMM yyyy", { locale: es })}
                      </p>
                      {h.reason && <p className="text-xs text-muted-foreground">{h.reason}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeHoliday(h.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHolidays;
