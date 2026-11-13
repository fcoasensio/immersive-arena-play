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

const PEOPLE_LABELS: Record<string, string> = {
  "1_7": "1-7",
  "8_15": "8-15",
  "16_25": "16-25",
  "25_mas": "+25",
};

const esc = (t: string) =>
  String(t).replace(/[<>"'&]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "&": "&amp;" }[c] || c)
  );

export function buildLeadDraft(args: {
  nombre: string;
  tipo_evento: string;
  num_personas: string;
  fecha_orientativa: string;
  actividad_interes: string;
  categoria: "A" | "B" | "C";
}): { subject: string; html: string } {
  const { nombre, tipo_evento, num_personas, fecha_orientativa, actividad_interes, categoria } = args;
  const personas = num_personas ? PEOPLE_LABELS[num_personas] || num_personas : "";
  const actividadLabel = actividad_interes && actividad_interes !== "no_se"
    ? ACTIVITY_LABELS[actividad_interes]
    : "Laser Tag o Realidad Virtual";
  const fechaTxt = fecha_orientativa ? `el ${esc(fecha_orientativa)}` : "en la fecha que elijáis";
  const personasTxt = personas ? `${esc(personas)} personas` : "tu grupo";
  const eventoTxt = EVENT_LABELS[tipo_evento]?.replace(/^[^\s]+\s/, "").toLowerCase() || "evento";
  const datosRecibidos = [
    personas ? `<strong>${esc(personas)} jugadores aproximadamente</strong>` : "",
    fecha_orientativa ? `<strong>${esc(fechaTxt)}</strong>` : "",
  ].filter(Boolean).join(" para ");
  const resumenRecibido = datosRecibidos
    ? `<p>Según los datos que nos has facilitado, estáis pensando en ${datosRecibidos}.</p>`
    : "";
  const infoComun = `
    <ul style="padding-left:18px;line-height:1.7">
      <li>🎯 <strong>Laser Tag:</strong> hasta 16 jugadores simultáneos en pista (a partir de 8 años)</li>
      <li>🥽 <strong>Realidad Virtual free-roam:</strong> hasta 12 jugadores simultáneos (a partir de 12 años)</li>
      <li>🏠 El local es cubierto y apto durante todo el año, tanto si hace sol como si llueve o hace viento</li>
    </ul>
    <p>Puedes consultar las tarifas actualizadas en nuestra <a href="https://shootandrun.es/#packs" style="color:#0891b2;font-weight:600">sección de packs y precios</a>. El importe final se calcula según los jugadores reales que asistan; el número indicado en el formulario es orientativo.</p>`;

  // EMPRESA / TEAM BUILDING
  if (tipo_evento === "empresa") {
    const subject = `Propuesta team building shootandrun para ${nombre}`;
    const html = wrap(`
      <p>Hola ${esc(nombre)},</p>
      <p>Gracias por pensar en <strong>shootandrun</strong> para vuestro evento de empresa. Os hemos preparado una propuesta enfocada en lo que de verdad funciona en team building: cooperación bajo presión, decisiones rápidas y mucho que celebrar después.</p>
      ${resumenRecibido}
      <p><strong>Para vuestro grupo de ${personasTxt} proponemos:</strong></p>
      <ul style="padding-left:18px;line-height:1.7">
        <li>⚡ Sesión de <strong>Laser Tag en pista cubierta</strong> (90 min) con modos por equipos rotativos</li>
        <li>🥽 Bloque opcional de <strong>VR free-roam multijugador</strong></li>
        <li>🍕 Zona privada con catering opcional</li>
        <li>📊 Briefing inicial + entrega del "MVP del día" al final</li>
      </ul>
      ${infoComun}
      <p>La franja se reserva con 50€ de Bizum y el resto se abona según las condiciones indicadas en nuestros precios.</p>
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
        <li>🎯 <strong>${esc(actividadLabel)}</strong> en instalaciones cubiertas con equipo profesional</li>
        <li>⚡ Briefing táctico + 3-4 modos de juego adaptados al grupo</li>
        <li>🎁 Zona privada para descanso o picoteo si lo necesitas</li>
      </ul>
      ${infoComun}
      <p><strong>Reserva con solo 50€ de Bizum</strong> al 606 32 30 53. El resto se paga el día de la actividad.</p>
      <p>Las franjas más demandadas vuelan rápido. Responde a este email o escríbenos por WhatsApp y te confirmo disponibilidad <strong>hoy mismo</strong>.</p>
      <p style="margin-top:28px">Nos vemos en la pista ⚡<br/>Equipo <strong>shootandrun</strong><br/><span style="color:#888;font-size:13px">Alcantarilla, Murcia · +34 606 32 30 53</span></p>
    `);
    return { subject, html };
  }

  // CATEGORIA B: Tono más informativo, menos urgencia
  const subject = `${nombre}, info sobre tu ${eventoTxt} en shootandrun`;
  const html = wrap(`
    <p>Hola ${esc(nombre)},</p>
    <p>Gracias por escribirnos. Te paso un resumen rápido para que puedas valorar vuestro <strong>${eventoTxt}</strong> en <strong>shootandrun</strong>:</p>
    ${resumenRecibido}
    ${infoComun}
    <p>La franja se reserva con 50€ de Bizum y el resto se paga el día de la actividad. Responde a este email y comprobaremos la disponibilidad para la fecha que nos has indicado.</p>
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

