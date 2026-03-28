import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ReservaPendiente = {
  id: string;
  fecha: string;
  hora: string;
  duracion: string;
  nombre_completo: string;
  telefono: string;
  email: string;
  actividad: string;
  tipo_reserva: string;
  num_participantes: number;
  notas: string | null;
};

function getEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required secret: ${name}`);
  return value;
}

function normalizeTime(value: string) {
  return value.split(":").slice(0, 2).join(":");
}

async function syncReservation(projectUrl: string, anonKey: string, reserva: ReservaPendiente) {
  const response = await fetch(`${projectUrl}/functions/v1/check-calendar-availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({
      action: "create",
      reservationId: reserva.id,
      date: reserva.fecha,
      time: normalizeTime(reserva.hora),
      duration: reserva.duracion,
      customerName: reserva.nombre_completo,
      customerPhone: reserva.telefono,
      customerEmail: reserva.email,
      activityType: reserva.actividad,
      reservationType: reserva.tipo_reserva,
      numberOfPeople: reserva.num_participantes,
      notes: reserva.notas ?? undefined,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || `Calendar sync failed with status ${response.status}`);
  }

  return payload;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = getEnv("SUPABASE_URL");
    const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = getEnv("SUPABASE_ANON_KEY");
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: reservas, error } = await supabase
      .from("reservas")
      .select("id, fecha, hora, duracion, nombre_completo, telefono, email, actividad, tipo_reserva, num_participantes, notas")
      .eq("estado", "confirmada")
      .or("google_calendar_event_id.is.null,google_calendar_event_id.eq.")
      .order("fecha", { ascending: true })
      .order("hora", { ascending: true })
      .limit(25);

    if (error) throw error;

    if (!reservas?.length) {
      return new Response(
        JSON.stringify({ success: true, processed: 0, synced: 0, skipped: 0, failed: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = await Promise.all(
      (reservas as ReservaPendiente[]).map(async (reserva) => {
        try {
          const result = await syncReservation(supabaseUrl, anonKey, reserva);
          return {
            reservationId: reserva.id,
            status: result.skipped ? "skipped" : "synced",
            eventId: result.eventId ?? null,
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          console.error("Failed to resync reservation", { reservationId: reserva.id, message });
          return {
            reservationId: reserva.id,
            status: "failed",
            error: message,
          };
        }
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        synced: results.filter((result) => result.status === "synced").length,
        skipped: results.filter((result) => result.status === "skipped").length,
        failed: results.filter((result) => result.status === "failed").length,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in resync-missing-calendar-events:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});