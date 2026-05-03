import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FN_URL = `${SUPABASE_URL}/functions/v1/chat-asistente`;

async function askAssistant(question: string): Promise<string> {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: question }],
    }),
  });

  if (!res.ok || !res.body) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload);
        const delta = json.choices?.[0]?.delta?.content;
        if (typeof delta === "string") full += delta;
      } catch {
        // ignore non-JSON keepalives
      }
    }
  }

  const cleaned = full.replace(/\[ESCALAR\]/g, "").trim();
  console.log(`\nQ: ${question}\nA: ${cleaned}\n`);
  return cleaned.toLowerCase();
}

const opts = { sanitizeOps: false, sanitizeResources: false };

Deno.test("VR: edad mínima 12 años", opts, async () => {
  const a = await askAssistant("¿A partir de qué edad se puede jugar a VR?");
  assertStringIncludes(a, "12");
});

Deno.test("Laser Tag: edad mínima 8 años", opts, async () => {
  const a = await askAssistant("¿Mi hijo de 7 años puede jugar al laser tag?");
  assertStringIncludes(a, "8");
});

Deno.test("Duración: partida estándar 90 min", opts, async () => {
  const a = await askAssistant("¿Cuánto dura una partida estándar de laser tag?");
  assertStringIncludes(a, "90");
  assertStringIncludes(a, "min");
});

Deno.test("Duración: cumpleaños 150 min", opts, async () => {
  const a = await askAssistant("¿Cuánto dura un cumpleaños?");
  assertStringIncludes(a, "150");
  assertStringIncludes(a, "min");
});

Deno.test("Anticipo: 50€ por Bizum al 606 323 053", opts, async () => {
  const a = await askAssistant("¿Cuánto es el anticipo y cómo se paga?");
  assertStringIncludes(a, "50");
  assertStringIncludes(a, "bizum");
  assertStringIncludes(a, "606 323 053");
});

Deno.test("Antelación mínima: 48 horas", opts, async () => {
  const a = await askAssistant("¿Con cuánta antelación tengo que reservar?");
  assertStringIncludes(a, "48");
});

Deno.test("VR: solo indoor (no outdoor)", opts, async () => {
  const a = await askAssistant("¿Hacéis VR outdoor o a domicilio?");
  assertStringIncludes(a, "indoor");
});

Deno.test("Laser Tag: indoor y outdoor disponibles", opts, async () => {
  const a = await askAssistant("¿Hacéis laser tag outdoor para fiestas patronales?");
  assertStringIncludes(a, "outdoor");
});

Deno.test("Capacidad Laser Tag: hasta 16 jugadores", opts, async () => {
  const a = await askAssistant("¿Cuántos pueden jugar a la vez al laser tag?");
  assertStringIncludes(a, "16");
});

Deno.test("Capacidad VR: hasta 12 jugadores", opts, async () => {
  const a = await askAssistant("¿Cuántos jugadores caben a la vez en la arena de VR?");
  assertStringIncludes(a, "12");
});
