import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseCode, dayLabel, VALID_DAYS } from "@/lib/tagZombiCode";

type Canje = { codigo: string; puntos: number; canjeado_at: string };
type Verdict = { tone: "ok" | "warn" | "bad"; state: string; text: string; code?: { id: string; score: number }; facts?: [string, string][] };
const toneCls = { ok: "border-primary text-primary", warn: "border-accent text-accent", bad: "border-destructive text-destructive" };
const fmt = (d: string) => new Date(d).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });

const AdminCanjes = () => {
  const [code, setCode] = useState("");
  const [v, setV] = useState<Verdict | null>(null);
  const [log, setLog] = useState<Canje[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("canjes_tag_zombi").select("codigo,puntos,canjeado_at").order("canjeado_at", { ascending: false }).limit(30);
    setLog(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = parseCode(code);
    if (!r.ok) return setV({ tone: "bad", state: "No válido", text: r.why });
    const facts: [string, string][] = [["Código", r.id], ["Puntos", r.score.toLocaleString("es-ES")], ["Emitido", dayLabel(r.day)]];
    if (r.age < 0) return setV({ tone: "bad", state: "No válido", text: "La fecha del código es futura.", facts });
    if (r.age > VALID_DAYS) return setV({ tone: "warn", state: "Caducado", text: `Se emitió hace ${r.age} días. El límite es ${VALID_DAYS}.`, facts });
    const { data, error } = await supabase.from("canjes_tag_zombi").select("canjeado_at").eq("codigo", r.id).maybeSingle();
    if (error) return setV({ tone: "warn", state: "Sin conexión", text: "No se pudo consultar el registro. Inténtalo de nuevo.", facts });
    if (data) return setV({ tone: "bad", state: "Ya canjeado", text: "Este código ya se usó. No aplicar el descuento.", facts: [...facts, ["Canjeado", fmt(data.canjeado_at)]] });
    setV({ tone: "ok", state: "Válido", text: "Código auténtico y sin usar.", facts, code: { id: r.id, score: r.score } });
  };

  const redeem = async () => {
    if (!v?.code) return;
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("canjes_tag_zombi").insert({ codigo: v.code.id, puntos: v.code.score, canjeado_por: u.user?.id });
    setBusy(false);
    if (error) return setV({ ...v, tone: "warn", state: "No guardado", text: error.code === "23505" ? "Este código ya se había canjeado." : "No se pudo guardar. Reintenta." });
    setV({ ...v, code: undefined, state: "Canjeado", text: "Hecho. Aplica 5% de descuento a la partida de un jugador. No acumulable." });
    setCode(""); load();
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Canje de códigos Tag Zombi</h2>
        <p className="text-sm text-muted-foreground mt-1">Comprueba que el código es auténtico, que no ha caducado ({VALID_DAYS} días) y que no se ha usado. Premio: 5% de descuento en la partida de un jugador, no acumulable.</p>
        <p className="text-xs text-muted-foreground mt-1">Enlace del juego para redes: <span className="text-foreground select-all">https://shootandrun.es/tag-zombi</span></p>
      </div>
      <form onSubmit={check} className="flex gap-2">
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="SR-2140-XXXX-XXXX" className="uppercase font-display tracking-wider" />
        <Button type="submit">Comprobar</Button>
      </form>
      {v && (
        <Card className={`border ${toneCls[v.tone].split(" ")[0]}`}>
          <CardContent className="pt-4 space-y-3">
            <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${toneCls[v.tone]}`}>{v.state}</span>
            {v.facts && <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">{v.facts.map(([k, val]) => <div key={k} className="contents"><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{val}</dd></div>)}</dl>}
            <p className="text-sm">{v.text}</p>
            {v.code && <Button onClick={redeem} disabled={busy}>Aplicar 5% y marcar como canjeado</Button>}
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader><CardTitle className="text-base">Últimos canjes</CardTitle></CardHeader>
        <CardContent>
          {log.length === 0 ? <p className="text-sm text-muted-foreground">Todavía no hay canjes.</p> : (
            <ul className="divide-y divide-border">{log.map((c) => (
              <li key={c.codigo} className="py-2 flex justify-between text-sm"><span><span className="font-display">{c.codigo}</span><br /><span className="text-xs text-muted-foreground">{fmt(c.canjeado_at)}</span></span><span className="font-bold">{c.puntos.toLocaleString("es-ES")}</span></li>
            ))}</ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminCanjes;
