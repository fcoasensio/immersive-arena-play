import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ADMIN_EMAIL = "outdoor@shootandrun.es";
const CC_EMAIL = "info@shootandrun.es";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- Rate Limiting ---
const IP_WINDOW_MS = 60 * 1000; // 1 minute
const IP_MAX_REQUESTS = 5;
const EMAIL_WINDOW_MS = 60 * 60 * 1000; // 1 hour
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
    birthday: 'Cumpleaños',
    corporate: 'Evento corporativo',
    school: 'Centro educativo',
    team_building: 'Team Building',
    festival: 'Festival / Feria',
    other: 'Otro',
  };
  return labels[type] || type;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resend) {
      console.error("Missing RESEND_API_KEY secret");
      return new Response(
        JSON.stringify({ error: "Servicio de email no configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit by IP
    const clientIp = getClientIp(req);
    if (isRateLimited(ipRequests, clientIp, IP_WINDOW_MS, IP_MAX_REQUESTS)) {
      return new Response(
        JSON.stringify({ error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await req.json();

    const { customerName, customerEmail, customerPhone, company, location, numberOfPeople, eventType, details } = data;

    // Validate
    if (!customerName || typeof customerName !== 'string' || customerName.length < 2 || customerName.length > 100) return new Response(JSON.stringify({ error: 'Invalid name' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!customerEmail || !isValidEmail(customerEmail)) return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.length < 9) return new Response(JSON.stringify({ error: 'Invalid phone' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!location || typeof location !== 'string' || location.length < 2) return new Response(JSON.stringify({ error: 'Invalid location' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!VALID_PEOPLE.includes(numberOfPeople)) return new Response(JSON.stringify({ error: 'Invalid number of people' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!VALID_EVENTS.includes(eventType)) return new Response(JSON.stringify({ error: 'Invalid event type' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Rate limit by email
    if (isRateLimited(emailRequests, customerEmail.toLowerCase(), EMAIL_WINDOW_MS, EMAIL_MAX_REQUESTS)) {
      return new Response(
        JSON.stringify({ error: "Ya has enviado una solicitud recientemente. Inténtalo más tarde." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const safeName = sanitizeHtml(customerName);
    const safePhone = sanitizeHtml(customerPhone);
    const safeCompany = company ? sanitizeHtml(company) : '';
    const safeLocation = sanitizeHtml(location);
    const safeDetails = details ? sanitizeHtml(details) : '';

    // Send to admin
    const adminEmailResult = await resend.emails.send({
      from: "Shoot&Run Outdoor <outdoor@web.shootandrun.es>",
      to: [ADMIN_EMAIL],
      cc: [CC_EMAIL],
      subject: `🌿 Solicitud Presupuesto Outdoor - ${safeName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%); padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
            .content { padding: 30px; }
            .info-item { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border-left: 3px solid #22c55e; margin-bottom: 12px; }
            .info-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
            .info-value { font-size: 16px; font-weight: 600; color: #fff; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌿 Presupuesto Outdoor</h1>
            </div>
            <div class="content">
              <div class="info-item">
                <div class="info-label">Cliente</div>
                <div class="info-value">${safeName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value"><a href="mailto:${customerEmail}" style="color: #22c55e;">${customerEmail}</a></div>
              </div>
              <div class="info-item">
                <div class="info-label">Teléfono</div>
                <div class="info-value"><a href="tel:${safePhone}" style="color: #22c55e;">${safePhone}</a></div>
              </div>
              ${safeCompany ? `<div class="info-item"><div class="info-label">Empresa</div><div class="info-value">${safeCompany}</div></div>` : ''}
              <div class="info-item">
                <div class="info-label">Ubicación</div>
                <div class="info-value">${safeLocation}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Personas</div>
                <div class="info-value">${numberOfPeople}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Tipo de evento</div>
                <div class="info-value">${getEventLabel(eventType)}</div>
              </div>
              ${safeDetails ? `<div class="info-item"><div class="info-label">Detalles</div><div class="info-value">${safeDetails}</div></div>` : ''}
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (adminEmailResult.error) {
      console.error("Resend admin email error:", adminEmailResult.error);
      return new Response(
        JSON.stringify({ error: "No se pudo enviar el correo interno de outdoor" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send confirmation to customer
    const customerEmailResult = await resend.emails.send({
      from: "Shoot&Run <outdoor@shootandrun.es>",
      to: [customerEmail],
      subject: `✅ Solicitud de presupuesto recibida - Shoot&Run Outdoor`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌿 ¡Solicitud Recibida!</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px;">¡Hola ${safeName}!</p>
              <p>Hemos recibido tu solicitud de presupuesto para un evento outdoor.</p>
              <p>Nuestro equipo revisará los detalles y te enviará un presupuesto personalizado lo antes posible.</p>
              <p>¡Gracias por confiar en Shoot&Run! 🎯</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (customerEmailResult.error) {
      console.error("Resend customer email error:", customerEmailResult.error);
      return new Response(
        JSON.stringify({ error: "No se pudo enviar la confirmación al cliente" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Outdoor emails sent successfully", {
      adminEmailId: adminEmailResult.data?.id,
      customerEmailId: customerEmailResult.data?.id,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send notification" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
