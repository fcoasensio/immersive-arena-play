import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Festivo = { id: string; fecha: string; nombre: string };

const AdminFestivos = () => {
  const [festivos, setFestivos] = useState<Festivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFecha, setNewFecha] = useState("");
  const [newNombre, setNewNombre] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchFestivos = async () => {
    const { data, error } = await supabase
      .from("festivos")
      .select("*")
      .order("fecha");
    if (error) toast.error("Error cargando festivos");
    else setFestivos((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchFestivos(); }, []);

  const handleAdd = async () => {
    if (!newFecha) return;
    setAdding(true);
    const { error } = await supabase
      .from("festivos")
      .insert({ fecha: newFecha, nombre: newNombre || "Festivo" } as any);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Esa fecha ya existe" : "Error al añadir");
    } else {
      toast.success("Festivo añadido");
      setNewFecha("");
      setNewNombre("");
      fetchFestivos();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("festivos").delete().eq("id", id);
    if (error) toast.error("Error al eliminar");
    else {
      toast.success("Festivo eliminado");
      setFestivos((prev) => prev.filter((f) => f.id !== id));
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-sm text-muted-foreground">
        Define los días festivos del año. Se aplicará el recargo de fin de semana/festivo a estas fechas.
      </p>

      <div className="flex items-end gap-3 p-4 border border-border rounded-xl bg-card">
        <div className="space-y-1 flex-1">
          <Label className="text-xs font-medium">Fecha</Label>
          <Input type="date" value={newFecha} onChange={(e) => setNewFecha(e.target.value)} />
        </div>
        <div className="space-y-1 flex-1">
          <Label className="text-xs font-medium">Nombre (opcional)</Label>
          <Input placeholder="Ej: Día de la Región" value={newNombre} onChange={(e) => setNewNombre(e.target.value)} />
        </div>
        <Button onClick={handleAdd} disabled={!newFecha || adding}>
          {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Añadir
        </Button>
      </div>

      {festivos.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No hay festivos definidos</p>
      ) : (
        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
          {festivos.map((f) => {
            const dateObj = new Date(f.fecha + "T00:00:00");
            return (
              <div key={f.id} className="flex items-center justify-between px-4 py-3 bg-card">
                <div>
                  <span className="text-sm font-medium">{format(dateObj, "EEEE d 'de' MMMM yyyy", { locale: es })}</span>
                  {f.nombre && <span className="text-xs text-muted-foreground ml-2">— {f.nombre}</span>}
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(f.id)} className="text-destructive hover:text-destructive">
                  <Trash2 size={14} />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminFestivos;
