import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const ADMIN_EMAIL = "reservas@shootandrun.es";
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

interface ReservationNotification {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  numberOfPeople: number;
  activityType: string;
  eventType: string;
  extras: string[];
  specialRequests?: string;
  videoInvitationTheme?: string;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);
const isValidTime = (time: string) => /^\d{2}:\d{2}$/.test(time);
const VALID_ACTIVITIES = ['laser_tag', 'vr', 'both'];
const VALID_EVENTS = ['casual', 'birthday', 'corporate', 'team_building', 'other'];
const VALID_EXTRAS = ['snacks', 'photos', 'private_session', 'diploma', 'video_invitation'];

const sanitizeHtml = (text: string) =>
  text.replace(/[<>"'&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' }[c] || c));

function validateInput(data: any): { valid: boolean; error?: string; sanitized?: ReservationNotification } {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Invalid request body' };

  const { customerName, customerEmail, customerPhone, reservationDate, reservationTime, numberOfPeople, activityType, eventType, extras, specialRequests, videoInvitationTheme } = data;

  if (!customerName || typeof customerName !== 'string' || customerName.length < 2 || customerName.length > 100) return { valid: false, error: 'Invalid customer name' };
  if (!customerEmail || !isValidEmail(customerEmail)) return { valid: false, error: 'Invalid customer email' };
  if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.length < 9 || customerPhone.length > 20) return { valid: false, error: 'Invalid phone' };
  if (!reservationDate || !isValidDate(reservationDate)) return { valid: false, error: 'Invalid date' };
  if (!reservationTime || !isValidTime(reservationTime)) return { valid: false, error: 'Invalid time' };
  if (typeof numberOfPeople !== 'number' || numberOfPeople < 1 || numberOfPeople > 100) return { valid: false, error: 'Invalid number of people' };
  if (!VALID_ACTIVITIES.includes(activityType)) return { valid: false, error: 'Invalid activity type' };
  if (!VALID_EVENTS.includes(eventType)) return { valid: false, error: 'Invalid event type' };
  if (!Array.isArray(extras) || extras.some((e: string) => !VALID_EXTRAS.includes(e))) return { valid: false, error: 'Invalid extras' };
  if (specialRequests && (typeof specialRequests !== 'string' || specialRequests.length > 1000)) return { valid: false, error: 'Invalid special requests' };
  if (videoInvitationTheme && (typeof videoInvitationTheme !== 'string' || videoInvitationTheme.length > 200)) return { valid: false, error: 'Invalid video invitation theme' };

  return {
    valid: true,
    sanitized: {
      customerEmail,
      customerName: sanitizeHtml(customerName),
      customerPhone: sanitizeHtml(customerPhone),
      reservationDate, reservationTime, numberOfPeople,
      activityType, eventType, extras,
      specialRequests: specialRequests ? sanitizeHtml(specialRequests) : undefined,
      videoInvitationTheme: videoInvitationTheme ? sanitizeHtml(videoInvitationTheme) : undefined,
    },
  };
}

const getActivityLabel = (type: string) => {
  switch (type) {
    case 'laser_tag': return 'Laser Tag';
    case 'vr': return 'Realidad Virtual';
    case 'both': return 'Laser Tag + Realidad Virtual';
    default: return type;
  }
};

const getEventLabel = (type: string) => {
  switch (type) {
    case 'casual': return 'Visita casual';
    case 'birthday': return 'Cumpleaños';
    case 'corporate': return 'Centro educativo';
    case 'team_building': return 'Team Building';
    case 'other': return 'Otro';
    default: return type;
  }
};

const getExtrasLabels = (extras: string[]) => {
  const labels: Record<string, string> = {
    'snacks': 'Snacks y bebidas',
    'photos': 'Sesión de fotos',
    'private_session': 'Sesión privada',
    'diploma': 'Diploma para ganador',
    'video_invitation': 'Videoinvitación',
  };
  return extras.map(e => labels[e] || e).join(', ') || 'Ninguno';
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limit by IP
    const clientIp = getClientIp(req);
    if (isRateLimited(ipRequests, clientIp, IP_WINDOW_MS, IP_MAX_REQUESTS)) {
      return new Response(
        JSON.stringify({ error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const rawData = await req.json();

    const validation = validateInput(rawData);
    if (!validation.valid || !validation.sanitized) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = validation.sanitized;

    // Rate limit by email
    if (isRateLimited(emailRequests, data.customerEmail.toLowerCase(), EMAIL_WINDOW_MS, EMAIL_MAX_REQUESTS)) {
      return new Response(
        JSON.stringify({ error: "Ya has enviado una solicitud recientemente. Inténtalo más tarde." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const formattedDate = new Date(data.reservationDate).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send notification to admin
    await resend.emails.send({
      from: "Shoot&Run Reservas <reservas@shootandrun.es>",
      to: [ADMIN_EMAIL],
      cc: [CC_EMAIL],
      subject: `🎯 Nueva Reserva - ${data.customerName} - ${formattedDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #00d4ff 0%, #8b5cf6 50%, #ff3366 100%); padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; }
            .content { padding: 30px; }
            .info-item { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border-left: 3px solid #00d4ff; margin-bottom: 12px; }
            .info-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
            .info-value { font-size: 16px; font-weight: 600; color: #fff; }
            .highlight { color: #00d4ff; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Nueva Reserva</h1>
            </div>
            <div class="content">
              <div class="info-item">
                <div class="info-label">Cliente</div>
                <div class="info-value">${data.customerName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value"><a href="mailto:${data.customerEmail}" style="color: #00d4ff;">${data.customerEmail}</a></div>
              </div>
              <div class="info-item">
                <div class="info-label">Teléfono</div>
                <div class="info-value"><a href="tel:${data.customerPhone}" style="color: #00d4ff;">${data.customerPhone}</a></div>
              </div>
              <div class="info-item">
                <div class="info-label">Fecha</div>
                <div class="info-value highlight">${formattedDate}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Hora</div>
                <div class="info-value highlight">${data.reservationTime}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Personas</div>
                <div class="info-value">${data.numberOfPeople}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Actividad</div>
                <div class="info-value">${getActivityLabel(data.activityType)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Tipo de Evento</div>
                <div class="info-value">${getEventLabel(data.eventType)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Extras</div>
                <div class="info-value">${getExtrasLabels(data.extras)}</div>
              </div>
              ${data.videoInvitationTheme ? `
              <div class="info-item">
                <div class="info-label">Temática Videoinvitación</div>
                <div class="info-value">${data.videoInvitationTheme}</div>
              </div>
              ` : ''}
              ${data.specialRequests ? `
              <div class="info-item">
                <div class="info-label">Peticiones Especiales</div>
                <div class="info-value">${data.specialRequests}</div>
              </div>
              ` : ''}
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation to customer
    await resend.emails.send({
      from: "Shoot&Run <reservas@shootandrun.es>",
      to: [data.customerEmail],
      subject: `✅ Confirmación de Reserva - Shoot&Run`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #00d4ff 0%, #8b5cf6 50%, #ff3366 100%); padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .summary { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 20px 0; }
            .summary-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .summary-item:last-child { border-bottom: none; }
            .summary-label { color: #888; }
            .summary-value { color: #00d4ff; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎮 ¡Reserva Confirmada!</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px;">¡Hola ${data.customerName}!</p>
              <p>Hemos recibido tu reserva. Aquí están los detalles:</p>
              
              <div class="summary">
                <div class="summary-item">
                  <span class="summary-label">Fecha</span>
                  <span class="summary-value">${formattedDate}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Hora</span>
                  <span class="summary-value">${data.reservationTime}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Personas</span>
                  <span class="summary-value">${data.numberOfPeople}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Actividad</span>
                  <span class="summary-value">${getActivityLabel(data.activityType)}</span>
                </div>
              </div>
              
              <p>Nos pondremos en contacto contigo pronto para confirmar todos los detalles.</p>
              <p>¡Prepárate para la acción! 🎯</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Emails sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-reservation-notification function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process notification. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
