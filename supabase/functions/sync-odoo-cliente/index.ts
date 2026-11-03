import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function rpc(url: string, service: string, method: string, args: unknown[]) {
  const r = await fetch(`${url.replace(/\/$/, "")}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args }, id: Date.now() }),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`Odoo HTTP ${r.status}: ${t}`);
  const j = JSON.parse(t);
  if (j.error) throw new Error(`Odoo: ${j.error.data?.message || j.error.message}`);
  return j.result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const URL_ = Deno.env.get("ODOO_URL"), DB = Deno.env.get("ODOO_DB");
    const USER = Deno.env.get("ODOO_USER"), KEY = Deno.env.get("ODOO_API_KEY");
    if (!URL_ || !DB || !USER || !KEY) return json({ error: "Odoo no configurado" }, 500);

    const supaUrl = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(supaUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: u } = await admin.auth.getUser(token);
    if (!u?.user) return json({ error: "No autorizado" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "No autorizado" }, 403);

    const p = z.object({ reservaId: z.string().uuid() }).safeParse(await req.json());
    if (!p.success) return json({ error: "reservaId inválido" }, 400);

    const { data: r, error } = await admin.from("reservas").select("*").eq("id", p.data.reservaId).single();
    if (error || !r) return json({ error: "Reserva no encontrada" }, 404);

    const uid = await rpc(URL_, "common", "login", [DB, USER, KEY]);
    if (!uid) return json({ error: "Credenciales de Odoo incorrectas" }, 401);
    const exec = (model: string, method: string, args: unknown[], kw: Record<string, unknown> = {}) =>
      rpc(URL_, "object", "execute_kw", [DB, uid, KEY, model, method, args, kw]);

    const [es] = await exec("res.country", "search", [[["code", "=", "ES"]]], { limit: 1 });
    let stateId: number | false = false;
    if (es && r.provincia) {
      const st = await exec("res.country.state", "search", [[["country_id", "=", es], ["name", "ilike", r.provincia]]], { limit: 1 });
      stateId = st[0] ?? false;
    }
    const vat = String(r.dni_cif || "").toUpperCase();
    const vals: Record<string, unknown> = {
      name: String(r.nombre_completo).toUpperCase(),
      email: r.email, phone: r.telefono, street: r.direccion, zip: r.codigo_postal,
      city: r.poblacion || false, state_id: stateId, country_id: es || false,
      vat: vat ? `ES${vat}` : false, customer_rank: 1,
    };

    let partnerId: number = r.odoo_partner_id;
    if (!partnerId && vat) {
      const found = await exec("res.partner", "search", [["|", ["vat", "=", `ES${vat}`], ["vat", "=", vat]]], { limit: 1 });
      partnerId = found[0];
    }
    const write = async (v: Record<string, unknown>) => {
      if (partnerId) await exec("res.partner", "write", [[partnerId], v]);
      else partnerId = await exec("res.partner", "create", [v]);
    };
    try { await write(vals); }
    catch (e) {
      // Si Odoo rechaza el NIF con prefijo (validación VIES), reintenta sin prefijo
      if (String(e).toLowerCase().includes("vat")) await write({ ...vals, vat: vat || false });
      else throw e;
    }
    await admin.from("reservas").update({ odoo_partner_id: partnerId }).eq("id", r.id);
    return json({ ok: true, partnerId });
  } catch (e) {
    console.error("sync-odoo-cliente:", e);
    return json({ error: String(e instanceof Error ? e.message : e) }, 502);
  }
});
