import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ADMIN_EMAIL = "reservas@shootandrun.es";
const LOGO_URL = "https://pbfvhwgnpewmljkvckfw.supabase.co/storage/v1/object/public/email-assets/logo-shootandrun.png";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const getActivityLabel = (type: string) => {
  const labels: Record<string, string> = {
    laser_tag: "Láser Tag",
    realidad_virtual: "Realidad Virtual",
    combinada: "Combinada",
  };
  return labels[type] || type;
};

const getReservationTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    cumpleanos: "Cumpleaños",
    grupos: "Grupos",
    despedida: "Despedida",
  };
  return labels[type] || type;
};

interface RescheduleData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  previousDate: string;
  previousTime: string;
  newDate: string;
  newTime: string;
  numberOfPeople: number;
  activityType: string;
  reservationType: string;
}

const formatDate = (raw: string): string => {
  if (!raw) return raw;
  if (raw.includes("-")) {
    const parts = raw.split("-");
    if (parts[0].length === 4) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return parts.join("/");
  }
  return raw;
};

const formatTime = (raw: string): string => (raw ? raw.slice(0, 5) : raw);

function buildCustomerEmail(d: RescheduleData): string {
  return `
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a1a2e;padding:30px;text-align:center;">
          <img src="${LOGO_URL}" alt="shootandrun" width="180" style="display:block;margin:0 auto 15px;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">📅 Cambio de fecha/hora</h1>
        </td></tr>
        <tr><td style="padding:30px;">
          <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 20px;">Hola <strong>${d.customerName}</strong>,</p>
          <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 25px;">Le confirmamos que su reserva ha sido reprogramada con los siguientes datos:</p>

          <table width="100%" cellpadding="12" cellspacing="0" style="background:#fff5f5;border:2px solid #EF4444;border-radius:8px;margin-bottom:15px;">
            <tr><td style="text-align:center;color:#666;font-size:13px;">Fecha y hora anterior</td></tr>
            <tr><td style="text-align:center;color:#EF4444;font-size:18px;font-weight:bold;text-decoration:line-through;">
              ${formatDate(d.previousDate)} · ${formatTime(d.previousTime)}
            </td></tr>
          </table>

          <div style="text-align:center;font-size:24px;color:#666;margin:10px 0;">⬇️</div>

          <table width="100%" cellpadding="12" cellspacing="0" style="background:#f0fdf4;border:2px solid #22C55E;border-radius:8px;margin-bottom:25px;">
            <tr><td style="text-align:center;color:#666;font-size:13px;">Nueva fecha y hora</td></tr>
            <tr><td style="text-align:center;color:#22C55E;font-size:20px;font-weight:bold;">
              ${formatDate(d.newDate)} · ${formatTime(d.newTime)}
            </td></tr>
          </table>

          <table width="100%" cellpadding="8" cellspacing="0" style="background:#f8f9fa;border-radius:8px;font-size:14px;">
            <tr><td style="color:#666;border-bottom:1px solid #eee;"><strong>Actividad</strong></td><td style="border-bottom:1px solid #eee;">${getActivityLabel(d.activityType)}</td></tr>
            <tr><td style="color:#666;border-bottom:1px solid #eee;"><strong>Tipo</strong></td><td style="border-bottom:1px solid #eee;">${getReservationTypeLabel(d.reservationType)}</td></tr>
            <tr><td style="color:#666;"><strong>Participantes</strong></td><td>${d.numberOfPeople}</td></tr>
          </table>

          <p style="color:#333;font-size:14px;line-height:1.6;margin:25px 0 0;">Para cualquier consulta no dude en contactarnos.</p>
        </td></tr>
        <tr><td style="background:#f8f9fa;padding:25px 30px;border-top:1px solid #eee;text-align:center;">
          <p style="color:#666;font-size:13px;margin:0 0 5px;">📍 Avda. Fernando III El Santo, 24. 30820-Alcantarilla (Murcia)</p>
          <p style="color:#666;font-size:13px;margin:0 0 5px;">📞 +34 606 323 053</p>
          <p style="color:#666;font-size:13px;margin:0;">✉️ <a href="mailto:reservas@shootandrun.es" style="color:#3B82F6;">reservas@shootandrun.es</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildAdminEmail(d: RescheduleData): string {
  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#1a1a2e;padding:20px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:18px;">📅 Cambio de fecha/hora de reserva</h1>
        </td></tr>
        <tr><td style="padding:25px;">
          <p style="margin:0 0 15px;font-size:14px;color:#333;">
            <strong>${d.customerName}</strong> (${d.customerEmail}) — ${d.customerPhone}
          </p>
          <p style="margin:0 0 15px;font-size:14px;color:#333;">
            ${getReservationTypeLabel(d.reservationType)} · ${getActivityLabel(d.activityType)} · ${d.numberOfPeople} pers.
          </p>
          <p style="margin:0;font-size:15px;">
            <span style="color:#EF4444;text-decoration:line-through;">${formatDate(d.previousDate)} ${formatTime(d.previousTime)}</span>
            → 
            <span style="color:#22C55E;font-weight:bold;">${formatDate(d.newDate)} ${formatTime(d.newTime)}</span>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resend) throw new Error("RESEND_API_KEY not configured");

    const data: RescheduleData = await req.json();

    if (!data.customerEmail || !data.customerName || !data.newDate || !data.newTime) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerHtml = buildCustomerEmail(data);
    const adminHtml = buildAdminEmail(data);

    const [customerResult, adminResult] = await Promise.all([
      resend.emails.send({
        from: `shootandrun <noreply@web.shootandrun.es>`,
        to: [data.customerEmail],
        subject: `📅 Cambio de fecha — Tu reserva en shootandrun`,
        html: customerHtml,
      }),
      resend.emails.send({
        from: `shootandrun <noreply@web.shootandrun.es>`,
        to: [ADMIN_EMAIL],
        subject: `[Admin] Cambio de fecha/hora — ${data.customerName}`,
        html: adminHtml,
      }),
    ]);

    console.log("Reschedule emails sent", { customerResult, adminResult });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending reschedule emails:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
