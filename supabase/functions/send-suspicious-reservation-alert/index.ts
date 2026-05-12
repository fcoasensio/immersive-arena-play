import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ADMIN_EMAIL = "reservas@shootandrun.es";
const CC_EMAIL = "info@shootandrun.es";
const ADMIN_URL = "https://shootandrunweb.lovable.app/admin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const esc = (s: string) =>
  String(s ?? "").replace(/[<>"'&]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" }[c] || c)
  );

interface Body {
  reservaId: string;
  score: number;
  motivos: string[];
  datos: {
    nombre_completo: string;
    email: string;
    telefono: string;
    dni_cif: string;
    direccion: string;
    codigo_postal: string;
    fecha: string;
    hora: string;
    actividad: string;
    tipo_reserva: string;
    num_participantes: number;
    notas: string | null;
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    if (!resend) {
      console.error("Missing RESEND_API_KEY");
      return new Response(JSON.stringify({ error: "Email no configurado" }), { status: 500, headers });
    }

    const body = (await req.json()) as Body;
    if (!body?.reservaId || !body?.datos) {
      return new Response(JSON.stringify({ error: "Datos incompletos" }), { status: 400, headers });
    }

    const { datos, motivos, score, reservaId } = body;
    const motivosHtml = (motivos || []).map((m) => `<li>${esc(m)}</li>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /></head>
<body style="font-family:Segoe UI,Arial,sans-serif;background:#0a0a0a;color:#fff;padding:20px;margin:0">
  <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#2e1a1a,#3e1616);border-radius:16px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#ff3366,#8b5cf6);padding:24px;text-align:center">
      <h1 style="margin:0;font-size:22px;letter-spacing:1px;color:#fff">⚠️ Reserva sospechosa</h1>
    </div>
    <div style="padding:24px">
      <p style="color:#ffd2d2;margin:0 0 16px">Se ha recibido una reserva marcada como <strong>sospechosa</strong> (score ${score}/100). NO se ha enviado email al cliente ni se ha creado evento en Google Calendar.</p>

      <h3 style="color:#ff8a8a;font-size:14px;text-transform:uppercase;letter-spacing:1px">Motivos detectados</h3>
      <ul style="color:#fff;line-height:1.6">${motivosHtml || "<li>(ninguno)</li>"}</ul>

      <h3 style="color:#ff8a8a;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin-top:20px">Datos enviados</h3>
      <table style="width:100%;border-collapse:collapse;color:#fff;font-size:14px">
        <tr><td style="padding:6px 0;color:#aaa;width:40%">Nombre</td><td>${esc(datos.nombre_completo)}</td></tr>
        <tr><td style="padding:6px 0;color:#aaa">Email</td><td>${esc(datos.email)}</td></tr>
        <tr><td style="padding:6px 0;color:#aaa">Teléfono</td><td>${esc(datos.telefono)}</td></tr>
        <tr><td style="padding:6px 0;color:#aaa">DNI/CIF</td><td>${esc(datos.dni_cif)}</td></tr>
        <tr><td style="padding:6px 0;color:#aaa">Dirección</td><td>${esc(datos.direccion)}, ${esc(datos.codigo_postal)}</td></tr>
        <tr><td style="padding:6px 0;color:#aaa">Fecha / Hora</td><td>${esc(datos.fecha)} · ${esc(datos.hora)}</td></tr>
        <tr><td style="padding:6px 0;color:#aaa">Actividad</td><td>${esc(datos.actividad)}</td></tr>
        <tr><td style="padding:6px 0;color:#aaa">Tipo</td><td>${esc(datos.tipo_reserva)}</td></tr>
        <tr><td style="padding:6px 0;color:#aaa">Participantes</td><td>${datos.num_participantes}</td></tr>
        ${datos.notas ? `<tr><td style="padding:6px 0;color:#aaa">Notas</td><td>${esc(datos.notas)}</td></tr>` : ""}
      </table>

      <div style="margin-top:24px;text-align:center">
        <a href="${ADMIN_URL}" style="background:#fff;color:#2e1a1a;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Revisar en el panel admin</a>
      </div>

      <p style="color:#aaa;font-size:12px;margin-top:24px;text-align:center">ID interno: ${esc(reservaId)}</p>
    </div>
  </div>
</body></html>`;

    const { error } = await resend.emails.send({
      from: "shootandrun <reservas@shootandrun.es>",
      to: [ADMIN_EMAIL],
      cc: [CC_EMAIL],
      subject: `⚠️ Reserva sospechosa (${score}/100) — ${datos.nombre_completo}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: "No se pudo enviar el aviso" }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers });
  }
});
