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
const GW = "https://connector-gateway.lovable.dev/google_sheets/v4";

const EVENT_LABELS: Record<string, string> = {
  cumpleanos: "🎂 Cumpleaños", empresa: "💼 Empresa / Team Building",
  despedida: "🎉 Despedida", colegio: "🏫 Colegio / Instituto",
  amigos: "👥 Grupo de amigos", otro: "✨ Otro",
};
const ACTIVITY_LABELS: Record<string, string> = {
  laser_tag: "Laser Tag", vr: "Realidad Virtual", no_se: "Por decidir",
};
const PEOPLE_LABELS: Record<string, string> = {
  "1_7": "1-7", "8_15": "8-15", "16_25": "16-25", "25_mas": "+25",
};

const esc = (t: string) =>
  String(t).replace(/[<>"'&]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" }[c] || c)
  );

// ============ NORMALIZATION ============
function normalizeTipoEvento(raw: string): string {
  const s = raw.toLowerCase().trim();
  if (!s) return "otro";
  if (/cumple|birthday|aniversario/.test(s)) return "cumpleanos";
  if (/empresa|team\s*build|corporat|trabajo|oficina/.test(s)) return "empresa";
  if (/despedid|soltero|soltera|stag|hen|bachelor/.test(s)) return "despedida";
  if (/colegio|institut|escuela|school/.test(s)) return "colegio";
  if (/amig|grupo|friends/.test(s)) return "amigos";
  return "otro";
}

function normalizeNumPersonas(raw: string): string | null {
  if (!raw) return null;
  const m = raw.match(/\d+/);
  if (!m) return null;
  const n = parseInt(m[0], 10);
  if (isNaN(n)) return null;
  if (n <= 7) return "1_7";
  if (n <= 15) return "8_15";
  if (n <= 25) return "16_25";
  return "25_mas";
}

function parseFecha(raw: string): string | null {
  if (!raw) return null;
  const s = raw.trim();
  // dd/mm/yyyy or dd-mm-yyyy
  const m1 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m1) {
    const [, d, mo, y] = m1;
    const yyyy = y.length === 2 ? `20${y}` : y;
    return `${yyyy}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // try Date
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

function deriveCuando(fecha: string | null): string | null {
  if (!fecha) return null;
  const target = new Date(fecha + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((target.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return "informandome";
  if (diffDays <= 7) return "esta_semana";
  if (diffDays <= 30) return "este_mes";
  return "1_2_meses";
}

// ============ SCORING (mirrors submit-lead-rapido) ============
type LeadInput = {
  tipo_evento: string; actividad_interes: string; edad_participantes: string;
  num_personas: string; presupuesto: string; cuando: string;
  codigo_postal: string; como_nos_conociste: string;
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
  if (/^30(0|8)\d{2}$/.test(l.codigo_postal)) add(5, "CP cercano");
  if (l.como_nos_conociste === "google" || l.como_nos_conociste === "instagram") add(5, "origen alta intención");
  const categoria: "A" | "B" | "C" = score >= 50 ? "A" : score >= 25 ? "B" : "C";
  return { score, categoria, motivos };
}

// ============ DRAFT EMAIL ============
function wrap(inner: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;background:#f6f6f6;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1a1a">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px 28px">
      <div style="font-family:'Courier New',monospace;font-weight:bold;font-size:18px;letter-spacing:1px;color:#0a0a0a;margin-bottom:24px">
        <span style="color:#06b6d4">shoot</span>andrun
      </div>
      <div style="font-size:15px;line-height:1.6">${inner}</div>
    </div>
  </body></html>`;
}

function buildLeadDraft(args: {
  nombre: string; tipo_evento: string; num_personas: string;
  fecha_orientativa: string; actividad_interes: string; categoria: "A" | "B";
}): { subject: string; html: string } {
  const { nombre, tipo_evento, num_personas, fecha_orientativa, actividad_interes, categoria } = args;
  const personas = num_personas ? PEOPLE_LABELS[num_personas] || num_personas : "";
  const actividadLabel = actividad_interes && actividad_interes !== "no_se"
    ? ACTIVITY_LABELS[actividad_interes] : "Laser Tag o Realidad Virtual";
  const fechaTxt = fecha_orientativa ? `el ${esc(fecha_orientativa)}` : "en la fecha que elijáis";
  const personasTxt = personas ? `${esc(personas)} personas` : "tu grupo";
  const eventoTxt = EVENT_LABELS[tipo_evento]?.replace(/^[^\s]+\s/, "").toLowerCase() || "evento";

  if (tipo_evento === "empresa") {
    return {
      subject: `Propuesta team building shootandrun para ${nombre}`,
      html: wrap(`
        <p>Hola ${esc(nombre)},</p>
        <p>Gracias por escribirnos por Instagram. Os hemos preparado una propuesta para vuestro evento de empresa enfocada en lo que de verdad funciona en team building: cooperación bajo presión, decisiones rápidas y mucho que celebrar después.</p>
        <p><strong>Para vuestro grupo de ${personasTxt} proponemos:</strong></p>
        <ul style="padding-left:18px;line-height:1.7">
          <li>⚡ Sesión de <strong>laser tag indoor</strong> (90 min) con modos por equipos rotativos</li>
          <li>🥽 Bloque opcional de <strong>VR free roam multijugador</strong> (sin mareos, hasta 6 simultáneos)</li>
          <li>🍕 Zona privada con catering opcional</li>
        </ul>
        <p>Reserva de franja con 50€ de Bizum, el resto se factura tras el evento <strong>sobre asistentes reales</strong>.</p>
        <p>¿Cerramos fecha esta semana? Responde a este email o llámanos al <strong>606 32 30 53</strong>.</p>
        <p style="margin-top:28px">Un saludo,<br/>Equipo <strong>shootandrun</strong><br/><span style="color:#888;font-size:13px">Alcantarilla, Murcia · +34 606 32 30 53</span></p>
      `),
    };
  }

  if (categoria === "A") {
    return {
      subject: `${nombre}, tu ${eventoTxt} en shootandrun: propuesta lista 🎯`,
      html: wrap(`
        <p>Hola ${esc(nombre)},</p>
        <p>Gracias por contactarnos por Instagram — hemos preparado una propuesta para vuestro <strong>${eventoTxt}</strong> de ${personasTxt} ${esc(fechaTxt)}.</p>
        <p>En <strong>shootandrun</strong> no hacemos partidas "de relleno": diseñamos cada experiencia para que cada minuto cuente.</p>
        <ul style="padding-left:18px;line-height:1.7">
          <li>🎯 <strong>${esc(actividadLabel)}</strong> en arena indoor con equipo profesional</li>
          <li>⚡ Briefing táctico + 3-4 modos de juego adaptados al grupo</li>
          <li>🎁 Zona privada para descanso o picoteo</li>
        </ul>
        <p><strong>Reserva con solo 50€ de Bizum</strong> al 606 32 30 53. El resto se paga el día y se calcula <strong>sobre los jugadores reales que asistan</strong>.</p>
        <p>Las franjas más demandadas vuelan rápido. Responde a este email y te confirmo disponibilidad <strong>hoy mismo</strong>.</p>
        <p style="margin-top:28px">Nos vemos en la arena ⚡<br/>Equipo <strong>shootandrun</strong><br/><span style="color:#888;font-size:13px">Alcantarilla, Murcia · +34 606 32 30 53</span></p>
      `),
    };
  }

  return {
    subject: `${nombre}, info sobre tu ${eventoTxt} en shootandrun`,
    html: wrap(`
      <p>Hola ${esc(nombre)},</p>
      <p>Gracias por escribirnos por Instagram. Te paso un resumen rápido para que puedas valorar vuestro <strong>${eventoTxt}</strong> en <strong>shootandrun</strong>:</p>
      <ul style="padding-left:18px;line-height:1.7">
        <li>🎯 <strong>Laser Tag</strong> indoor (a partir de 8 años) — el plan más versátil para grupos mixtos</li>
        <li>🥽 <strong>Realidad Virtual</strong> free-roam (a partir de 12 años) — experiencia tipo arcade premium</li>
        <li>📍 Estamos en Alcantarilla (Murcia), arena climatizada todo el año</li>
        <li>💳 Reserva con 50€ de Bizum; el resto se paga el día sobre jugadores reales</li>
      </ul>
      <p>Si me confirmas <strong>fecha aproximada y nº de personas</strong>, te paso disponibilidad y precio cerrado.</p>
      <p>Estoy disponible aquí o por WhatsApp al <strong>606 32 30 53</strong>.</p>
      <p style="margin-top:28px">Un saludo,<br/>Equipo <strong>shootandrun</strong><br/><span style="color:#888;font-size:13px">Alcantarilla, Murcia · +34 606 32 30 53</span></p>
    `),
  };
}

function buildAdminEmail(lead: {
  nombre: string; email: string; tipo_evento: string; num_personas: string;
  fecha_orientativa: string; categoria: "A" | "B" | "C"; score: number;
  motivos: string[]; hasDraft: boolean;
}): { subject: string; html: string } {
  const { categoria, score, nombre, tipo_evento, motivos } = lead;
  const prefix = categoria === "A" ? "🔥 LEAD A" : categoria === "B" ? "⚡ LEAD B" : "📋 Lead C";
  const subject = `${prefix} (Instagram) - ${nombre} (${EVENT_LABELS[tipo_evento] || tipo_evento}) · ${score}pts`;
  const catColor = categoria === "A" ? "#22c55e" : categoria === "B" ? "#f59e0b" : "#94a3b8";
  const html = `<!DOCTYPE html><html><body style="font-family:Segoe UI,sans-serif;background:#0a0a0a;color:#fff;padding:20px;margin:0">
    <div style="max-width:640px;margin:0 auto;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,${catColor},${catColor}cc);padding:22px;text-align:center">
        <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;opacity:0.9">📸 INSTAGRAM · CATEGORÍA ${categoria} · ${score} pts</div>
        <h1 style="margin:6px 0 0;font-size:22px">${esc(nombre)}</h1>
      </div>
      <div style="padding:22px">
        ${lead.hasDraft ? `<div style="background:#06b6d422;border:1px dashed #06b6d4;border-radius:10px;padding:14px;margin-bottom:18px">
          <div style="font-size:12px;color:#06b6d4;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px">📝 Borrador de email comercial preparado</div>
          <div style="font-size:13px;color:#ccc">Revisa y aprueba el envío desde el panel admin (pestaña <strong>Emails pendientes</strong>).</div>
        </div>` : ""}
        <table style="width:100%;border-collapse:collapse;background:rgba(255,255,255,0.04);border-radius:8px">
          <tr><td style="padding:5px 10px;color:#888;font-size:12px">Nombre</td><td style="padding:5px 10px;font-size:13px">${esc(nombre)}</td></tr>
          <tr><td style="padding:5px 10px;color:#888;font-size:12px">Email</td><td style="padding:5px 10px;font-size:13px">${esc(lead.email)}</td></tr>
          <tr><td style="padding:5px 10px;color:#888;font-size:12px">Tipo evento</td><td style="padding:5px 10px;font-size:13px">${esc(EVENT_LABELS[tipo_evento] || tipo_evento)}</td></tr>
          <tr><td style="padding:5px 10px;color:#888;font-size:12px">Nº personas</td><td style="padding:5px 10px;font-size:13px">${esc(PEOPLE_LABELS[lead.num_personas] || "—")}</td></tr>
          <tr><td style="padding:5px 10px;color:#888;font-size:12px">Fecha orientativa</td><td style="padding:5px 10px;font-size:13px">${esc(lead.fecha_orientativa || "—")}</td></tr>
        </table>
        <div style="margin-top:18px;padding:14px;background:rgba(255,255,255,0.04);border-left:3px solid ${catColor};border-radius:6px">
          <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Motivos del score</div>
          <div style="font-size:13px;line-height:1.7">${motivos.map(m => esc(m)).join("<br/>") || "—"}</div>
        </div>
      </div>
      <div style="background:#0d0d1a;padding:14px;text-align:center;font-size:11px;color:#555">shootandrun · Origen: Instagram (Google Sheet)</div>
    </div>
  </body></html>`;
  return { subject, html };
}

// ============ MAIN ============
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_SHEETS_API_KEY = Deno.env.get("GOOGLE_SHEETS_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (!LOVABLE_API_KEY || !GOOGLE_SHEETS_API_KEY) {
      return new Response(JSON.stringify({ error: "Google Sheets connector no configurado" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Load active sync configs
    const { data: configs, error: cfgErr } = await supabase
      .from("instagram_sync_config")
      .select("id, spreadsheet_id, sheet_name")
      .eq("active", true);
    if (cfgErr) throw new Error(`config read: ${cfgErr.message}`);
    if (!configs || configs.length === 0) {
      return new Response(JSON.stringify({ ok: true, message: "Sin configuración activa" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = resendKey ? new Resend(resendKey) : null;
    const summary = { procesados: 0, errores: 0, omitidos: 0, sheets: [] as any[] };

    for (const cfg of configs) {
      const sheetName = cfg.sheet_name || "Instagram";
      const range = `${sheetName}!A2:G1000`;
      const url = `${GW}/spreadsheets/${cfg.spreadsheet_id}/values/${range}`;

      const sheetRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": GOOGLE_SHEETS_API_KEY,
        },
      });
      if (!sheetRes.ok) {
        const txt = await sheetRes.text();
        console.error(`Sheet read failed ${sheetRes.status}:`, txt);
        summary.errores++;
        summary.sheets.push({ id: cfg.spreadsheet_id, error: `read ${sheetRes.status}` });
        continue;
      }
      const sheetData = await sheetRes.json();
      const rows: string[][] = sheetData.values || [];

      const updates: { range: string; values: string[][] }[] = [];
      let processedThisSheet = 0;
      let skippedThisSheet = 0;
      let errorsThisSheet = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2; // header at row 1
        const [fechaCell, nombre, email, tipoEvento, numPersonasRaw, fechaEvento, procesado] = [
          row[0] || "", row[1] || "", row[2] || "", row[3] || "", row[4] || "", row[5] || "", row[6] || "",
        ];
        if (procesado.trim()) continue; // already processed
        if (!nombre.trim() || !email.trim()) {
          skippedThisSheet++;
          updates.push({ range: `${sheetName}!G${rowNum}`, values: [["SKIP: faltan datos"]] });
          continue;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          skippedThisSheet++;
          updates.push({ range: `${sheetName}!G${rowNum}`, values: [["SKIP: email inválido"]] });
          continue;
        }

        try {
          const tipo = normalizeTipoEvento(tipoEvento);
          const num = normalizeNumPersonas(numPersonasRaw) || "";
          const fechaOrientativa = parseFecha(fechaEvento);
          const cuando = deriveCuando(fechaOrientativa) || "";

          const scoring = calcScore({
            tipo_evento: tipo,
            actividad_interes: "no_se",
            edad_participantes: "",
            num_personas: num,
            presupuesto: "",
            cuando,
            codigo_postal: "",
            como_nos_conociste: "instagram",
          });

          // Dedupe: same email + tipo + fecha in last 24h
          const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
          const { data: existing } = await supabase
            .from("leads_rapidos")
            .select("id")
            .eq("email", email.trim())
            .eq("tipo_evento", tipo)
            .gte("created_at", since)
            .limit(1);
          if (existing && existing.length > 0) {
            skippedThisSheet++;
            updates.push({ range: `${sheetName}!G${rowNum}`, values: [[`DUP: ${new Date().toISOString()}`]] });
            continue;
          }

          const { data: leadRow, error: insErr } = await supabase
            .from("leads_rapidos")
            .insert({
              nombre: nombre.trim().slice(0, 100),
              telefono: null,
              email: email.trim().slice(0, 150),
              tipo_evento: tipo,
              actividad_interes: "no_se",
              num_personas: num || null,
              fecha_orientativa: fechaOrientativa,
              cuando: cuando || null,
              como_nos_conociste: "instagram",
              consentimiento: true,
              source: "instagram_sheet",
              score: scoring.score,
              categoria: scoring.categoria,
              motivos_score: scoring.motivos,
            })
            .select("id")
            .single();

          if (insErr || !leadRow) throw new Error(`insert: ${insErr?.message}`);

          // Draft for A/B
          let hasDraft = false;
          if (scoring.categoria === "A" || scoring.categoria === "B") {
            const draft = buildLeadDraft({
              nombre: nombre.trim(),
              tipo_evento: tipo,
              num_personas: num,
              fecha_orientativa: fechaOrientativa || "",
              actividad_interes: "no_se",
              categoria: scoring.categoria,
            });
            const { error: dErr } = await supabase.from("lead_emails_pendientes").insert({
              lead_id: leadRow.id,
              recipient_email: email.trim(),
              recipient_nombre: nombre.trim(),
              subject: draft.subject,
              body_html: draft.html,
              categoria: scoring.categoria,
              status: "pendiente_aprobacion",
            });
            if (!dErr) hasDraft = true;
            else console.error("draft insert:", dErr);
          }

          // Admin email
          if (resend) {
            try {
              const adm = buildAdminEmail({
                nombre: nombre.trim(), email: email.trim(),
                tipo_evento: tipo, num_personas: num,
                fecha_orientativa: fechaOrientativa || "",
                categoria: scoring.categoria, score: scoring.score,
                motivos: scoring.motivos, hasDraft,
              });
              await resend.emails.send({
                from: FROM, to: [ADMIN_EMAIL], cc: [CC_EMAIL],
                subject: adm.subject, html: adm.html,
              });
            } catch (e) { console.error("admin email:", e); }
          }

          processedThisSheet++;
          updates.push({ range: `${sheetName}!G${rowNum}`, values: [[`OK ${new Date().toISOString().slice(0, 16).replace("T", " ")}`]] });
        } catch (e) {
          errorsThisSheet++;
          console.error(`row ${rowNum} error:`, e);
          updates.push({ range: `${sheetName}!G${rowNum}`, values: [[`ERROR: ${(e as Error).message?.slice(0, 80)}`]] });
        }
      }

      // Batch update column G
      if (updates.length > 0) {
        const updRes = await fetch(
          `${GW}/spreadsheets/${cfg.spreadsheet_id}/values:batchUpdate`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": GOOGLE_SHEETS_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ valueInputOption: "RAW", data: updates }),
          },
        );
        if (!updRes.ok) {
          const txt = await updRes.text();
          console.error(`Batch update failed ${updRes.status}:`, txt);
        }
      }

      await supabase
        .from("instagram_sync_config")
        .update({ last_sync_at: new Date().toISOString() })
        .eq("id", cfg.id);

      summary.procesados += processedThisSheet;
      summary.omitidos += skippedThisSheet;
      summary.errores += errorsThisSheet;
      summary.sheets.push({
        id: cfg.spreadsheet_id, sheet: sheetName,
        procesados: processedThisSheet, omitidos: skippedThisSheet, errores: errorsThisSheet,
      });
    }

    return new Response(JSON.stringify({ ok: true, ...summary }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("sync-leads-instagram error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
