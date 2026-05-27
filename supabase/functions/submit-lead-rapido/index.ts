import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "outdoor@shootandrun.es";
const CC_EMAIL = "info@shootandrun.es";

const VALID_EVENTS = ["cumpleanos", "empresa", "despedida", "colegio", "amigos", "otro"];
const EVENT_LABELS: Record<string, string> = {
  cumpleanos: "🎂 Cumpleaños",
  empresa: "💼 Empresa / Team Building",
  despedida: "🎉 Despedida",
  colegio: "🏫 Colegio / Instituto",
  amigos: "👥 Grupo de amigos",
  otro: "✨ Otro",
};

// Rate limiting in-memory por IP
const IP_WINDOW_MS = 60 * 1000;
const IP_MAX = 5;
const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < IP_WINDOW_MS);
  if (hits.length >= IP_MAX) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

const getClientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("cf-connecting-ip") ||
  "unknown";

const esc = (t: string) =>
  String(t).replace(/[<>"'&]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" }[c] || c)
  );

const trim = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Demasiadas solicitudes. Inténtalo más tarde." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));

    const nombre = trim(body.nombre, 100);
    const telefono = trim(body.telefono, 30);
    const tipo_evento = trim(body.tipo_evento, 30);
    const num_personas = trim(body.num_personas, 30);
    const fecha_orientativa = trim(body.fecha_orientativa, 20);
    const consentimiento = body.consentimiento === true;
    const source = trim(body.source, 60) || "popup_contacto_rapido";
    const page_url = trim(body.page_url, 500);
    const utm_source = trim(body.utm_source, 100);
    const utm_medium = trim(body.utm_medium, 100);
    const utm_campaign = trim(body.utm_campaign, 100);
    const utm_content = trim(body.utm_content, 100);
    const utm_term = trim(body.utm_term, 100);
    const client_timestamp = trim(body.timestamp, 40);

    if (nombre.length < 2) {
      return new Response(JSON.stringify({ error: "Nombre inválido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (telefono.replace(/\D/g, "").length < 9) {
      return new Response(JSON.stringify({ error: "Teléfono inválido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!VALID_EVENTS.includes(tipo_evento)) {
      return new Response(JSON.stringify({ error: "Tipo de evento inválido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!consentimiento) {
      return new Response(JSON.stringify({ error: "Consentimiento obligatorio" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert en BD usando service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { error: dbError } = await supabase.from("leads_rapidos").insert({
      nombre,
      telefono,
      tipo_evento,
      num_personas: num_personas || null,
      fecha_orientativa: fecha_orientativa || null,
      consentimiento,
      source,
      page_url: page_url || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: utm_content || null,
      utm_term: utm_term || null,
      client_timestamp: client_timestamp || null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(JSON.stringify({ error: "No se pudo guardar el lead" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Email notificación (best-effort)
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const utmRows = [
          ["utm_source", utm_source],
          ["utm_medium", utm_medium],
          ["utm_campaign", utm_campaign],
          ["utm_content", utm_content],
          ["utm_term", utm_term],
        ].filter(([, v]) => v).map(
          ([k, v]) => `<tr><td style="padding:4px 8px;color:#888">${k}</td><td style="padding:4px 8px;color:#fff">${esc(v as string)}</td></tr>`
        ).join("");

        const html = `<!DOCTYPE html><html><body style="font-family:Segoe UI,sans-serif;background:#0a0a0a;color:#fff;padding:20px;margin:0">
          <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px;overflow:hidden">
            <div style="background:linear-gradient(135deg,#06b6d4,#0891b2);padding:24px;text-align:center">
              <h1 style="margin:0;font-size:22px;text-transform:uppercase;letter-spacing:2px">⚡ Nuevo lead rápido</h1>
            </div>
            <div style="padding:24px">
              <p style="margin:0 0 16px;color:#ccc">Lead recibido desde el popup de contacto rápido.</p>
              <div style="background:rgba(255,255,255,0.05);padding:14px;border-radius:8px;border-left:3px solid #06b6d4;margin-bottom:10px">
                <div style="font-size:11px;color:#888;text-transform:uppercase">Nombre</div>
                <div style="font-size:15px;font-weight:600">${esc(nombre)}</div>
              </div>
              <div style="background:rgba(255,255,255,0.05);padding:14px;border-radius:8px;border-left:3px solid #06b6d4;margin-bottom:10px">
                <div style="font-size:11px;color:#888;text-transform:uppercase">Teléfono / WhatsApp</div>
                <div style="font-size:15px;font-weight:600"><a href="tel:${esc(telefono)}" style="color:#06b6d4;text-decoration:none">${esc(telefono)}</a> · <a href="https://wa.me/${esc(telefono.replace(/\D/g, ""))}" style="color:#22c55e">WhatsApp</a></div>
              </div>
              <div style="background:rgba(255,255,255,0.05);padding:14px;border-radius:8px;border-left:3px solid #06b6d4;margin-bottom:10px">
                <div style="font-size:11px;color:#888;text-transform:uppercase">Tipo de evento</div>
                <div style="font-size:15px;font-weight:600">${EVENT_LABELS[tipo_evento]}</div>
              </div>
              ${num_personas ? `<div style="background:rgba(255,255,255,0.05);padding:14px;border-radius:8px;border-left:3px solid #06b6d4;margin-bottom:10px"><div style="font-size:11px;color:#888;text-transform:uppercase">Nº personas</div><div style="font-size:15px;font-weight:600">${esc(num_personas)}</div></div>` : ""}
              ${fecha_orientativa ? `<div style="background:rgba(255,255,255,0.05);padding:14px;border-radius:8px;border-left:3px solid #06b6d4;margin-bottom:10px"><div style="font-size:11px;color:#888;text-transform:uppercase">Fecha orientativa</div><div style="font-size:15px;font-weight:600">${esc(fecha_orientativa)}</div></div>` : ""}
              <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1)">
                <div style="font-size:11px;color:#888;text-transform:uppercase;margin-bottom:8px">Origen</div>
                <table style="width:100%;font-size:13px;border-collapse:collapse">
                  <tr><td style="padding:4px 8px;color:#888">source</td><td style="padding:4px 8px;color:#fff">${esc(source)}</td></tr>
                  ${page_url ? `<tr><td style="padding:4px 8px;color:#888">page_url</td><td style="padding:4px 8px;color:#fff;word-break:break-all">${esc(page_url)}</td></tr>` : ""}
                  ${client_timestamp ? `<tr><td style="padding:4px 8px;color:#888">timestamp</td><td style="padding:4px 8px;color:#fff">${esc(client_timestamp)}</td></tr>` : ""}
                  ${utmRows}
                </table>
              </div>
            </div>
            <div style="background:#0d0d1a;padding:14px;text-align:center;font-size:11px;color:#555">shootandrun · Alcantarilla, Murcia</div>
          </div>
        </body></html>`;

        const r = await resend.emails.send({
          from: "shootandrun Leads <outdoor@web.shootandrun.es>",
          to: [ADMIN_EMAIL],
          cc: [CC_EMAIL],
          subject: `⚡ Nuevo lead rápido - ${nombre} (${EVENT_LABELS[tipo_evento]})`,
          html,
        });
        if (r.error) console.error("Resend error (non-fatal):", r.error);
      } catch (e) {
        console.error("Email send failed (non-fatal):", e);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-lead-rapido error:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
