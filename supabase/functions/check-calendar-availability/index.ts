import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Parse the service-account JSON and build a signed JWT for Google APIs. */
async function getAccessToken(
  serviceAccount: { client_email: string; private_key: string },
  scopes: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: scopes,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const unsignedToken = `${encode(header)}.${encode(payload)}`;

  const pemBody = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const signedToken = `${unsignedToken}.${btoa(
    String.fromCharCode(...new Uint8Array(signature))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signedToken,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    throw new Error(`Google OAuth error: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

const ACTIVITY_LABELS: Record<string, string> = {
  laser_tag: "Láser Tag",
  realidad_virtual: "Realidad Virtual",
  combinada: "Láser Tag + VR",
};

const TYPE_LABELS: Record<string, string> = {
  cumpleanos: "Cumpleaños",
  grupos: "Grupos",
  despedida: "Despedida",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");

    if (!serviceAccountJson || !calendarId) {
      throw new Error("Google Calendar secrets not configured");
    }

    const serviceAccount = JSON.parse(serviceAccountJson);
    const body = await req.json();
    const { action } = body;

    // ── CHECK AVAILABILITY ──
    if (!action || action === "check") {
      const { date, time, duration } = body;

      if (!date || !time || !duration) {
        return new Response(
          JSON.stringify({ error: "Se requieren fecha, hora y duración" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const startDateTime = new Date(`${date}T${time}:00`);
      const durationMinutes = parseInt(duration) || 90;
      const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);

      const accessToken = await getAccessToken(
        serviceAccount,
        "https://www.googleapis.com/auth/calendar.readonly"
      );

      const params = new URLSearchParams({
        timeMin: startDateTime.toISOString(),
        timeMax: endDateTime.toISOString(),
        singleEvents: "true",
        orderBy: "startTime",
      });

      const calendarRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const calendarData = await calendarRes.json();
      if (!calendarRes.ok) {
        console.error("Google Calendar API error:", calendarData);
        throw new Error(`Calendar API error: ${calendarData.error?.message || "Unknown"}`);
      }

      const events = calendarData.items || [];
      const available = events.length === 0;

      return new Response(
        JSON.stringify({
          available,
          conflictCount: events.length,
          message: available
            ? "Franja horaria disponible"
            : `Ya hay ${events.length} reserva(s) en esa franja horaria`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── CREATE EVENT ──
    if (action === "create") {
      const {
        date, time, duration,
        customerName, activityType, reservationType,
        numberOfPeople, customerPhone, customerEmail, notes,
      } = body;

      if (!date || !time || !duration || !customerName) {
        return new Response(
          JSON.stringify({ error: "Datos insuficientes para crear el evento" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const durationMinutes = parseInt(duration) || 90;
      const endHours = parseInt(time.split(":")[0]);
      const endMins = parseInt(time.split(":")[1]) + durationMinutes;
      const endH = endHours + Math.floor(endMins / 60);
      const endM = endMins % 60;
      const startDateTimeStr = `${date}T${time}:00`;
      const endDateTimeStr = `${date}T${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`;

      const actLabel = ACTIVITY_LABELS[activityType] || activityType;
      const typeLabel = TYPE_LABELS[reservationType] || reservationType;

      const summary = `📌 ${typeLabel} – ${actLabel} (${numberOfPeople} pers.)`;
      const description = [
        `👤 ${customerName}`,
        `📞 ${customerPhone || "–"}`,
        `📧 ${customerEmail || "–"}`,
        `🎯 ${actLabel}`,
        `🎉 ${typeLabel}`,
        `👥 ${numberOfPeople} participantes`,
        `⏱ ${durationMinutes} min`,
        notes ? `📝 ${notes}` : "",
      ].filter(Boolean).join("\n");

      const accessToken = await getAccessToken(
        serviceAccount,
        "https://www.googleapis.com/auth/calendar.events"
      );

      const event = {
        summary,
        description,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "Europe/Madrid",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "Europe/Madrid",
        },
        colorId: reservationType === "cumpleanos" ? "5" : reservationType === "despedida" ? "6" : "9",
      };

      const createRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      const createData = await createRes.json();
      if (!createRes.ok) {
        console.error("Google Calendar create error:", createData);
        throw new Error(`Calendar create error: ${createData.error?.message || "Unknown"}`);
      }

      // Save the event ID to the most recent matching reservation
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, serviceRoleKey);

        await supabase
          .from("reservas")
          .update({ google_calendar_event_id: createData.id })
          .eq("fecha", date)
          .eq("hora", time)
          .eq("email", customerEmail)
          .is("google_calendar_event_id", null)
          .order("created_at", { ascending: false })
          .limit(1);
      } catch (dbError) {
        console.error("Error saving calendar event ID to DB:", dbError);
      }

      return new Response(
        JSON.stringify({ success: true, eventId: createData.id }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── DELETE EVENT ──
    if (action === "delete") {
      const { eventId } = body;

      if (!eventId) {
        return new Response(
          JSON.stringify({ error: "Se requiere eventId para eliminar" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const accessToken = await getAccessToken(
        serviceAccount,
        "https://www.googleapis.com/auth/calendar.events"
      );

      const deleteRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!deleteRes.ok && deleteRes.status !== 410) {
        const errorBody = await deleteRes.text();
        console.error("Google Calendar delete error:", errorBody);
        throw new Error(`Calendar delete error: ${errorBody}`);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Acción no válida. Usa 'check', 'create' o 'delete'." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in calendar function:", error);
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
