// Cliente mínimo JSON-RPC de Odoo + envío de leads al CRM
// deno-lint-ignore-file no-explicit-any

async function rpc(url: string, service: string, method: string, args: unknown[]) {
  const r = await fetch(`${url.replace(/\/$/, "")}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args }, id: Date.now() }),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`Odoo HTTP ${r.status}: ${t.slice(0, 300)}`);
  const j = JSON.parse(t);
  if (j.error) throw new Error(`Odoo: ${j.error.data?.message || j.error.message}`);
  return j.result;
}

export async function odooSession() {
  const url = Deno.env.get("ODOO_URL"), db = Deno.env.get("ODOO_DB");
  const user = Deno.env.get("ODOO_USER"), key = Deno.env.get("ODOO_API_KEY");
  if (!url || !db || !user || !key) throw new Error("Odoo no configurado");
  const uid = await rpc(url, "common", "login", [db, user, key]);
  if (!uid) throw new Error("Credenciales de Odoo incorrectas");
  return (model: string, method: string, args: unknown[], kw: Record<string, unknown> = {}) =>
    rpc(url, "object", "execute_kw", [db, uid, key, model, method, args, kw]);
}

const EVENTOS: Record<string, string> = { cumpleanos: "Cumpleaños", despedida: "Despedida", empresa: "Empresa", grupo: "Grupo", otro: "Otro" };

async function crearLead(lead: any): Promise<{ id: number; aviso?: string }> {
  const exec = await odooSession();
  const nombre = String(lead.nombre || "").trim().replace(/\s+/g, " ").toUpperCase();
  const dom: any[] = [];
  if (lead.email) dom.push(["email", "=ilike", lead.email]);
  if (lead.telefono) dom.push(["phone", "=", lead.telefono]);
  let partnerId: number | undefined;
  if (dom.length) {
    const d = dom.length === 2 ? ["|", ...dom] : dom;
    partnerId = (await exec("res.partner", "search", [d], { limit: 1 }))[0];
  }
  if (!partnerId) {
    partnerId = await exec("res.partner", "create", [{ name: nombre, email: lead.email || false, phone: lead.telefono || false, zip: lead.codigo_postal || false }]);
  }
  const desc = [
    ["Categoría", `${lead.categoria} (${lead.score} pts)`], ["Tipo de evento", EVENTOS[lead.tipo_evento] || lead.tipo_evento],
    ["Actividad", lead.actividad_interes], ["Personas", lead.num_personas], ["Fecha orientativa", lead.fecha_orientativa],
    ["Cuándo", lead.cuando], ["Edad", lead.edad_participantes], ["Presupuesto", lead.presupuesto],
    ["Código postal", lead.codigo_postal], ["Cómo nos conoció", lead.como_nos_conociste], ["Origen", lead.source],
    ["UTM", [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ")], ["Página", lead.page_url],
  ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
  try {
    const id = await exec("crm.lead", "create", [{
      name: `${EVENTOS[lead.tipo_evento] || "Lead"} - ${nombre}`, type: "opportunity", partner_id: partnerId,
      contact_name: nombre, email_from: lead.email || false, phone: lead.telefono || false,
      description: desc, priority: lead.categoria === "A" ? "3" : lead.categoria === "B" ? "2" : "1",
    }]);
    return { id };
  } catch (e) {
    if (/crm\.lead|doesn't exist|no existe/i.test(String(e))) return { id: partnerId, aviso: "CRM no instalado en Odoo: solo se creó el contacto" };
    throw e;
  }
}

/** Envía el lead a Odoo y guarda el resultado en leads_rapidos. Nunca lanza. */
export async function enviarLeadAOdoo(supabase: any, leadId: string, timeoutMs = 10000): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data: lead, error } = await supabase.from("leads_rapidos").select("*").eq("id", leadId).single();
    if (error || !lead) throw new Error("Lead no encontrado");
    const res = await Promise.race([
      crearLead(lead),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("Odoo no respondió a tiempo")), timeoutMs)),
    ]);
    await supabase.from("leads_rapidos").update({ odoo_lead_id: res.id, odoo_error: res.aviso ?? null }).eq("id", leadId);
    return { ok: true, error: res.aviso };
  } catch (e) {
    const msg = String(e instanceof Error ? e.message : e).slice(0, 500);
    console.error("Odoo lead:", msg);
    await supabase.from("leads_rapidos").update({ odoo_error: msg }).eq("id", leadId);
    return { ok: false, error: msg };
  }
}
