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
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Eye, MessageCircle, Mail, Phone } from "lucide-react";

type Lead = {
  id: string;
  created_at: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  tipo_evento: string;
  actividad_interes: string | null;
  edad_participantes: string | null;
  num_personas: string | null;
  presupuesto: string | null;
  cuando: string | null;
  fecha_orientativa: string | null;
  codigo_postal: string | null;
  como_nos_conociste: string | null;
  page_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  source: string | null;
  score: number;
  categoria: "A" | "B" | "C" | string;
  motivos_score: string[] | null;
};

const EVENT_LABELS: Record<string, string> = {
  cumpleanos: "🎂 Cumpleaños",
  empresa: "💼 Empresa",
  despedida: "🎉 Despedida",
  colegio: "🏫 Colegio",
  amigos: "👥 Amigos",
  otro: "✨ Otro",
};
const ACTIVITY_LABELS: Record<string, string> = {
  laser_tag: "Laser Tag",
  vr: "VR",
  no_se: "Por decidir",
};
const PEOPLE_LABELS: Record<string, string> = {
  "1_7": "1-7", "8_15": "8-15", "16_25": "16-25", "25_mas": "+25",
};
const WHEN_LABELS: Record<string, string> = {
  esta_semana: "Esta semana", este_mes: "Este mes", "1_2_meses": "1-2 meses", informandome: "Informándose",
};
const BUDGET_LABELS: Record<string, string> = {
  menos_200: "< 200€", "200_400": "200-400€", mas_400: "+400€", no_se: "—",
};
const AGE_LABELS: Record<string, string> = {
  "8_11": "8-11", "12_mas": "12+", mixto: "Mixto",
};

const catBadge = (c: string) => {
  if (c === "A") return "bg-neon-green/20 text-neon-green border-neon-green/40";
  if (c === "B") return "bg-amber-500/20 text-amber-400 border-amber-500/40";
  return "bg-muted text-muted-foreground border-border";
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterEvento, setFilterEvento] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads_rapidos")
      .select("*")
      .order("categoria", { ascending: true })
      .order("score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error("Error cargando leads");
    setLeads((data || []) as Lead[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = leads.filter(l => {
    if (filterCat !== "all" && l.categoria !== filterCat) return false;
    if (filterEvento !== "all" && l.tipo_evento !== filterEvento) return false;
    if (filterSource === "instagram" && l.source !== "instagram_sheet") return false;
    if (filterSource === "web" && l.source === "instagram_sheet") return false;
    return true;
  });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="A">🔥 Solo A</SelectItem>
            <SelectItem value="B">⚡ Solo B</SelectItem>
            <SelectItem value="C">📋 Solo C</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterEvento} onValueChange={setFilterEvento}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los eventos</SelectItem>
            {Object.entries(EVENT_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los orígenes</SelectItem>
            <SelectItem value="web">🌐 Web</SelectItem>
            <SelectItem value="instagram">📸 Instagram</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">{filtered.length} leads</div>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cat</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Personas</TableHead>
              <TableHead>Cuándo</TableHead>
              <TableHead>Presup.</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(l => {
              const phone = (l.telefono || "").replace(/\D/g, "");
              const isIG = l.source === "instagram_sheet";
              return (
                <TableRow key={l.id}>
                  <TableCell><Badge variant="outline" className={catBadge(l.categoria)}>{l.categoria}</Badge></TableCell>
                  <TableCell className="font-mono">{l.score}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}</TableCell>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      {isIG && <span title="Lead de Instagram" className="text-pink-400">📸</span>}
                      {l.nombre}
                    </div>
                  </TableCell>
                  <TableCell>{EVENT_LABELS[l.tipo_evento] || l.tipo_evento}</TableCell>
                  <TableCell>{l.num_personas ? PEOPLE_LABELS[l.num_personas] || l.num_personas : "—"}</TableCell>
                  <TableCell className="text-xs">{l.cuando ? WHEN_LABELS[l.cuando] || l.cuando : "—"}</TableCell>
                  <TableCell className="text-xs">{l.presupuesto ? BUDGET_LABELS[l.presupuesto] || l.presupuesto : "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      {phone ? (
                        <Button asChild size="sm" variant="outline">
                          <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </Button>
                      ) : l.email ? (
                        <Button asChild size="sm" variant="outline">
                          <a href={`mailto:${l.email}`} aria-label="Email">
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      ) : null}
                      <Button size="sm" variant="ghost" onClick={() => setSelected(l)}><Eye className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-6">Sin leads</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Lead — {selected?.nombre}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex gap-2 items-center">
                <Badge variant="outline" className={catBadge(selected.categoria)}>{selected.categoria}</Badge>
                <span className="font-mono">{selected.score} pts</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Teléfono:</span> <a className="text-primary" href={`tel:${selected.telefono}`}><Phone className="inline w-3 h-3" /> {selected.telefono}</a></div>
                <div><span className="text-muted-foreground">Email:</span> {selected.email ? <a className="text-primary" href={`mailto:${selected.email}`}><Mail className="inline w-3 h-3" /> {selected.email}</a> : "—"}</div>
                <div><span className="text-muted-foreground">Evento:</span> {EVENT_LABELS[selected.tipo_evento] || selected.tipo_evento}</div>
                <div><span className="text-muted-foreground">Actividad:</span> {selected.actividad_interes ? ACTIVITY_LABELS[selected.actividad_interes] : "—"}</div>
                <div><span className="text-muted-foreground">Edad:</span> {selected.edad_participantes ? AGE_LABELS[selected.edad_participantes] : "—"}</div>
                <div><span className="text-muted-foreground">Personas:</span> {selected.num_personas ? PEOPLE_LABELS[selected.num_personas] : "—"}</div>
                <div><span className="text-muted-foreground">Cuándo:</span> {selected.cuando ? WHEN_LABELS[selected.cuando] : "—"}</div>
                <div><span className="text-muted-foreground">Presup.:</span> {selected.presupuesto ? BUDGET_LABELS[selected.presupuesto] : "—"}</div>
                <div><span className="text-muted-foreground">Fecha:</span> {selected.fecha_orientativa || "—"}</div>
                <div><span className="text-muted-foreground">CP:</span> {selected.codigo_postal || "—"}</div>
                <div><span className="text-muted-foreground">Origen:</span> {selected.como_nos_conociste || "—"}</div>
              </div>
              <div className="border-t border-border pt-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Motivos del score</div>
                <ul className="text-xs space-y-1">
                  {(selected.motivos_score || []).map((m, i) => <li key={i}>• {m}</li>)}
                  {(!selected.motivos_score || selected.motivos_score.length === 0) && <li className="text-muted-foreground">Sin señales positivas relevantes</li>}
                </ul>
              </div>
              {selected.utm_source && (
                <div className="border-t border-border pt-3 text-xs text-muted-foreground">
                  UTM: {selected.utm_source} / {selected.utm_medium} / {selected.utm_campaign}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeads;
