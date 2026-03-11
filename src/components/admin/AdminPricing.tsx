import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface PricingOption {
  id: string;
  category: string;
  name: string;
  label: string;
  price: number;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

const categories = [
  { value: 'activity', label: 'Actividades' },
  { value: 'extra', label: 'Extras' },
  { value: 'event', label: 'Tipo de Evento' },
  { value: 'package', label: 'Paquetes' },
];

const emptyForm = {
  category: 'activity',
  name: '',
  label: '',
  price: 0,
  description: '',
  is_active: true,
  sort_order: 0,
};

const AdminPricing = () => {
  const [items, setItems] = useState<PricingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PricingOption | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchPricing = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pricing_options')
      .select('*')
      .order('category')
      .order('sort_order');

    if (error) toast.error('Error al cargar precios');
    else setItems((data as PricingOption[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPricing(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: PricingOption) => {
    setEditing(item);
    setForm({
      category: item.category,
      name: item.name,
      label: item.label,
      price: item.price,
      description: item.description || '',
      is_active: item.is_active,
      sort_order: item.sort_order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.label) return toast.error('Nombre y etiqueta son obligatorios');
    setSaving(true);

    if (editing) {
      const { error } = await supabase
        .from('pricing_options')
        .update({
          category: form.category,
          name: form.name,
          label: form.label,
          price: form.price,
          description: form.description || null,
          is_active: form.is_active,
          sort_order: form.sort_order,
        })
        .eq('id', editing.id);

      if (error) toast.error('Error al actualizar');
      else toast.success('Precio actualizado');
    } else {
      const { error } = await supabase.from('pricing_options').insert({
        category: form.category,
        name: form.name,
        label: form.label,
        price: form.price,
        description: form.description || null,
        is_active: form.is_active,
        sort_order: form.sort_order,
      });

      if (error) toast.error('Error al crear');
      else toast.success('Precio creado');
    }

    setSaving(false);
    setDialogOpen(false);
    fetchPricing();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('¿Eliminar esta opción de precio?')) return;
    const { error } = await supabase.from('pricing_options').delete().eq('id', id);
    if (error) toast.error('Error al eliminar');
    else {
      toast.success('Eliminado');
      fetchPricing();
    }
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase
      .from('pricing_options')
      .update({ is_active })
      .eq('id', id);

    if (error) toast.error('Error');
    else fetchPricing();
  };

  const grouped = categories.map(cat => ({
    ...cat,
    items: items.filter(i => i.category === cat.value),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">Precios y Opciones</h2>
        <Button onClick={openNew} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Añadir
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((cat) => (
            <div key={cat.value}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">{cat.label}</h3>
              {cat.items.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Sin opciones en esta categoría</p>
              ) : (
                <div className="grid gap-2">
                  {cat.items.map((item) => (
                    <Card key={item.id} className={`bg-card border-border ${!item.is_active ? 'opacity-50' : ''}`}>
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{item.label}</span>
                            <span className="text-primary font-bold">{item.price.toFixed(2)}€</span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.is_active}
                            onCheckedChange={(checked) => toggleActive(item.id, checked)}
                          />
                          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? 'Editar Precio' : 'Nuevo Precio'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Categoría</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre (código)</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="laser_tag" className="bg-background/50" />
              </div>
              <div>
                <Label>Etiqueta</Label>
                <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Laser Tag" className="bg-background/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Precio (€)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="bg-background/50" />
              </div>
              <div>
                <Label>Orden</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="bg-background/50" />
              </div>
            </div>
            <div>
              <Label>Descripción</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción breve" className="bg-background/50" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>Activo</Label>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <DollarSign className="w-4 h-4 mr-2" />}
              {editing ? 'Guardar cambios' : 'Crear precio'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPricing;
