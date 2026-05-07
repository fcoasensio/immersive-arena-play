import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { KNOWLEDGE_BASE } from "./knowledge.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
  session_id: z.string().uuid().optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY no configurada");

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Mensaje no válido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { messages, session_id } = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Registrar evento anónimo de uso (sin contenido)
    let eventoId: string | null = null;
    if (session_id) {
      try {
        const { data: ev } = await supabase
          .from("chat_eventos")
          .insert({ session_id })
          .select("id")
          .single();
        eventoId = ev?.id ?? null;
      } catch (e) {
        console.warn("No se pudo registrar evento de chat:", e);
      }
    }

    // Cargar packs activos para mantener info actualizada
    let packsInfo = "";
    try {
      const { data: packs } = await supabase
        .from("packs")
        .select("nombre, descripcion, precio, duracion, jugadores")
        .eq("activo", true)
        .order("orden");

      if (packs && packs.length > 0) {
        packsInfo = "\n\n## Packs disponibles actualmente\n" +
          packs.map((p: any) =>
            `- **${p.nombre}** (${p.precio}, ${p.duracion}, ${p.jugadores}): ${p.descripcion}`
          ).join("\n");
      }
    } catch (e) {
      console.warn("No se pudieron cargar los packs:", e);
    }

    const systemPrompt = `Eres el asistente virtual de shootandrun, un centro de Laser Tag y Realidad Virtual en Alcantarilla (Murcia).

REGLAS ESTRICTAS:
1. Responde ÚNICAMENTE en español, en tono cercano, juvenil y entusiasta.
2. Responde SOLO con la información del CONTEXTO de abajo. NO inventes precios, horarios ni disponibilidad.
3. Sé breve: máximo 3-4 frases por respuesta. Usa markdown ligero (negritas, listas) si ayuda.
4. La VR es solo para mayores de 12 años. SIN EXCEPCIONES.
5. El Laser Tag es para mayores de 8 años.
6. Para reservar siempre redirige a /reservar y menciona el anticipo de 50€ por Bizum.
7. Para presupuestos de eventos grandes, outdoor a medida, o cualquier cosa fuera del contexto: termina tu mensaje con la etiqueta literal [ESCALAR] (sin nada más después) para ofrecer escalado al gerente.
8. Si te preguntan algo personal del cliente (su reserva concreta, su pago, etc.) o algo no cubierto en el contexto: usa [ESCALAR].
9. Nunca inventes URLs ni datos de contacto distintos a los del contexto.

CONTEXTO:
${KNOWLEDGE_BASE}${packsInfo}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas consultas. Inténtalo en un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Servicio temporalmente no disponible." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Error del asistente" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-asistente error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
