import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  nombre: z.string().min(2).max(100),
  contacto: z.string().min(5).max(150),
  mensaje: z.string().min(5).max(2000),
  historial: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(2000),
    }),
  ).max(20).default([]),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY no configurada");

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { nombre, contacto, mensaje, historial } = parsed.data;

    const escapeHtml = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const transcript = historial.length > 0
      ? historial.map((m) =>
          `<div style="margin:8px 0;padding:8px;background:${m.role === "user" ? "#1a1a2e" : "#0f1729"};border-radius:6px;color:#e2e8f0">
            <strong style="color:${m.role === "user" ? "#a78bfa" : "#22d3ee"}">${m.role === "user" ? "Cliente" : "Asistente"}:</strong>
            <div style="white-space:pre-wrap;margin-top:4px">${escapeHtml(m.content)}</div>
          </div>`
        ).join("")
      : "<p style='color:#94a3b8'>(Sin conversación previa)</p>";

    const html = `
      <div style="font-family:system-ui,sans-serif;background:#0a0a14;color:#e2e8f0;padding:24px;border-radius:8px">
        <h2 style="color:#22d3ee;margin-top:0">Nueva consulta desde el chat de shootandrun</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Contacto:</strong> ${escapeHtml(contacto)}</p>
        <h3 style="color:#a78bfa">Mensaje del cliente</h3>
        <div style="padding:12px;background:#1a1a2e;border-left:3px solid #a78bfa;border-radius:4px;white-space:pre-wrap">${escapeHtml(mensaje)}</div>
        <h3 style="color:#a78bfa;margin-top:24px">Conversación previa con el asistente</h3>
        ${transcript}
        <p style="color:#64748b;font-size:12px;margin-top:24px">Recibido automáticamente desde shootandrun.es</p>
      </div>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "shootandrun <onboarding@resend.dev>",
        to: ["hola@shootandrun.es"],
        reply_to: contacto.includes("@") ? contacto : undefined,
        subject: `Consulta del chat: ${nombre}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const txt = await resendRes.text();
      console.error("Resend error:", resendRes.status, txt);
      throw new Error("No se pudo enviar el email");
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("escalar-consulta-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
