import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

type ConfigItem = {
  id: string;
  clave: string;
  valor: string;
  descripcion: string | null;
};

const configLabels: Record<string, string> = {
  precio_90min: "Precio 90 min (€/persona)",
  precio_150min: "Precio 150 min (€/persona)",
  precio_cumpleanos: "Precio Cumpleaños (€/persona)",
  precio_despedida: "Precio Despedidas (€/persona)",
  recargo_finde_festivo: "Recargo finde/festivo (€/jugador)",
  min_participantes: "Mín. participantes",
  max_participantes: "Máx. participantes (general)",
  max_participantes_laser_tag: "Máx. participantes Láser Tag",
  max_participantes_realidad_virtual: "Máx. participantes Realidad Virtual",
  anticipo: "Anticipo (€)",
  antelacion_horas: "Antelación mínima (horas)",
  horas_disponibles: "Horarios disponibles (JSON)",
};

const AdminConfiguracion = () => {
  const [items, setItems] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("configuracion")
        .select("*")
        .order("clave");

      if (error) { toast.error("Error cargando configuración"); console.error(error); }
      else {
        const mapped = (data || []).map((d: any) => ({
          id: d.id,
          clave: d.clave,
          valor: typeof d.valor === "string" ? d.valor : JSON.stringify(d.valor),
          descripcion: d.descripcion,
        }));
        setItems(mapped);
        const initial: Record<string, string> = {};
        mapped.forEach((m) => { initial[m.clave] = m.valor; });
        setEdits(initial);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async (item: ConfigItem) => {
    const newVal = edits[item.clave];
    if (newVal === item.valor) return;

    setSaving(item.clave);
    try {
      let jsonVal: any;
      try { jsonVal = JSON.parse(newVal); } catch { jsonVal = newVal; }

      const { error } = await supabase
        .from("configuracion")
        .update({ valor: jsonVal, updated_at: new Date().toISOString() } as any)
        .eq("id", item.id);

      if (error) throw error;
      toast.success(`${configLabels[item.clave] || item.clave} actualizado`);
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, valor: newVal } : i));
    } catch (err: any) {
      toast.error("Error guardando");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="max-w-2xl space-y-1">
      <p className="text-sm text-muted-foreground mb-6">
        Modifica los parámetros de las reservas. Los cambios se aplicarán a las nuevas reservas.
      </p>

      {items.map((item) => {
        const changed = edits[item.clave] !== item.valor;
        return (
          <div key={item.id} className="flex items-end gap-3 py-3 border-b border-border">
            <div className="flex-1 space-y-1">
              <Label className="text-xs font-medium">
                {configLabels[item.clave] || item.clave}
              </Label>
              {item.descripcion && (
                <p className="text-[11px] text-muted-foreground">{item.descripcion}</p>
              )}
              <Input
                value={edits[item.clave] ?? ""}
                onChange={(e) => setEdits((p) => ({ ...p, [item.clave]: e.target.value }))}
                className="font-mono text-sm"
              />
            </div>
            <Button
              size="sm"
              variant={changed ? "default" : "outline"}
              disabled={!changed || saving === item.clave}
              onClick={() => handleSave(item)}
            >
              {saving === item.clave ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default AdminConfiguracion;
