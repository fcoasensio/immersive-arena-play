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

const estadoLabels: Record<string, string> = {
  pendiente_pago: "⏳ Pendiente de pago",
  pago_recibido: "💰 Pago recibido",
  confirmada: "✅ Confirmada",
  cancelada: "❌ Cancelada",
};

const estadoColors: Record<string, string> = {
  pendiente_pago: "#EAB308",
  pago_recibido: "#3B82F6",
  confirmada: "#22C55E",
  cancelada: "#EF4444",
};

const estadoMessages: Record<string, string> = {
  pendiente_pago: "Su reserva está pendiente de pago. Para confirmarla, realice un bizum de 50€ al número 606323053.",
  pago_recibido: "Hemos recibido su pago. Nuestro equipo revisará su reserva y le confirmaremos a la mayor brevedad.",
  confirmada: "¡Su reserva ha sido confirmada! Le esperamos el día del evento. Recibirá los detalles para el día del evento.",
  cancelada: "Su reserva ha sido cancelada. Si tiene alguna duda, no dude en contactar con nosotros.",
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

interface StatusChangeData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  numberOfPeople: number;
  activityType: string;
  reservationType: string;
  duration: string;
  priceFinal?: number;
  newStatus: string;
  previousStatus: string;
}

function buildCustomerEmail(data: StatusChangeData): string {
  const statusLabel = estadoLabels[data.newStatus] || data.newStatus;
  const statusColor = estadoColors[data.newStatus] || "#666";
  const statusMessage = estadoMessages[data.newStatus] || "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:#1a1a2e;padding:30px;text-align:center;">
          <img src="${LOGO_URL}" alt="shootandrun" width="180" style="display:block;margin:0 auto 15px;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">Actualización de su reserva</h1>
        </td></tr>
        <!-- Status badge -->
        <tr><td style="padding:30px 30px 10px;text-align:center;">
          <div style="display:inline-block;background:${statusColor}22;border:2px solid ${statusColor};border-radius:8px;padding:12px 24px;">
            <span style="color:${statusColor};font-size:18px;font-weight:bold;">${statusLabel}</span>
          </div>
        </td></tr>
        <!-- Message -->
        <tr><td style="padding:15px 30px 25px;">
          <p style="color:#333;font-size:15px;line-height:1.6;text-align:center;margin:0;">${statusMessage}</p>
        </td></tr>
        <!-- Reservation details -->
        <tr><td style="padding:0 30px 25px;">
          <table width="100%" cellpadding="8" cellspacing="0" style="background:#f8f9fa;border-radius:8px;font-size:14px;">
            <tr><td style="color:#666;border-bottom:1px solid #eee;"><strong>Cliente</strong></td><td style="border-bottom:1px solid #eee;">${data.customerName}</td></tr>
            <tr><td style="color:#666;border-bottom:1px solid #eee;"><strong>Actividad</strong></td><td style="border-bottom:1px solid #eee;">${getActivityLabel(data.activityType)}</td></tr>
            <tr><td style="color:#666;border-bottom:1px solid #eee;"><strong>Tipo</strong></td><td style="border-bottom:1px solid #eee;">${getReservationTypeLabel(data.reservationType)}</td></tr>
            <tr><td style="color:#666;border-bottom:1px solid #eee;"><strong>Fecha</strong></td><td style="border-bottom:1px solid #eee;">${data.reservationDate}</td></tr>
            <tr><td style="color:#666;border-bottom:1px solid #eee;"><strong>Hora</strong></td><td style="border-bottom:1px solid #eee;">${data.reservationTime}</td></tr>
            <tr><td style="color:#666;border-bottom:1px solid #eee;"><strong>Participantes</strong></td><td style="border-bottom:1px solid #eee;">${data.numberOfPeople}</td></tr>
            ${data.priceFinal ? `<tr><td style="color:#666;"><strong>Precio total</strong></td><td><strong>${data.priceFinal}€</strong></td></tr>` : ''}
          </table>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8f9fa;padding:25px 30px;border-top:1px solid #eee;text-align:center;">
          <p style="color:#666;font-size:13px;margin:0 0 5px;">📍 Avda. Fernando III El Santo, 24. 30820-Alcantarilla (Murcia)</p>
          <p style="color:#666;font-size:13px;margin:0 0 5px;">📞 +34 606 323 053</p>
          <p style="color:#666;font-size:13px;margin:0;">✉️ <a href="mailto:reservas@shootandrun.es" style="color:#3B82F6;">reservas@shootandrun.es</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildAdminEmail(data: StatusChangeData): string {
  const statusLabel = estadoLabels[data.newStatus] || data.newStatus;
  const prevLabel = estadoLabels[data.previousStatus] || data.previousStatus;
  const statusColor = estadoColors[data.newStatus] || "#666";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#1a1a2e;padding:20px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:18px;">Cambio de estado de reserva</h1>
        </td></tr>
        <tr><td style="padding:25px;">
          <p style="margin:0 0 15px;font-size:14px;color:#333;">
            <strong>${data.customerName}</strong> (${data.customerEmail}) — ${data.customerPhone}
          </p>
          <p style="margin:0 0 15px;font-size:14px;color:#333;">
            ${getReservationTypeLabel(data.reservationType)} · ${getActivityLabel(data.activityType)} · ${data.reservationDate} ${data.reservationTime} · ${data.numberOfPeople} pers.
            ${data.priceFinal ? ` · ${data.priceFinal}€` : ''}
          </p>
          <p style="margin:0;font-size:15px;">
            ${prevLabel} → <span style="color:${statusColor};font-weight:bold;">${statusLabel}</span>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resend) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const data: StatusChangeData = await req.json();

    if (!data.customerEmail || !data.newStatus || !data.customerName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [day, month, year] = data.reservationDate?.includes("-")
      ? (() => {
          const parts = data.reservationDate.split("-");
          return parts[0].length === 4 ? [parts[2], parts[1], parts[0]] : parts;
        })()
      : [data.reservationDate, "", ""];
    const formattedDate = day && month && year ? `${day}/${month}/${year}` : data.reservationDate;

    const customerHtml = buildCustomerEmail({ ...data, reservationDate: formattedDate });
    const adminHtml = buildAdminEmail({ ...data, reservationDate: formattedDate });

    const statusLabel = estadoLabels[data.newStatus] || data.newStatus;

    // Send both emails in parallel
    const [customerResult, adminResult] = await Promise.all([
      resend.emails.send({
        from: `shootandrun <noreply@web.shootandrun.es>`,
        to: [data.customerEmail],
        subject: `${statusLabel} — Tu reserva en shootandrun`,
        html: customerHtml,
      }),
      resend.emails.send({
        from: `shootandrun <noreply@web.shootandrun.es>`,
        to: [ADMIN_EMAIL],
        subject: `[Admin] ${statusLabel} — ${data.customerName}`,
        html: adminHtml,
      }),
    ]);

    console.log("Status change emails sent", { customerResult, adminResult });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending status change emails:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
