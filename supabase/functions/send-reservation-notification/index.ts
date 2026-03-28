import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ADMIN_EMAIL = "reservas@shootandrun.es";
const CC_EMAIL = "info@shootandrun.es";
const LOGO_URL = "https://pbfvhwgnpewmljkvckfw.supabase.co/storage/v1/object/public/email-assets/logo-shootandrun.png";
const MAPS_URL = "https://maps.google.com/?q=C/+Independencia+31,+30820+Alcantarilla,+Murcia";

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

interface ReservationNotification {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDni: string;
  customerAddress: string;
  customerPostalCode: string;
  reservationDate: string;
  reservationTime: string;
  numberOfPeople: number;
  activityType: string;
  reservationType: string;
  duration: string;
  priceBase?: number;
  priceFinal?: number;
  childName?: string;
  childAge?: number;
  specialRequests?: string;
  videoInvitationTheme?: string;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);
const isValidTime = (time: string) => /^\d{2}:\d{2}$/.test(time);
const VALID_ACTIVITIES = ['laser_tag', 'realidad_virtual', 'combinada'];
const VALID_RESERVATION_TYPES = ['cumpleanos', 'grupos', 'despedida'];
const VALID_DURATIONS = ['90', '150', '270'];

const sanitizeHtml = (text: string) =>
  text.replace(/[<>"'&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' }[c] || c));

function validateInput(data: any): { valid: boolean; error?: string; sanitized?: ReservationNotification } {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Invalid request body' };
  const { customerName, customerEmail, customerPhone, customerDni, customerAddress, customerPostalCode, reservationDate, reservationTime, numberOfPeople, activityType, reservationType, duration, priceBase, priceFinal, childName, childAge, specialRequests, videoInvitationTheme } = data;
  if (!customerName || typeof customerName !== 'string' || customerName.length < 2 || customerName.length > 100) return { valid: false, error: 'Invalid customer name' };
  if (!customerEmail || !isValidEmail(customerEmail)) return { valid: false, error: 'Invalid customer email' };
  if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.length < 9 || customerPhone.length > 20) return { valid: false, error: 'Invalid phone' };
  if (!customerDni || typeof customerDni !== 'string' || customerDni.length < 5 || customerDni.length > 20) return { valid: false, error: 'Invalid DNI/CIF' };
  if (!customerAddress || typeof customerAddress !== 'string' || customerAddress.length < 3 || customerAddress.length > 200) return { valid: false, error: 'Invalid address' };
  if (!customerPostalCode || typeof customerPostalCode !== 'string' || customerPostalCode.length < 4 || customerPostalCode.length > 10) return { valid: false, error: 'Invalid postal code' };
  if (!reservationDate || !isValidDate(reservationDate)) return { valid: false, error: 'Invalid date' };
  if (!reservationTime || !isValidTime(reservationTime)) return { valid: false, error: 'Invalid time' };
  if (typeof numberOfPeople !== 'number' || numberOfPeople < 1 || numberOfPeople > 100) return { valid: false, error: 'Invalid number of people' };
  if (!VALID_ACTIVITIES.includes(activityType)) return { valid: false, error: 'Invalid activity type' };
  if (!VALID_RESERVATION_TYPES.includes(reservationType)) return { valid: false, error: 'Invalid reservation type' };
  if (!VALID_DURATIONS.includes(duration)) return { valid: false, error: 'Invalid duration' };
  if (priceBase !== undefined && (typeof priceBase !== 'number' || priceBase < 0)) return { valid: false, error: 'Invalid base price' };
  if (priceFinal !== undefined && (typeof priceFinal !== 'number' || priceFinal < 0)) return { valid: false, error: 'Invalid final price' };
  if (childName && (typeof childName !== 'string' || childName.length > 100)) return { valid: false, error: 'Invalid child name' };
  if (childAge !== undefined && childAge !== null && (typeof childAge !== 'number' || childAge < 1 || childAge > 18)) return { valid: false, error: 'Invalid child age' };
  if (specialRequests && (typeof specialRequests !== 'string' || specialRequests.length > 1000)) return { valid: false, error: 'Invalid special requests' };
  if (videoInvitationTheme && (typeof videoInvitationTheme !== 'string' || videoInvitationTheme.length > 200)) return { valid: false, error: 'Invalid video invitation theme' };
  return {
    valid: true,
    sanitized: {
      customerEmail, customerName: sanitizeHtml(customerName), customerPhone: sanitizeHtml(customerPhone),
      customerDni: sanitizeHtml(customerDni), customerAddress: sanitizeHtml(customerAddress), customerPostalCode: sanitizeHtml(customerPostalCode),
      reservationDate, reservationTime, numberOfPeople, activityType, reservationType, duration,
      priceBase, priceFinal,
      childName: childName ? sanitizeHtml(childName) : undefined,
      childAge: childAge || undefined,
      specialRequests: specialRequests ? sanitizeHtml(specialRequests) : undefined,
      videoInvitationTheme: videoInvitationTheme ? sanitizeHtml(videoInvitationTheme) : undefined,
    },
  };
}

const getActivityLabel = (type: string) => {
  switch (type) {
    case 'laser_tag': return 'Láser Tag';
    case 'realidad_virtual': return 'Realidad Virtual';
    case 'combinada': return 'Láser Tag + Realidad Virtual';
    default: return type;
  }
};

const getReservationTypeLabel = (type: string) => {
  switch (type) {
    case 'cumpleanos': return '🎂 Cumpleaños';
    case 'grupos': return '👥 Grupos';
    case 'despedida': return '🎉 Despedida';
    default: return type;
  }
};

const getDurationLabel = (dur: string) => {
  switch (dur) {
    case '90': return '1h 30min';
    case '150': return '2h 30min';
    case '270': return '4h 30min';
    default: return dur + ' min';
  }
};

const emailStyles = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px; margin: 0; }
  .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; }
  .logo-bar { background: #0d0d1a; padding: 20px; text-align: center; }
  .logo-bar img { height: 40px; }
  .header { background: linear-gradient(135deg, #00d4ff 0%, #8b5cf6 50%, #ff3366 100%); padding: 28px 30px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; color: #fff; }
  .content { padding: 30px; }
  .section-title { font-size: 14px; color: #00d4ff; text-transform: uppercase; letter-spacing: 1.5px; margin: 20px 0 10px; font-weight: 600; }
  .info-item { background: rgba(255,255,255,0.05); padding: 14px 16px; border-radius: 8px; border-left: 3px solid #00d4ff; margin-bottom: 10px; }
  .info-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .info-value { font-size: 15px; font-weight: 600; color: #fff; }
  .highlight { color: #00d4ff; }
  .summary { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 20px 0; }
  .summary-row { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { color: #888; font-size: 13px; }
  .summary-value { color: #00d4ff; font-weight: 600; font-size: 15px; }
  .next-steps { background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.2); border-radius: 12px; padding: 20px; margin: 20px 0; }
  .next-steps h3 { margin: 0 0 12px; color: #00d4ff; font-size: 16px; }
  .next-steps ol { margin: 0; padding-left: 20px; }
  .next-steps li { margin-bottom: 8px; color: #ccc; font-size: 14px; }
  .price-box { background: rgba(0,212,255,0.12); border: 1px solid rgba(0,212,255,0.3); border-radius: 12px; padding: 16px; margin: 16px 0; text-align: center; }
  .price-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .price-value { font-size: 28px; font-weight: 700; color: #00d4ff; margin: 4px 0; }
  .price-note { font-size: 12px; color: #aaa; }
  .contact-box { background: rgba(255,255,255,0.04); border-radius: 12px; padding: 20px; margin-top: 24px; text-align: center; }
  .contact-box p { margin: 6px 0; color: #aaa; font-size: 13px; }
  .contact-box a { color: #00d4ff; text-decoration: none; }
  .footer { background: #0d0d1a; padding: 16px; text-align: center; font-size: 11px; color: #555; }
`;

function buildAdminInfoItem(label: string, value: string, isHighlight = false): string {
  return `<div class="info-item"><div class="info-label">${label}</div><div class="info-value${isHighlight ? ' highlight' : ''}">${value}</div></div>`;
}

function buildSummaryRow(emoji: string, label: string, value: string): string {
  return `<tr class="summary-row"><td class="summary-label" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08)">${emoji} ${label}</td><td class="summary-value" style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);text-align:right">${value}</td></tr>`;
}

function buildAdminEmail(data: ReservationNotification, formattedDate: string): string {
  let childSection = '';
  if (data.childName) {
    childSection = `
      <div class="section-title">👦 Datos del menor</div>
      ${buildAdminInfoItem('Nombre del menor', data.childName)}
      ${data.childAge ? buildAdminInfoItem('Edad', data.childAge + ' años') : ''}
    `;
  }

  let priceSection = '';
  if (data.priceFinal !== undefined) {
    priceSection = `
      <div class="section-title">💰 Precio</div>
      ${data.priceBase !== undefined ? buildAdminInfoItem('Precio base', data.priceBase.toFixed(2) + ' €') : ''}
      ${buildAdminInfoItem('Precio final', data.priceFinal.toFixed(2) + ' €', true)}
    `;
  }

  return `<!DOCTYPE html><html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="logo-bar"><img src="${LOGO_URL}" alt="shootandrun" /></div>
      <div class="header"><h1>🎯 Nueva Reserva</h1></div>
      <div class="content">
        <div class="section-title">📋 Datos de la reserva</div>
        ${buildAdminInfoItem('Tipo de reserva', getReservationTypeLabel(data.reservationType))}
        ${buildAdminInfoItem('Actividad', getActivityLabel(data.activityType))}
        ${buildAdminInfoItem('Fecha', formattedDate, true)}
        ${buildAdminInfoItem('Hora', data.reservationTime, true)}
        ${buildAdminInfoItem('Duración', getDurationLabel(data.duration))}
        ${buildAdminInfoItem('Personas', String(data.numberOfPeople))}

        ${childSection}

        <div class="section-title">👤 Datos del cliente</div>
        ${buildAdminInfoItem('Nombre', data.customerName)}
        ${buildAdminInfoItem('Email', `<a href="mailto:${data.customerEmail}" style="color:#00d4ff">${data.customerEmail}</a>`)}
        ${buildAdminInfoItem('Teléfono', `<a href="tel:${data.customerPhone}" style="color:#00d4ff">${data.customerPhone}</a>`)}
        ${buildAdminInfoItem('DNI/CIF', data.customerDni)}
        ${buildAdminInfoItem('Dirección', data.customerAddress)}
        ${buildAdminInfoItem('Código Postal', data.customerPostalCode)}

        ${priceSection}

        ${data.videoInvitationTheme ? `<div class="section-title">🎬 Videoinvitación</div>${buildAdminInfoItem('Temática', data.videoInvitationTheme)}` : ''}
        ${data.specialRequests ? `<div class="section-title">💬 Notas</div>${buildAdminInfoItem('Peticiones especiales', data.specialRequests)}` : ''}
      </div>
      <div class="footer">shootandrun · C/ Independencia 31, Alcantarilla (Murcia)</div>
    </div>
  </body></html>`;
}

function buildCustomerEmail(data: ReservationNotification, formattedDate: string): string {
  let childRows = '';
  if (data.childName) {
    childRows += buildSummaryRow('👦', 'Cumpleañero/a', data.childName);
    if (data.childAge) childRows += buildSummaryRow('🎂', 'Edad', data.childAge + ' años');
  }

  let priceBlock = '';
  if (data.priceFinal !== undefined) {
    const priceNote = data.priceBase !== undefined && data.priceBase !== data.priceFinal
      ? `<div class="price-note">Incluye recargo fin de semana/festivo</div>` : '';
    priceBlock = `
      <div class="price-box">
        <div class="price-label">Precio total</div>
        <div class="price-value">${data.priceFinal.toFixed(2)} €</div>
        ${priceNote}
      </div>
    `;
  }

  return `<!DOCTYPE html><html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="logo-bar"><img src="${LOGO_URL}" alt="shootandrun" /></div>
      <div class="header"><h1>🎮 ¡Reserva Recibida!</h1></div>
      <div class="content">
        <p style="font-size:18px;margin-top:0">¡Hola ${data.customerName}! 👋</p>
        <p style="color:#ccc">Hemos recibido tu solicitud de reserva. Aquí tienes el resumen:</p>

        <div class="summary">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            ${buildSummaryRow('🎉', 'Tipo', getReservationTypeLabel(data.reservationType))}
            ${buildSummaryRow('🎮', 'Actividad', getActivityLabel(data.activityType))}
            ${buildSummaryRow('📅', 'Fecha', formattedDate)}
            ${buildSummaryRow('🕐', 'Hora', data.reservationTime)}
            ${buildSummaryRow('⏱️', 'Duración', getDurationLabel(data.duration))}
            ${buildSummaryRow('👥', 'Personas', String(data.numberOfPeople))}
            ${childRows}
            ${data.videoInvitationTheme ? buildSummaryRow('🎬', 'Temática', data.videoInvitationTheme) : ''}
            ${data.specialRequests ? buildSummaryRow('💬', 'Notas', data.specialRequests) : ''}
          </table>
        </div>

        ${priceBlock}

        <div class="next-steps">
          <h3>📋 Próximos pasos</h3>
          <ol>
            <li>Para confirmar la reserva deberá hacer un <strong>bizum al 606323053 de 50€</strong>.</li>
            <li>Nuestro equipo revisará su reserva y si hubiese alguna duda contactará para solucionarla.</li>
            <li>Una vez confirmada recibirá un email de confirmación. Para cualquier consulta no dude en contactarnos.</li>
          </ol>
        </div>

        <div class="contact-box">
          <p style="font-size:15px;color:#fff;font-weight:600;margin-bottom:10px">📍 ¿Dónde estamos?</p>
          <p><a href="${MAPS_URL}" style="color:#00d4ff">Avda. Fernando III El Santo, 24. 30820-Alcantarilla (Murcia)</a></p>
          <p style="margin-top:14px">📞 <a href="tel:+34606323053">+34 606 323 053</a></p>
          <p>✉️ <a href="mailto:reservas@shootandrun.es">reservas@shootandrun.es</a></p>
          <p>🌐 <a href="https://shootandrunweb.lovable.app">shootandrun.es</a></p>
        </div>
      </div>
      <div class="footer">© ${new Date().getFullYear()} shootandrun · Alcantarilla, Murcia</div>
    </div>
  </body></html>`;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resend) {
      console.error("Missing RESEND_API_KEY secret");
      return new Response(JSON.stringify({ error: "Servicio de email no configurado" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const clientIp = getClientIp(req);
    if (isRateLimited(ipRequests, clientIp, IP_WINDOW_MS, IP_MAX_REQUESTS)) {
      return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." }), { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const rawData = await req.json();
    const validation = validateInput(rawData);
    if (!validation.valid || !validation.sanitized) {
      return new Response(JSON.stringify({ error: validation.error }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const data = validation.sanitized;

    if (isRateLimited(emailRequests, data.customerEmail.toLowerCase(), EMAIL_WINDOW_MS, EMAIL_MAX_REQUESTS)) {
      return new Response(JSON.stringify({ error: "Ya has enviado una solicitud recientemente. Inténtalo más tarde." }), { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const formattedDate = new Date(data.reservationDate).toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // --- Admin Email ---
    const adminEmailResult = await resend.emails.send({
      from: "shootandrun Reservas <reservas@web.shootandrun.es>",
      to: [ADMIN_EMAIL],
      cc: [CC_EMAIL],
      subject: `🎯 Nueva Reserva - ${data.customerName} - ${formattedDate} - ${getReservationTypeLabel(data.reservationType)}`,
      html: buildAdminEmail(data, formattedDate),
    });

    if (adminEmailResult.error) {
      console.error("Resend admin email error:", adminEmailResult.error);
      return new Response(JSON.stringify({ error: "No se pudo enviar el correo interno de reserva" }), { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // --- Customer Email ---
    const customerEmailResult = await resend.emails.send({
      from: "shootandrun <reservas@web.shootandrun.es>",
      to: [data.customerEmail],
      subject: `✅ Tu reserva en shootandrun - ${formattedDate}`,
      html: buildCustomerEmail(data, formattedDate),
    });

    if (customerEmailResult.error) {
      console.error("Resend customer email error:", customerEmailResult.error);
      return new Response(JSON.stringify({ error: "No se pudo enviar la confirmación al cliente" }), { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    console.log("Emails sent successfully", { adminEmailId: adminEmailResult.data?.id, customerEmailId: customerEmailResult.data?.id });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error: any) {
    console.error("Error in send-reservation-notification function:", error);
    return new Response(JSON.stringify({ error: "Failed to process notification. Please try again." }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
