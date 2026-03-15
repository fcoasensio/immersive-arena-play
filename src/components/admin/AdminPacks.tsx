import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Save, Trash2, GripVertical } from "lucide-react";

type Pack = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  duracion: string;
  jugadores: string;
  icono: string;
  caracteristicas: string[];
  popular: boolean;
  color: string;
  orden: number;
  activo: boolean;
};

const ICON_OPTIONS = ["Star", "PartyPopper", "Wine", "Users", "Zap", "Gift", "Trophy", "Target"];
const COLOR_OPTIONS = ["neon-blue", "neon-purple"];

const AdminPacks = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Pack, "id">>({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
    jugadores: "",
    icono: "Star",
    caracteristicas: [],
    popular: false,
    color: "neon-blue",
    orden: 0,
    activo: true,
  });
  const [featuresText, setFeaturesText] = useState("");

  const fetchPacks = async () => {
    const { data, error } = await supabase
      .from("packs")
      .select("*")
      .order("orden");

    if (error) {
      toast.error("Error cargando packs");
      console.error(error);
    } else {
      const mapped = (data || []).map((d: any) => ({
        id: d.id,
        nombre: d.nombre,
        descripcion: d.descripcion,
        precio: d.precio,
        duracion: d.duracion,
        jugadores: d.jugadores,
        icono: d.icono,
        caracteristicas: Array.isArray(d.caracteristicas) ? d.caracteristicas : [],
        popular: d.popular,
        color: d.color,
        orden: d.orden,
        activo: d.activo,
      }));
      setPacks(mapped);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPacks(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      nombre: "", descripcion: "", precio: "", duracion: "", jugadores: "",
      icono: "Star", caracteristicas: [], popular: false, color: "neon-blue",
      orden: packs.length, activo: true,
    });
    setFeaturesText("");
  };

  const startEdit = (pack: Pack) => {
    setEditingId(pack.id);
    setForm({
      nombre: pack.nombre,
      descripcion: pack.descripcion,
      precio: pack.precio,
      duracion: pack.duracion,
      jugadores: pack.jugadores,
      icono: pack.icono,
      caracteristicas: pack.caracteristicas,
      popular: pack.popular,
      color: pack.color,
      orden: pack.orden,
      activo: pack.activo,
    });
    setFeaturesText(pack.caracteristicas.join("\n"));
  };

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.precio.trim()) {
      toast.error("Nombre y precio son obligatorios");
      return;
    }

    const features = featuresText.split("\n").map(f => f.trim()).filter(Boolean);
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: form.precio.trim(),
      duracion: form.duracion.trim(),
      jugadores: form.jugadores.trim(),
      icono: form.icono,
      caracteristicas: features as any,
      popular: form.popular,
      color: form.color,
      orden: form.orden,
      activo: form.activo,
      updated_at: new Date().toISOString(),
    };

    setSaving(editingId || "new");

    try {
      if (editingId) {
        const { error } = await supabase.from("packs").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Pack actualizado");
      } else {
        const { error } = await supabase.from("packs").insert(payload);
        if (error) throw error;
        toast.success("Pack creado");
      }
      resetForm();
      await fetchPacks();
    } catch (err: any) {
      toast.error("Error guardando pack");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este pack?")) return;
    setSaving(id);
    try {
      const { error } = await supabase.from("packs").delete().eq("id", id);
      if (error) throw error;
      toast.success("Pack eliminado");
      if (editingId === id) resetForm();
      await fetchPacks();
    } catch (err: any) {
      toast.error("Error eliminando");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="max-w-4xl space-y-6">
      <p className="text-sm text-muted-foreground">
        Gestiona los packs que se muestran en la web. Las características van una por línea.
      </p>

      {/* Pack list */}
      <div className="space-y-2">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              editingId === pack.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50"
            }`}
            onClick={() => startEdit(pack)}
          >
            <GripVertical size={16} className="text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{pack.nombre}</span>
                {pack.popular && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Popular</span>}
                {!pack.activo && <span className="text-[10px] bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">Inactivo</span>}
              </div>
              <span className="text-xs text-muted-foreground">{pack.precio} · {pack.duracion} · {pack.caracteristicas.length} características</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); handleDelete(pack.id); }}
              disabled={saving === pack.id}
            >
              {saving === pack.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} className="text-destructive" />}
            </Button>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="border border-border rounded-lg p-5 bg-card space-y-4">
        <h3 className="font-display text-sm font-semibold">
          {editingId ? `Editando: ${form.nombre}` : "Nuevo pack"}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Nombre *</Label>
            <Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Pack Básico" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Precio *</Label>
            <Input value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} placeholder="Desde 18€/pers." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Duración</Label>
            <Input value={form.duracion} onChange={e => setForm(f => ({ ...f, duracion: e.target.value }))} placeholder="90 min" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Jugadores</Label>
            <Input value={form.jugadores} onChange={e => setForm(f => ({ ...f, jugadores: e.target.value }))} placeholder="6–16 jugadores" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Icono</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={form.icono}
              onChange={e => setForm(f => ({ ...f, icono: e.target.value }))}
            >
              {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Color</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={form.color}
              onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
            >
              {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Orden</Label>
            <Input type="number" value={form.orden} onChange={e => setForm(f => ({ ...f, orden: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Descripción</Label>
          <Input value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Descripción breve del pack" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Características (una por línea)</Label>
          <Textarea
            value={featuresText}
            onChange={e => setFeaturesText(e.target.value)}
            placeholder={"Láser Tag o VR\nEquipamiento completo\nBriefing táctico"}
            rows={5}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={form.popular} onCheckedChange={v => setForm(f => ({ ...f, popular: v }))} />
            <Label className="text-xs">Popular</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.activo} onCheckedChange={v => setForm(f => ({ ...f, activo: v }))} />
            <Label className="text-xs">Activo</Label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving !== null} className="gap-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {editingId ? "Guardar cambios" : "Crear pack"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
          )}
          {!editingId && (
            <Button variant="outline" onClick={resetForm}>
              <Plus size={14} /> Limpiar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPacks;
