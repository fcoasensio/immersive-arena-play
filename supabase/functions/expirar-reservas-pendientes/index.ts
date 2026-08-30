import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { appendGdprFooter } from "../_shared/gdpr-footer.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FROM_EMAIL = "shootandrun <reservas@web.shootandrun.es>";
const OWNER_EMAIL = "hola@shootandrun.es";
const ADMIN_EMAIL = "reservas@shootandrun.es";
const CC_EMAIL = "fcoasensio@shootandrun.es";
const LOGO_URL = "https://pbfvhwgnpewmljkvckfw.supabase.co/storage/v1/object/public/email-assets/logo-shootandrun.png";
const BATCH_LIMIT = 20;

const ACTIVITY_LABELS: Record<string, string> = {
  laser_tag: "Láser Tag",
  realidad_virtual: "Realidad Virtual",
  combinada: "Láser Tag + Realidad Virtual",
};

const TYPE_LABELS: Record<string, string> = {
  cumpleanos: "Cumpleaños",
  grupos: "Grupos",
  despedida: "Despedida",
};

function formatMadrid(iso: string): string {
  return new Date(iso).toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit",
  });
}

function baseEmail(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html><head><style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; }
    .logo-bar { background: #0d0d1a; padding: 20px; text-align: center; }
    .logo-bar img { height: 40px; }
    .header { background: linear-gradient(135deg, #00d4ff 0%, #8b5cf6 50%, #ff3366 100%); padding: 28px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 2px; color: #fff; }
    .content { padding: 30px; }
    .summary { background: rgba(255,255,255,0.05); padding: 18px; border-radius: 12px; margin: 18px 0; font-size: 14px; color: #ccc; line-height: 1.7; }
    .summary strong { color: #00d4ff; }
    .cta { display: inline-block; background: linear-gradient(135deg, #00d4ff, #8b5cf6); color: #fff !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; margin-top: 10px; }
    .footer { background: #0d0d1a; padding: 16px; text-align: center; font-size: 11px; color: #555; }
  </style></head><body>
    <div class="container">
      <div class="logo-bar"><img src="${LOGO_URL}" alt="shootandrun" /></div>
      <div class="header"><h1>${title}</h1></div>
      <div class="content">${bodyHtml}</div>
      <div class="footer">© ${new Date().getFullYear()} shootandrun · Alcantarilla, Murcia</div>
    </div>
  </body></html>`;
}

function resumenReserva(r: any): string {
  return `<div class="summary">
    <div>👤 <strong>${r.nombre_completo}</strong></div>
    <div>📅 ${new Date(r.fecha + "T00:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })} a las <strong>${String(r.hora).slice(0, 5)}</strong></div>
    <div>🎯 ${ACTIVITY_LABELS[r.actividad] || r.actividad} · ${TYPE_LABELS[r.tipo_reserva] || r.tipo_reserva}</div>
    <div>👥 ${r.num_participantes} participantes</div>
    <div>💰 Total: <strong>${Number(r.precio_final || 0).toFixed(2)} €</strong> · Anticipo Bizum: <strong>50 €</strong></div>
  </div>`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY no configurado" }), { status: 500, headers });
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const resend = new Resend(resendApiKey);

    // Leer configuración (antelación del recordatorio)
    let recordatorioMinutos = 60;
    const { data: recConfig } = await supabase.from("configuracion").select("valor").eq("clave", "reserva_recordatorio_minutos").maybeSingle();
    if (recConfig) {
      const rv = typeof recConfig.valor === "number" ? recConfig.valor : parseFloat(String(recConfig.valor));
      if (!isNaN(rv) && rv >= 0 && rv <= 1440) recordatorioMinutos = rv;
    }

    const now = new Date();
    const reminderThreshold = new Date(now.getTime() + recordatorioMinutos * 60 * 1000).toISOString();
    const nowIso = now.toISOString();

    let recordatoriosEnviados = 0;
    let canceladas = 0;
    const errores: string[] = [];

    // ── PASO 1: recordatorios (~1 hora antes de expirar) ─────────────
    const { data: paraRecordar, error: errRec } = await supabase
      .from("reservas")
      .select("id, nombre_completo, email, telefono, fecha, hora, actividad, tipo_reserva, num_participantes, precio_final, expira_at")
      .eq("estado", "pendiente_pago")
      .is("recordatorio_enviado_at", null)
      .gt("expira_at", nowIso)
      .lte("expira_at", reminderThreshold)
      .order("expira_at", { ascending: true })
      .limit(BATCH_LIMIT);

    if (errRec) {
      console.error("Error fetching reminders:", errRec);
      errores.push("recordatorios: " + errRec.message);
    }

    for (const r of paraRecordar || []) {
      try {
        const expiraTexto = formatMadrid(r.expira_at);
        const html = baseEmail(
          "⏰ Última llamada: confirma tu reserva",
          `
          <p style="font-size:18px;margin-top:0">¡Hola ${r.nombre_completo}!</p>
          <p style="color:#ccc">Quedan <strong style="color:#ff3366">menos de 60 minutos</strong> para confirmar tu reserva. Tu franja horaria quedará libre para otros clientes si no recibimos el Bizum antes de las <strong style="color:#fff">${expiraTexto}</strong> (hora de Madrid).</p>
          ${resumenReserva(r)}
          <div style="background:rgba(255,51,102,0.10);border:2px solid #ff3366;border-radius:12px;padding:18px;margin:18px 0;text-align:center">
            <div style="font-size:14px;font-weight:700;color:#ff3366;text-transform:uppercase">Confirma ahora</div>
            <p style="color:#ccc;font-size:14px;margin:10px 0 0">Haz un <strong style="color:#fff">Bizum de 50 € al 606 323 053</strong> indicando tu nombre y la fecha de la reserva.</p>
          </div>
          <p style="color:#888;font-size:13px">Si ya has hecho el Bizum, ignora este mensaje: tu reserva se confirmará en cuanto lo comprobemos.</p>`
        );

        const { error: sendErr } = await resend.emails.send({
          from: FROM_EMAIL,
          to: [r.email],
          subject: `⏰ Última llamada: confirma tu reserva de shootandrun antes de las ${expiraTexto}`,
          html: appendGdprFooter(html),
        });
        if (sendErr) throw new Error(sendErr.message);

        const { error: upErr } = await supabase
          .from("reservas")
          .update({ recordatorio_enviado_at: nowIso })
          .eq("id", r.id)
          .is("recordatorio_enviado_at", null);
        if (upErr) throw upErr;
        recordatoriosEnviados++;
      } catch (e) {
        console.error(`Error recordatorio reserva ${r.id}:`, e);
        errores.push(`recordatorio ${r.id}: ${e instanceof Error ? e.message : e}`);
      }
    }

    // ── PASO 2: expirar reservas sin Bizum ────────────────────────────
    const { data: paraExpirar, error: errExp } = await supabase
      .from("reservas")
      .select("id, nombre_completo, email, telefono, fecha, hora, actividad, tipo_reserva, num_participantes, precio_final, expira_at, google_calendar_event_id")
      .eq("estado", "pendiente_pago")
      .not("expira_at", "is", null)
      .lte("expira_at", nowIso)
      .order("expira_at", { ascending: true })
      .limit(BATCH_LIMIT);

    if (errExp) {
      console.error("Error fetching expired:", errExp);
      errores.push("expiración: " + errExp.message);
    }

    for (const r of paraExpirar || []) {
      try {
        // 1. Eliminar el evento de Google Calendar para liberar la hora
        if (r.google_calendar_event_id) {
          try {
            const { error: calErr } = await supabase.functions.invoke("check-calendar-availability", {
              body: { action: "delete", eventId: r.google_calendar_event_id },
            });
            if (calErr) console.error(`Error borrando evento ${r.google_calendar_event_id}:`, calErr);
          } catch (calE) {
            console.error(`Error invocando delete de calendario para ${r.id}:`, calE);
          }
        }

        // 2. Marcar como cancelada (guarda de concurrencia: solo si sigue pendiente_pago)
        const { data: updated, error: upErr } = await supabase
          .from("reservas")
          .update({
            estado: "cancelada",
            cancelada_motivo: "no_confirmada",
            google_calendar_event_id: null,
          })
          .eq("id", r.id)
          .eq("estado", "pendiente_pago")
          .select("id");
        if (upErr) throw upErr;
        if (!updated || updated.length === 0) continue; // otro proceso la cambió

        canceladas++;

        // 3. Email al cliente
        const htmlCliente = baseEmail(
          "Reserva cancelada por falta de confirmación",
          `
          <p style="font-size:18px;margin-top:0">Hola ${r.nombre_completo},</p>
          <p style="color:#ccc">No hemos recibido el Bizum de 50 € dentro del plazo, por lo que tu reserva ha sido <strong style="color:#ff8095">cancelada automáticamente</strong> y la hora ha quedado disponible para otros clientes.</p>
          ${resumenReserva(r)}
          <p style="color:#ccc">Si sigues interesado/a, puedes hacer una nueva reserva (sujeta a disponibilidad):</p>
          <p style="text-align:center"><a class="cta" href="https://shootandrun.es/#reservas">Volver a reservar</a></p>
          <p style="color:#888;font-size:13px;margin-top:18px">Si ya hiciste el Bizum o crees que es un error, llámanos al <a href="tel:+34606323053" style="color:#00d4ff">+34 606 323 053</a>.</p>`
        );

        const { error: sendErr1 } = await resend.emails.send({
          from: FROM_EMAIL,
          to: [r.email],
          subject: "Tu reserva en shootandrun ha sido cancelada por falta de confirmación",
          html: appendGdprFooter(htmlCliente),
        });
        if (sendErr1) console.error("Error email cliente cancelación:", sendErr1);

        // 4. Aviso interno
        const htmlInterno = baseEmail(
          "Reserva cancelada automáticamente",
          `
          <p style="color:#ccc">La siguiente reserva ha sido <strong style="color:#ff8095">cancelada por no recibir el Bizum</strong> en 5 horas. El evento se ha eliminado del calendario y la hora vuelve a estar libre.</p>
          ${resumenReserva(r)}
          <p style="color:#888;font-size:13px">📞 ${r.telefono} · ✉️ ${r.email}</p>`
        );

        const { error: sendErr2 } = await resend.emails.send({
          from: FROM_EMAIL,
          to: [OWNER_EMAIL, ADMIN_EMAIL],
          cc: [CC_EMAIL],
          subject: `❌ Reserva cancelada automáticamente (sin Bizum) - ${r.nombre_completo}`,
          html: appendGdprFooter(htmlInterno),
        });
        if (sendErr2) console.error("Error email interno cancelación:", sendErr2);
      } catch (e) {
        console.error(`Error expirando reserva ${r.id}:`, e);
        errores.push(`expiración ${r.id}: ${e instanceof Error ? e.message : e}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, recordatoriosEnviados, canceladas, errores }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("Unexpected error in expirar-reservas-pendientes:", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor." }), { status: 500, headers });
  }
});
