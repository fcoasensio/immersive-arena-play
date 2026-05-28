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
const FROM = "shootandrun Leads <outdoor@web.shootandrun.es>";

const VALID_EVENTS = ["cumpleanos", "empresa", "despedida", "colegio", "amigos", "otro"];
const EVENT_LABELS: Record<string, string> = {
  cumpleanos: "🎂 Cumpleaños",
  empresa: "💼 Empresa / Team Building",
  despedida: "🎉 Despedida",
  colegio: "🏫 Colegio / Instituto",
  amigos: "👥 Grupo de amigos",
  otro: "✨ Otro",
};

const ACTIVITY_LABELS: Record<string, string> = {
  laser_tag: "Laser Tag",
  vr: "Realidad Virtual",
  no_se: "Por decidir",
};
const AGE_LABELS: Record<string, string> = {
  "8_11": "8-11 años",
  "12_mas": "12+ años",
  mixto: "Mixto adultos y niños",
};
const PEOPLE_LABELS: Record<string, string> = {
  "1_7": "1-7",
  "8_15": "8-15",
  "16_25": "16-25",
  "25_mas": "+25",
};
const BUDGET_LABELS: Record<string, string> = {
  menos_200: "< 200€",
  "200_400": "200 - 400€",
  mas_400: "+ 400€",
  no_se: "No lo sé",
};
const WHEN_LABELS: Record<string, string> = {
  esta_semana: "Esta semana",
  este_mes: "Este mes",
  "1_2_meses": "1-2 meses",
  informandome: "Solo informándome",
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

// ============ SCORING ============
type LeadInput = {
  tipo_evento: string;
  actividad_interes: string;
  edad_participantes: string;
  num_personas: string;
  presupuesto: string;
  cuando: string;
  codigo_postal: string;
  como_nos_conociste: string;
};

function calcScore(l: LeadInput): { score: number; categoria: "A" | "B" | "C"; motivos: string[] } {
  let score = 0;
  const motivos: string[] = [];
  const add = (n: number, m: string) => { score += n; motivos.push(`${n > 0 ? "+" : ""}${n} ${m}`); };

  if (l.cuando === "esta_semana") add(25, "fecha esta semana");
  else if (l.cuando === "este_mes") add(15, "fecha este mes");
  else if (l.cuando === "informandome") add(-15, "solo informándose");

  if (l.tipo_evento === "empresa" || l.tipo_evento === "despedida") add(20, "evento de alto valor");

  if (l.num_personas === "16_25") add(15, "grupo 16-25");
  else if (l.num_personas === "25_mas") add(20, "grupo +25");

  if (l.presupuesto === "mas_400") add(15, "presupuesto +400€");
  else if (l.presupuesto === "200_400") add(10, "presupuesto 200-400€");

  if (l.actividad_interes === "vr") add(10, "interés en VR");
  if (l.actividad_interes === "vr" && l.edad_participantes === "8_11") add(-15, "VR incompatible con 8-11");

  if (l.tipo_evento === "amigos" && l.num_personas === "1_7") add(-10, "grupo pequeño informal");

  // CP Murcia capital o Alcantarilla (rough)
  if (/^30(0|8)\d{2}$/.test(l.codigo_postal)) add(5, "CP cercano");
  if (l.como_nos_conociste === "google" || l.como_nos_conociste === "instagram") add(5, "origen alta intención");

  const categoria: "A" | "B" | "C" = score >= 50 ? "A" : score >= 25 ? "B" : "C";
  return { score, categoria, motivos };
}

// ============ DRAFT EMAIL TO LEAD ============
function buildLeadDraft(args: {
  nombre: string;
  tipo_evento: string;
  num_personas: string;
  fecha_orientativa: string;
  actividad_interes: string;
  categoria: "A" | "B";
}): { subject: string; html: string } {
  const { nombre, tipo_evento, num_personas, fecha_orientativa, actividad_interes, categoria } = args;
  const personas = num_personas ? PEOPLE_LABELS[num_personas] || num_personas : "";
  const actividadLabel = actividad_interes && actividad_interes !== "no_se"
    ? ACTIVITY_LABELS[actividad_interes]
    : "Laser Tag o Realidad Virtual";
  const fechaTxt = fecha_orientativa ? `el ${esc(fecha_orientativa)}` : "en la fecha que elijáis";
  const personasTxt = personas ? `${esc(personas)} personas` : "tu grupo";
  const eventoTxt = EVENT_LABELS[tipo_evento]?.replace(/^[^\s]+\s/, "").toLowerCase() || "evento";

  // EMPRESA / TEAM BUILDING
  if (tipo_evento === "empresa") {
    const subject = `Propuesta team building shootandrun para ${nombre}`;
    const html = wrap(`
      <p>Hola ${esc(nombre)},</p>
      <p>Gracias por pensar en <strong>shootandrun</strong> para vuestro evento de empresa. Os hemos preparado una propuesta enfocada en lo que de verdad funciona en team building: cooperación bajo presión, decisiones rápidas y mucho que celebrar después.</p>
      <p><strong>Para vuestro grupo de ${personasTxt} proponemos:</strong></p>
      <ul style="padding-left:18px;line-height:1.7">
        <li>⚡ Sesión de <strong>laser tag indoor</strong> (90 min) con modos por equipos rotativos</li>
        <li>🥽 Bloque opcional de <strong>VR free roam multijugador</strong> (sin mareos, hasta 6 simultáneos)</li>
        <li>🍕 Zona privada con catering opcional</li>
        <li>📊 Briefing inicial + entrega del "MVP del día" al final</li>
      </ul>
      <p>Los precios se ajustan a partir de 15 personas. Reserva de franja con 50€ de Bizum, el resto se factura tras el evento <strong>sobre asistentes reales</strong> (el número orientativo no compromete).</p>
      <p>¿Cerramos fecha esta semana? Responde a este email o llámanos al <strong>606 32 30 53</strong>.</p>
      <p style="margin-top:28px">Un saludo,<br/>Equipo <strong>shootandrun</strong><br/><span style="color:#888;font-size:13px">Alcantarilla, Murcia · +34 606 32 30 53</span></p>
    `);
    return { subject, html };
  }

  // CUMPLEAÑOS / DESPEDIDA / AMIGOS / COLEGIO / OTRO
  if (categoria === "A") {
    const subject = `${nombre}, tu ${eventoTxt} en shootandrun: propuesta lista 🎯`;
    const html = wrap(`
      <p>Hola ${esc(nombre)},</p>
      <p>Gracias por dejarnos tus datos — hemos preparado una propuesta para vuestro <strong>${eventoTxt}</strong> de ${personasTxt} ${esc(fechaTxt)}.</p>
      <p>En <strong>shootandrun</strong> no hacemos partidas "de relleno": diseñamos cada experiencia para que cada minuto cuente.</p>
      <ul style="padding-left:18px;line-height:1.7">
        <li>🎯 <strong>${esc(actividadLabel)}</strong> en arena indoor con equipo profesional</li>
        <li>⚡ Briefing táctico + 3-4 modos de juego adaptados al grupo</li>
        <li>🎁 Zona privada para descanso o picoteo si lo necesitas</li>
      </ul>
      <p><strong>Reserva con solo 50€ de Bizum</strong> al 606 32 30 53. El resto se paga el día de la actividad y se calcula <strong>sobre los jugadores reales que asistan</strong> (el número de la reserva es solo orientativo).</p>
      <p>Las franjas más demandadas vuelan rápido. Responde a este email o escríbenos por WhatsApp y te confirmo disponibilidad <strong>hoy mismo</strong>.</p>
      <p style="margin-top:28px">Nos vemos en la arena ⚡<br/>Equipo <strong>shootandrun</strong><br/><span style="color:#888;font-size:13px">Alcantarilla, Murcia · +34 606 32 30 53</span></p>
    `);
    return { subject, html };
  }

  // CATEGORIA B: Tono más informativo, menos urgencia
  const subject = `${nombre}, info sobre tu ${eventoTxt} en shootandrun`;
  const html = wrap(`
    <p>Hola ${esc(nombre)},</p>
    <p>Gracias por escribirnos. Te paso un resumen rápido para que puedas valorar vuestro <strong>${eventoTxt}</strong> en <strong>shootandrun</strong>:</p>
    <ul style="padding-left:18px;line-height:1.7">
      <li>🎯 <strong>Laser Tag</strong> indoor (a partir de 8 años) — el plan más versátil para grupos mixtos</li>
      <li>🥽 <strong>Realidad Virtual</strong> free-roam (a partir de 12 años) — experiencia tipo arcade premium</li>
      <li>📍 Estamos en Alcantarilla (Murcia), arena climatizada todo el año</li>
      <li>💳 Reserva con 50€ de Bizum; el resto se paga el día sobre jugadores reales</li>
    </ul>
    <p>Si me confirmas <strong>fecha aproximada y nº de personas</strong>, te paso disponibilidad y precio cerrado.</p>
    <p>Estoy disponible aquí o por WhatsApp al <strong>606 32 30 53</strong>.</p>
    <p style="margin-top:28px">Un saludo,<br/>Equipo <strong>shootandrun</strong><br/><span style="color:#888;font-size:13px">Alcantarilla, Murcia · +34 606 32 30 53</span></p>
  `);
  return { subject, html };
}

function wrap(inner: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;background:#f6f6f6;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1a1a">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px 28px">
      <div style="font-family:'Courier New',monospace;font-weight:bold;font-size:18px;letter-spacing:1px;color:#0a0a0a;margin-bottom:24px">
        <span style="color:#06b6d4">shoot</span>andrun
      </div>
      <div style="font-size:15px;line-height:1.6">
        ${inner}
      </div>
    </div>
  </body></html>`;
}

// ============ ADMIN INTERNAL EMAIL ============
function buildAdminEmail(args: {
  nombre: string; telefono: string; email: string; tipo_evento: string;
  actividad_interes: string; edad_participantes: string; num_personas: string;
  presupuesto: string; cuando: string; fecha_orientativa: string;
  codigo_postal: string; como_nos_conociste: string;
  page_url: string; client_timestamp: string;
  utms: Record<string, string>;
  score: number; categoria: "A" | "B" | "C"; motivos: string[];
  hasDraft: boolean;
}): { subject: string; html: string } {
  const { categoria, score, motivos, nombre, tipo_evento } = args;
  const prefix = categoria === "A" ? "🔥 LEAD A" : categoria === "B" ? "⚡ LEAD B" : "📋 Lead C";
  const subject = `${prefix} - ${nombre} (${EVENT_LABELS[tipo_evento] || tipo_evento}) · ${score}pts`;

  const catColor = categoria === "A" ? "#22c55e" : categoria === "B" ? "#f59e0b" : "#94a3b8";

  const row = (label: string, value: string) => value ? `<tr><td style="padding:5px 10px;color:#888;font-size:12px">${label}</td><td style="padding:5px 10px;color:#fff;font-size:13px">${esc(value)}</td></tr>` : "";

  const utmRows = Object.entries(args.utms).filter(([, v]) => v).map(([k, v]) =>
    `<tr><td style="padding:4px 10px;color:#888;font-size:11px">${k}</td><td style="padding:4px 10px;color:#fff;font-size:11px">${esc(v)}</td></tr>`
  ).join("");

  const phoneDigits = args.telefono.replace(/\D/g, "");

  const html = `<!DOCTYPE html><html><body style="font-family:Segoe UI,sans-serif;background:#0a0a0a;color:#fff;padding:20px;margin:0">
    <div style="max-width:640px;margin:0 auto;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,${catColor},${catColor}cc);padding:22px;text-align:center">
        <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;opacity:0.9">CATEGORÍA ${categoria} · ${score} pts</div>
        <h1 style="margin:6px 0 0;font-size:22px">${prefix.replace(/^[^\s]+\s/, "")} — ${esc(nombre)}</h1>
      </div>
      <div style="padding:22px">
        ${categoria === "A" ? `<div style="background:#22c55e22;border:1px solid #22c55e;border-radius:10px;padding:14px;margin-bottom:18px;text-align:center">
          <a href="https://wa.me/${esc(phoneDigits)}" style="display:inline-block;background:#22c55e;color:#000;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">📱 Contactar por WhatsApp ahora</a>
        </div>` : ""}
        ${args.hasDraft ? `<div style="background:#06b6d422;border:1px dashed #06b6d4;border-radius:10px;padding:14px;margin-bottom:18px">
          <div style="font-size:12px;color:#06b6d4;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px">📝 Borrador de email comercial preparado</div>
          <div style="font-size:13px;color:#ccc">Revisa, edita y aprueba el envío al cliente desde el panel admin (pestaña <strong>Emails pendientes</strong>).</div>
        </div>` : ""}
        <table style="width:100%;border-collapse:collapse;background:rgba(255,255,255,0.04);border-radius:8px">
          ${row("Nombre", args.nombre)}
          ${row("Teléfono", args.telefono)}
          ${row("Email", args.email)}
          ${row("Tipo evento", EVENT_LABELS[args.tipo_evento] || args.tipo_evento)}
          ${row("Actividad", ACTIVITY_LABELS[args.actividad_interes] || "")}
          ${row("Edad participantes", AGE_LABELS[args.edad_participantes] || "")}
          ${row("Nº personas", PEOPLE_LABELS[args.num_personas] || "")}
          ${row("Presupuesto", BUDGET_LABELS[args.presupuesto] || "")}
          ${row("¿Cuándo?", WHEN_LABELS[args.cuando] || "")}
          ${row("Fecha orientativa", args.fecha_orientativa)}
          ${row("CP", args.codigo_postal)}
          ${row("Origen", args.como_nos_conociste)}
        </table>
        <div style="margin-top:18px;padding:14px;background:rgba(255,255,255,0.04);border-left:3px solid ${catColor};border-radius:6px">
          <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Motivos del score</div>
          <div style="font-size:13px;line-height:1.7">${motivos.map(m => esc(m)).join("<br/>") || "—"}</div>
        </div>
        ${utmRows ? `<div style="margin-top:14px"><div style="font-size:11px;color:#888;text-transform:uppercase;margin-bottom:6px">Origen tracking</div><table style="width:100%;border-collapse:collapse">${utmRows}</table></div>` : ""}
        <div style="margin-top:14px;font-size:11px;color:#666">${esc(args.page_url)}</div>
      </div>
      <div style="background:#0d0d1a;padding:14px;text-align:center;font-size:11px;color:#555">shootandrun · Alcantarilla, Murcia</div>
    </div>
  </body></html>`;

  return { subject, html };
}

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
    const email = trim(body.email, 150);
    const tipo_evento = trim(body.tipo_evento, 30);
    const actividad_interes = trim(body.actividad_interes, 30);
    const edad_participantes = trim(body.edad_participantes, 30);
    const num_personas = trim(body.num_personas, 30);
    const presupuesto = trim(body.presupuesto, 30);
    const cuando = trim(body.cuando, 30);
    const fecha_orientativa = trim(body.fecha_orientativa, 20);
    const codigo_postal = trim(body.codigo_postal, 10);
    const como_nos_conociste = trim(body.como_nos_conociste, 30);
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
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Email inválido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calcular score
    const { score, categoria, motivos } = calcScore({
      tipo_evento, actividad_interes, edad_participantes, num_personas,
      presupuesto, cuando, codigo_postal, como_nos_conociste,
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: leadRow, error: dbError } = await supabase.from("leads_rapidos").insert({
      nombre,
      telefono,
      email: email || null,
      tipo_evento,
      actividad_interes: actividad_interes || null,
      edad_participantes: edad_participantes || null,
      num_personas: num_personas || null,
      presupuesto: presupuesto || null,
      cuando: cuando || null,
      fecha_orientativa: fecha_orientativa || null,
      codigo_postal: codigo_postal || null,
      como_nos_conociste: como_nos_conociste || null,
      consentimiento,
      source,
      page_url: page_url || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: utm_content || null,
      utm_term: utm_term || null,
      client_timestamp: client_timestamp || null,
      score,
      categoria,
      motivos_score: motivos,
    }).select("id").single();

    if (dbError || !leadRow) {
      console.error("DB insert error:", dbError);
      return new Response(JSON.stringify({ error: "No se pudo guardar el lead" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generar borrador de email comercial al cliente (solo A y B con email)
    let hasDraft = false;
    if ((categoria === "A" || categoria === "B") && email) {
      try {
        const draft = buildLeadDraft({
          nombre, tipo_evento, num_personas, fecha_orientativa, actividad_interes, categoria,
        });
        const { error: draftErr } = await supabase.from("lead_emails_pendientes").insert({
          lead_id: leadRow.id,
          recipient_email: email,
          recipient_nombre: nombre,
          subject: draft.subject,
          body_html: draft.html,
          categoria,
          status: "pendiente_aprobacion",
        });
        if (draftErr) console.error("Draft insert error (non-fatal):", draftErr);
        else hasDraft = true;
      } catch (e) {
        console.error("Draft generation failed (non-fatal):", e);
      }
    }

    // Email notificación interna al admin
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const adminEmail = buildAdminEmail({
          nombre, telefono, email, tipo_evento, actividad_interes, edad_participantes,
          num_personas, presupuesto, cuando, fecha_orientativa, codigo_postal,
          como_nos_conociste, page_url, client_timestamp,
          utms: { utm_source, utm_medium, utm_campaign, utm_content, utm_term },
          score, categoria, motivos, hasDraft,
        });
        const r = await resend.emails.send({
          from: FROM,
          to: [ADMIN_EMAIL],
          cc: [CC_EMAIL],
          subject: adminEmail.subject,
          html: adminEmail.html,
        });
        if (r.error) console.error("Resend error (non-fatal):", r.error);
      } catch (e) {
        console.error("Email send failed (non-fatal):", e);
      }
    }

    return new Response(JSON.stringify({ success: true, score, categoria }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-lead-rapido error:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
