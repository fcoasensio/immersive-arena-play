import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";
import { buildLeadDraft } from "../_shared/lead-draft.ts";
import { appendGdprFooter } from "../_shared/gdpr-footer.ts";

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: u } = await admin.auth.getUser(token);
    if (!u?.user) return json({ error: "No autorizado" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "No autorizado" }, 403);

    const p = z.object({ leadId: z.string().uuid() }).safeParse(await req.json().catch(() => ({})));
    if (!p.success) return json({ error: "leadId inválido" }, 400);

    const { data: lead, error } = await admin.from("leads_rapidos").select("*").eq("id", p.data.leadId).maybeSingle();
    if (error || !lead) return json({ error: "Lead no encontrado" }, 404);
    if (!lead.email) return json({ error: "Este lead no tiene email" }, 400);

    const { count } = await admin.from("lead_emails_pendientes")
      .select("id", { count: "exact", head: true }).eq("lead_id", lead.id).eq("status", "pendiente_aprobacion");
    if ((count ?? 0) > 0) return json({ error: "Ya tiene un borrador pendiente" }, 409);

    const categoria = (["A", "B", "C"].includes(lead.categoria) ? lead.categoria : "C") as "A" | "B" | "C";
    const draft = buildLeadDraft({
      nombre: lead.nombre,
      tipo_evento: lead.tipo_evento || "otro",
      num_personas: lead.num_personas || "",
      fecha_orientativa: lead.fecha_orientativa || "",
      actividad_interes: lead.actividad_interes || "",
      categoria,
    });
    const { error: insErr } = await admin.from("lead_emails_pendientes").insert({
      lead_id: lead.id,
      recipient_email: lead.email,
      recipient_nombre: lead.nombre,
      subject: draft.subject,
      body_html: appendGdprFooter(draft.html),
      categoria,
      status: "pendiente_aprobacion",
    });
    if (insErr) return json({ error: insErr.message }, 500);
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
