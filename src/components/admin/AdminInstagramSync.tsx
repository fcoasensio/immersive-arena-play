import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCw, Save, Instagram } from "lucide-react";

type Cfg = {
  id: string;
  spreadsheet_id: string;
  sheet_name: string;
  active: boolean;
  last_sync_at: string | null;
};

type SyncStatus = {
  total: number;
  importados: number;
  sinSincronizar: { fila: number; nombre: string; email: string; motivo: string }[];
};

const AdminInstagramSync = () => {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [sheetName, setSheetName] = useState("Instagram");
  const [active, setActive] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("instagram_sync_config")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) toast.error("Error cargando configuración");
    if (data) {
      setCfg(data as Cfg);
      setSpreadsheetId(data.spreadsheet_id);
      setSheetName(data.sheet_name);
      setActive(data.active);
    }
    setLoading(false);
  };

  const [igCount, setIgCount] = useState<number | null>(null);
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const loadStatus = async () => {
    setStatusLoading(true);
    setStatusError(null);
    const { count } = await supabase
      .from("leads_rapidos")
      .select("id", { count: "exact", head: true })
      .eq("source", "instagram_sheet");
    setIgCount(count ?? 0);
    try {
      const { data, error } = await supabase.functions.invoke("sync-leads-instagram", { body: { mode: "status" } });
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || "Error leyendo la Sheet");
      setStatus(data as SyncStatus);
    } catch (e) {
      setStatusError((e as Error).message);
    }
    setStatusLoading(false);
  };

  useEffect(() => { load(); loadStatus(); }, []);

  const save = async () => {
    if (!spreadsheetId.trim()) {
      toast.error("Falta el ID de la Sheet");
      return;
    }
    setSaving(true);
    const payload = {
      spreadsheet_id: spreadsheetId.trim(),
      sheet_name: sheetName.trim() || "Instagram",
      active,
      updated_at: new Date().toISOString(),
    };
    const { error } = cfg
      ? await supabase.from("instagram_sync_config").update(payload).eq("id", cfg.id)
      : await supabase.from("instagram_sync_config").insert(payload);
    if (error) toast.error("No se pudo guardar");
    else {
      toast.success("Configuración guardada");
      await load();
    }
    setSaving(false);
  };

  const triggerSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-leads-instagram");
      if (error) throw error;
      const d = data as { procesados?: number; omitidos?: number; errores?: number };
      toast.success(`Sync OK: ${d.procesados ?? 0} nuevos · ${d.omitidos ?? 0} omitidos · ${d.errores ?? 0} errores`);
      await load();
    } catch (e) {
      toast.error(`Error en sync: ${(e as Error).message}`);
    }
    setSyncing(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Instagram className="text-primary" />
        <div>
          <h2 className="text-lg font-semibold">Sincronización con Google Sheet (Instagram)</h2>
          <p className="text-sm text-muted-foreground">
            Importa automáticamente los leads que aterricen en tu Google Sheet de Instagram.
            Se ejecuta cada 10 min y también puedes lanzarla manualmente.
          </p>
        </div>
      </div>

      <div className="border border-border rounded-lg p-5 space-y-4 bg-card">
        <div>
          <Label htmlFor="ssid">ID de la Google Sheet</Label>
          <Input
            id="ssid" value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            placeholder="1AbCdEfGhIjKlMnOpQrStUvWxYz..."
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            En la URL: https://docs.google.com/spreadsheets/d/<strong>ESTE_ID</strong>/edit
          </p>
        </div>
        <div>
          <Label htmlFor="sname">Nombre de la pestaña</Label>
          <Input id="sname" value={sheetName} onChange={(e) => setSheetName(e.target.value)} placeholder="Instagram" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="active">Sincronización activa</Label>
            <p className="text-xs text-muted-foreground">Si la desactivas, el cron no procesará nada.</p>
          </div>
          <Switch id="active" checked={active} onCheckedChange={setActive} />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={save} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar"}
          </Button>
          <Button onClick={triggerSync} disabled={syncing || !cfg?.active} variant="secondary" className="gap-2">
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} /> Sincronizar ahora
          </Button>
        </div>

        {cfg?.last_sync_at && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            Última sincronización: {new Date(cfg.last_sync_at).toLocaleString("es-ES")}
          </div>
        )}
      </div>

      <div className="border border-border rounded-lg p-5 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Estado de los leads de Instagram</div>
          <Button size="sm" variant="outline" onClick={loadStatus} disabled={statusLoading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${statusLoading ? "animate-spin" : ""}`} /> Actualizar
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-md border border-border p-3">
            <div className="text-2xl font-bold">{igCount ?? "—"}</div>
            <div className="text-xs text-muted-foreground">Leads de Instagram en el panel</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-2xl font-bold">{status?.total ?? "—"}</div>
            <div className="text-xs text-muted-foreground">Filas en la Sheet</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-2xl font-bold text-destructive">{status?.sinSincronizar.length ?? "—"}</div>
            <div className="text-xs text-muted-foreground">Sin sincronizar</div>
          </div>
        </div>
        {statusError && <p className="text-sm text-destructive">{statusError}</p>}
        {status && status.sinSincronizar.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 pr-2">Fila</th><th className="py-2 pr-2">Nombre</th>
                  <th className="py-2 pr-2">Email</th><th className="py-2">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {status.sinSincronizar.map((r) => (
                  <tr key={r.fila} className="border-b border-border/50">
                    <td className="py-2 pr-2">{r.fila}</td>
                    <td className="py-2 pr-2">{r.nombre || "—"}</td>
                    <td className="py-2 pr-2">{r.email || "—"}</td>
                    <td className="py-2 text-muted-foreground">{r.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="border border-border rounded-lg p-5 bg-muted/30 text-sm space-y-2">
        <div className="font-semibold">Estructura esperada de la Sheet</div>
        <p className="text-muted-foreground">
          Columnas (en este orden, con cabecera en fila 1):
        </p>
        <code className="block bg-background border border-border rounded px-3 py-2 text-xs font-mono">
          A: Fecha · B: Nombre · C: Email · D: Teléfono · E: Tipo evento · F: Nº personas · G: Procesado · H: Fecha evento
        </code>
        <p className="text-muted-foreground text-xs">
          La columna G se rellena sola al procesar cada fila (no la toques). Las filas con G vacía se importan en la siguiente pasada.
        </p>
      </div>
    </div>
  );
};

export default AdminInstagramSync;
