import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ADMIN_EMAIL = "outdoor@shootandrun.es";
const CC_EMAIL = "info@shootandrun.es";
const LOGO_URL = "https://pbfvhwgnpewmljkvckfw.supabase.co/storage/v1/object/public/email-assets/logo-shootandrun.png";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- Rate Limiting ---
const IP_WINDOW_MS = 60 * 1000;
const IP_MAX_REQUESTS = 5;
const EMAIL_WINDOW_MS = 60 * 60 * 1000;
const EMAIL_MAX_REQUESTS = 2;

const ipRequests = new Map<string, number[]>();
const emailRequests = new Map<string, number[]>();

function cleanupEntries(store: Map<string, number[]>, windowMs: number) {
  const now = Date.now();
  for (const [key, timestamps] of store.entries()) {
    const valid = timestamps.filter(t => now - t < windowMs);
    if (valid.length === 0) store.delete(key);
    else store.set(key, valid);
  }
}

function isRateLimited(store: Map<string, number[]>, key: string, windowMs: number, maxRequests: number): boolean {
  cleanupEntries(store, windowMs);
  const now = Date.now();
  const timestamps = store.get(key) || [];
  const recentTimestamps = timestamps.filter(t => now - t < windowMs);
  if (recentTimestamps.length >= maxRequests) return true;
  recentTimestamps.push(now);
  store.set(key, recentTimestamps);
  return false;
}

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
         req.headers.get("cf-connecting-ip") || 
         "unknown";
}

const sanitizeHtml = (text: string) =>
  text.replace(/[<>"'&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' }[c] || c));

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const VALID_EVENTS = ['birthday', 'corporate', 'school', 'team_building', 'festival', 'other'];
const VALID_PEOPLE = ['10-20', '20-30', '30-50', '50-100', '100+'];

const getEventLabel = (type: string) => {
  const labels: Record<string, string> = {
    birthday: '🎂 Cumpleaños',
    corporate: '💼 Evento corporativo',
    school: '🏫 Centro educativo',
    team_building: '🤝 Team Building',
    festival: '🎪 Festival / Feria',
    other: '✨ Otro',
  };
  return labels[type] || type;
};

const emailStyles = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px; margin: 0; }
  .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; }
  .logo-bar { background: #0d0d1a; padding: 20px; text-align: center; }
  .logo-bar img { height: 40px; }
  .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%); padding: 28px 30px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; color: #fff; }
  .content { padding: 30px; }
  .info-item { background: rgba(255,255,255,0.05); padding: 14px 16px; border-radius: 8px; border-left: 3px solid #22c55e; margin-bottom: 10px; }
  .info-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .info-value { font-size: 15px; font-weight: 600; color: #fff; }
  .summary { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 20px 0; }
  .summary-row { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { color: #888; font-size: 13px; }
  .summary-value { color: #22c55e; font-weight: 600; font-size: 15px; }
  .info-box { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); border-radius: 12px; padding: 20px; margin: 20px 0; }
  .info-box h3 { margin: 0 0 10px; color: #22c55e; font-size: 16px; }
  .info-box p { margin: 6px 0; color: #ccc; font-size: 14px; }
  .contact-box { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 20px; margin-top: 24px; text-align: center; }
  .contact-box p { margin: 6px 0; color: #aaa; font-size: 13px; }
  .contact-box a { color: #22c55e; text-decoration: none; }
  .footer { background: #0d0d1a; padding: 16px; text-align: center; font-size: 11px; color: #555; }
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resend) {
      console.error("Missing RESEND_API_KEY secret");
      return new Response(JSON.stringify({ error: "Servicio de email no configurado" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const clientIp = getClientIp(req);
    if (isRateLimited(ipRequests, clientIp, IP_WINDOW_MS, IP_MAX_REQUESTS)) {
      return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await req.json();
    const { customerName, customerEmail, customerPhone, company, location, numberOfPeople, eventType, details } = data;

    if (!customerName || typeof customerName !== 'string' || customerName.length < 2 || customerName.length > 100) return new Response(JSON.stringify({ error: 'Invalid name' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!customerEmail || !isValidEmail(customerEmail)) return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.length < 9) return new Response(JSON.stringify({ error: 'Invalid phone' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!location || typeof location !== 'string' || location.length < 2) return new Response(JSON.stringify({ error: 'Invalid location' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!VALID_PEOPLE.includes(numberOfPeople)) return new Response(JSON.stringify({ error: 'Invalid number of people' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!VALID_EVENTS.includes(eventType)) return new Response(JSON.stringify({ error: 'Invalid event type' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    if (isRateLimited(emailRequests, customerEmail.toLowerCase(), EMAIL_WINDOW_MS, EMAIL_MAX_REQUESTS)) {
      return new Response(JSON.stringify({ error: "Ya has enviado una solicitud recientemente. Inténtalo más tarde." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const safeName = sanitizeHtml(customerName);
    const safePhone = sanitizeHtml(customerPhone);
    const safeCompany = company ? sanitizeHtml(company) : '';
    const safeLocation = sanitizeHtml(location);
    const safeDetails = details ? sanitizeHtml(details) : '';

    // --- Admin Email ---
    const adminEmailResult = await resend.emails.send({
      from: "shootandrun Outdoor <outdoor@web.shootandrun.es>",
      to: [ADMIN_EMAIL],
      cc: [CC_EMAIL],
      subject: `🌿 Solicitud Presupuesto Outdoor - ${safeName}`,
      html: `<!DOCTYPE html><html><head><style>${emailStyles}</style></head><body>
        <div class="container">
          <div class="logo-bar"><img src="${LOGO_URL}" alt="shootandrun" /></div>
          <div class="header"><h1>🌿 Presupuesto Outdoor</h1></div>
          <div class="content">
            <div class="info-item"><div class="info-label">Cliente</div><div class="info-value">${safeName}</div></div>
            <div class="info-item"><div class="info-label">Email</div><div class="info-value"><a href="mailto:${customerEmail}" style="color:#22c55e">${customerEmail}</a></div></div>
            <div class="info-item"><div class="info-label">Teléfono</div><div class="info-value"><a href="tel:${safePhone}" style="color:#22c55e">${safePhone}</a></div></div>
            ${safeCompany ? `<div class="info-item"><div class="info-label">Empresa</div><div class="info-value">${safeCompany}</div></div>` : ''}
            <div class="info-item"><div class="info-label">Ubicación</div><div class="info-value">${safeLocation}</div></div>
            <div class="info-item"><div class="info-label">Personas</div><div class="info-value">${numberOfPeople}</div></div>
            <div class="info-item"><div class="info-label">Tipo de evento</div><div class="info-value">${getEventLabel(eventType)}</div></div>
            ${safeDetails ? `<div class="info-item"><div class="info-label">Detalles</div><div class="info-value">${safeDetails}</div></div>` : ''}
          </div>
          <div class="footer">shootandrun · C/ Independencia 31, Alcantarilla (Murcia)</div>
        </div>
      </body></html>`,
    });

    if (adminEmailResult.error) {
      console.error("Resend admin email error:", adminEmailResult.error);
      return new Response(JSON.stringify({ error: "No se pudo enviar el correo interno de outdoor" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // --- Customer Email ---
    const customerEmailResult = await resend.emails.send({
      from: "shootandrun <outdoor@web.shootandrun.es>",
      to: [customerEmail],
      subject: `✅ Solicitud de presupuesto recibida - shootandrun Outdoor`,
      html: `<!DOCTYPE html><html><head><style>${emailStyles}</style></head><body>
        <div class="container">
          <div class="logo-bar"><img src="${LOGO_URL}" alt="shootandrun" /></div>
          <div class="header"><h1>🌿 ¡Solicitud Recibida!</h1></div>
          <div class="content">
            <p style="font-size:18px;margin-top:0">¡Hola ${safeName}! 👋</p>
            <p style="color:#ccc">Hemos recibido tu solicitud de presupuesto para un evento outdoor. Aquí tienes el resumen de lo que nos has contado:</p>

            <div class="summary">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                <tr class="summary-row"><td class="summary-label" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08)">📍 Ubicación</td><td class="summary-value" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);text-align:right">${safeLocation}</td></tr>
                <tr class="summary-row"><td class="summary-label" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08)">👥 Personas</td><td class="summary-value" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);text-align:right">${numberOfPeople}</td></tr>
                <tr class="summary-row"><td class="summary-label" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08)">🎉 Tipo de evento</td><td class="summary-value" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);text-align:right">${getEventLabel(eventType)}</td></tr>
                ${safeCompany ? `<tr class="summary-row"><td class="summary-label" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08)">🏢 Empresa</td><td class="summary-value" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);text-align:right">${safeCompany}</td></tr>` : ''}
                ${safeDetails ? `<tr class="summary-row"><td class="summary-label" style="padding:10px 0">💬 Detalles</td><td class="summary-value" style="padding:10px 0;text-align:right;font-size:13px">${safeDetails}</td></tr>` : ''}
              </table>
            </div>

            <div class="info-box">
              <h3>📋 ¿Qué pasa ahora?</h3>
              <p>Nuestro equipo revisará los detalles de tu evento y te enviará un <strong>presupuesto personalizado sin compromiso</strong> lo antes posible.</p>
              <p>Si necesitas algo antes, no dudes en contactarnos. ¡Estamos aquí para ayudarte!</p>
            </div>

            <div class="contact-box">
              <p style="font-size:15px;color:#fff;font-weight:600;margin-bottom:10px">📞 ¿Prefieres hablar directamente?</p>
              <p>📞 <a href="tel:+34606323053">+34 606 323 053</a></p>
              <p>✉️ <a href="mailto:hola@shootandrun.es">hola@shootandrun.es</a></p>
              <p>🌐 <a href="https://shootandrunweb.lovable.app">shootandrun.es</a></p>
            </div>
          </div>
          <div class="footer">© ${new Date().getFullYear()} shootandrun · Alcantarilla, Murcia</div>
        </div>
      </body></html>`,
    });

    if (customerEmailResult.error) {
      console.error("Resend customer email error:", customerEmailResult.error);
      return new Response(JSON.stringify({ error: "No se pudo enviar la confirmación al cliente" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.log("Outdoor emails sent successfully", { adminEmailId: adminEmailResult.data?.id, customerEmailId: customerEmailResult.data?.id });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to send notification" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
