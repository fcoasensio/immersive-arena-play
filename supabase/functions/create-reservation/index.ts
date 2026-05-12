import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Rate limiting (in-memory, per IP) ────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipRequests) {
    if (now > entry.resetAt) ipRequests.delete(ip);
  }
}, 300_000);

// ── Recent reservations per IP (for sospecha score) ──────────────────
const recentByIp = new Map<string, number[]>();
function trackIpReservation(ip: string): number {
  const now = Date.now();
  const arr = (recentByIp.get(ip) || []).filter((t) => now - t < 600_000);
  arr.push(now);
  recentByIp.set(ip, arr);
  return arr.length;
}

// ── Helpers de validación ────────────────────────────────────────────
function hasRepeatedChars(s: string, n = 4): boolean {
  return new RegExp(`(.)\\1{${n - 1},}`, "i").test(s);
}

function isLikelyValidName(name: string): boolean {
  // Mínimo 2 palabras, cada palabra >=2 letras, con vocal, solo letras/espacios/guiones/apóstrofes
  const trimmed = name.trim();
  if (!/^[\p{L}\s'\-]+$/u.test(trimmed)) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;
  return words.every((w) => w.length >= 2 && /[aeiouáéíóúü]/i.test(w));
}

// Validación oficial DNI/NIE/CIF español
function validarDocumentoEspanol(doc: string): boolean {
  const d = doc.trim().toUpperCase().replace(/[\s-]/g, "");
  // DNI: 8 dígitos + letra
  const dniRe = /^(\d{8})([A-Z])$/;
  // NIE: X|Y|Z + 7 dígitos + letra
  const nieRe = /^([XYZ])(\d{7})([A-Z])$/;
  // CIF: letra + 7 dígitos + dígito/letra
  const cifRe = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";

  if (dniRe.test(d)) {
    const [, num, letra] = d.match(dniRe)!;
    return letras[parseInt(num, 10) % 23] === letra;
  }
  if (nieRe.test(d)) {
    const [, prefix, num, letra] = d.match(nieRe)!;
    const mapping: Record<string, string> = { X: "0", Y: "1", Z: "2" };
    return letras[parseInt(mapping[prefix] + num, 10) % 23] === letra;
  }
  if (cifRe.test(d)) {
    const [, , num, ctrl] = d.match(cifRe)!;
    let sumPar = 0;
    let sumImpar = 0;
    for (let i = 0; i < 7; i++) {
      const n = parseInt(num[i], 10);
      if (i % 2 === 0) {
        const x = n * 2;
        sumImpar += Math.floor(x / 10) + (x % 10);
      } else {
        sumPar += n;
      }
    }
    const total = sumPar + sumImpar;
    const ctrlDigit = (10 - (total % 10)) % 10;
    const ctrlLetter = "JABCDEFGHI"[ctrlDigit];
    return ctrl === String(ctrlDigit) || ctrl === ctrlLetter;
  }
  return false;
}

function looksSpanishPhone(tel: string): boolean {
  const t = tel.replace(/[\s-]/g, "");
  return /^(\+34)?[6-9]\d{8}$/.test(t);
}

async function dominioTieneMX(domain: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`,
      { headers: { accept: "application/dns-json" } }
    );
    if (!res.ok) return true; // ante fallo, no penalizar
    const json = await res.json();
    if (json.Status !== 0) return false;
    const answers = json.Answer || [];
    return answers.some((a: any) => a.type === 15);
  } catch {
    return true; // ante fallo de red, no penalizar
  }
}

// ── Input validation ─────────────────────────────────────────────────
const ReservationSchema = z.object({
  tipo_reserva: z.enum(["cumpleanos", "grupos", "despedida"]),
  actividad: z.enum(["laser_tag", "realidad_virtual", "combinada"]),
  nombre_completo: z.string().trim().min(2).max(200),
  telefono: z.string().trim().min(6).max(20),
  email: z.string().trim().email().max(255),
  dni_cif: z.string().trim().min(5).max(20),
  direccion: z.string().trim().min(3).max(300),
  codigo_postal: z.string().trim().min(4).max(10),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora: z.string().regex(/^\d{2}:\d{2}$/),
  duracion: z.enum(["90", "150", "270"]).default("90"),
  num_participantes: z.number().int().min(1).max(100),
  nombre_menor: z.string().trim().max(200).nullable().optional(),
  edad_menor: z.number().int().min(1).max(17).nullable().optional(),
  tematica_invitacion: z.string().trim().max(500).nullable().optional(),
  notas: z.string().trim().max(2000).nullable().optional(),
});

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const headers = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Demasiadas solicitudes. Inténtelo de nuevo en un minuto." }),
        { status: 429, headers }
      );
    }

    const raw = await req.json();
    const parsed = ReservationSchema.safeParse(raw);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers }
      );
    }

    const data = parsed.data;

    // Validate date is in the future
    const reservationDate = new Date(data.fecha + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) {
      return new Response(
        JSON.stringify({ error: "La fecha de reserva debe ser futura." }),
        { status: 400, headers }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // ── Calculate prices from packs ──────────────────────────────────
    let precioPorPersona = 18;
    const { data: packs } = await supabase.from("packs").select("nombre, precio").eq("activo", true);
    if (packs) {
      for (const p of packs) {
        const num = parseFloat((p.precio || "").replace(/[^0-9.,]/g, "").replace(",", "."));
        if (isNaN(num)) continue;
        const n = (p.nombre || "").toLowerCase();
        if (data.tipo_reserva === "cumpleanos" && (n.includes("cumpleaños") || n.includes("cumpleanos"))) {
          precioPorPersona = num; break;
        } else if (data.tipo_reserva === "despedida" && n.includes("despedida")) {
          precioPorPersona = num; break;
        } else if (data.tipo_reserva === "grupos" && !n.includes("cumpleaños") && !n.includes("cumpleanos") && !n.includes("despedida")) {
          precioPorPersona = num;
        }
      }
    }

    let recargo = 0;
    const fecha = new Date(data.fecha + "T00:00:00");
    const dow = fecha.getDay();
    if (dow === 0 || dow === 6) {
      recargo = 2;
    } else {
      const { data: festivo } = await supabase.from("festivos").select("id").eq("fecha", data.fecha).limit(1);
      if (festivo && festivo.length > 0) recargo = 2;
    }
    const { data: recargoConfig } = await supabase.from("configuracion").select("valor").eq("clave", "recargo_finde_festivo").single();
    if (recargoConfig && recargo > 0) {
      const rv = typeof recargoConfig.valor === "number" ? recargoConfig.valor : parseFloat(String(recargoConfig.valor));
      if (!isNaN(rv)) recargo = rv;
    }

    const precioBase = precioPorPersona * data.num_participantes;
    const precioFinal = (precioPorPersona + recargo) * data.num_participantes;

    // ── Cálculo del score de sospecha ───────────────────────────────
    const motivos: string[] = [];
    let score = 0;

    // Email: comprobar MX
    const emailDomain = data.email.split("@")[1] || "";
    const tieneMX = await dominioTieneMX(emailDomain);
    if (!tieneMX) {
      score += 40;
      motivos.push(`Dominio del email sin registros MX (${emailDomain})`);
    }

    // Nombre
    if (!isLikelyValidName(data.nombre_completo)) {
      score += 30;
      motivos.push("Nombre con formato improbable (caracteres no válidos, sin vocales o una sola palabra)");
    } else if (hasRepeatedChars(data.nombre_completo, 4)) {
      score += 30;
      motivos.push("Nombre con 4+ caracteres iguales seguidos");
    }

    // DNI: solo penalizar si el teléfono parece español
    const phoneEs = looksSpanishPhone(data.telefono);
    if (phoneEs && !validarDocumentoEspanol(data.dni_cif)) {
      score += 30;
      motivos.push("DNI/NIE/CIF español inválido");
    }

    // Repeticiones en otros campos
    const camposExtra: Array<[string, string]> = [
      ["dirección", data.direccion],
      ["DNI/CIF", data.dni_cif],
      ["notas", data.notas || ""],
    ];
    for (const [label, valor] of camposExtra) {
      if (valor && hasRepeatedChars(valor, 5)) {
        score += 15;
        motivos.push(`Campo "${label}" con 5+ caracteres iguales seguidos`);
      }
    }

    // Misma IP creando muchas reservas en poco tiempo
    const ipCount = trackIpReservation(ip);
    if (ipCount > 2) {
      score += 25;
      motivos.push(`Misma IP con ${ipCount} reservas en los últimos 10 min`);
    }

    const esSospechosa = score >= 50;
    const estadoFinal = esSospechosa ? "sospechosa" : "pendiente_pago";

    const { data: inserted, error } = await supabase
      .from("reservas")
      .insert({
        tipo_reserva: data.tipo_reserva,
        actividad: data.actividad,
        nombre_completo: data.nombre_completo,
        telefono: data.telefono,
        email: data.email,
        dni_cif: data.dni_cif,
        direccion: data.direccion,
        codigo_postal: data.codigo_postal,
        fecha: data.fecha,
        hora: data.hora,
        duracion: data.duracion,
        num_participantes: data.num_participantes,
        nombre_menor: data.nombre_menor || null,
        edad_menor: data.edad_menor || null,
        tematica_invitacion: data.tematica_invitacion || null,
        notas: data.notas || null,
        estado: estadoFinal,
        anticipo: 50.0,
        precio_base: precioBase,
        precio_final: precioFinal,
        score_sospecha: score,
        motivos_sospecha: motivos,
      } as any)
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting reservation:", error);
      return new Response(
        JSON.stringify({ error: "Error al crear la reserva." }),
        { status: 500, headers }
      );
    }

    // Si es sospechosa: aviso al admin (no enviar email al cliente ni crear evento en Calendar)
    if (esSospechosa) {
      try {
        await supabase.functions.invoke("send-suspicious-reservation-alert", {
          body: {
            reservaId: inserted.id,
            score,
            motivos,
            datos: {
              nombre_completo: data.nombre_completo,
              email: data.email,
              telefono: data.telefono,
              dni_cif: data.dni_cif,
              direccion: data.direccion,
              codigo_postal: data.codigo_postal,
              fecha: data.fecha,
              hora: data.hora,
              actividad: data.actividad,
              tipo_reserva: data.tipo_reserva,
              num_participantes: data.num_participantes,
              notas: data.notas || null,
            },
          },
        });
      } catch (e) {
        console.error("Error sending suspicious alert:", e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: inserted.id,
        sospechosa: esSospechosa,
        score,
        motivos,
      }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("Unexpected error in create-reservation:", err);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500, headers }
    );
  }
});
