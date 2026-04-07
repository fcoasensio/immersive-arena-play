import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Rate limiting (in-memory, per IP) ────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 reservations per minute per IP

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

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipRequests) {
    if (now > entry.resetAt) ipRequests.delete(ip);
  }
}, 300_000);

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
    // Rate limit check
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

    // Parse and validate input
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

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Insert reservation with controlled defaults
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
        estado: "pendiente_pago",
        anticipo: 50.00,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting reservation:", error);
      return new Response(
        JSON.stringify({ error: "Error al crear la reserva." }),
        { status: 500, headers }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: inserted.id }),
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
