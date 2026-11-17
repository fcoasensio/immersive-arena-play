import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

const THRESHOLD = 2000;
const SALT = "SR-MURCIA-2026";
const ALPH = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const EPOCH = Date.UTC(2026, 0, 1);
const IP_WINDOW_MS = 60_000;
const IP_MAX = 10;
const ipHits = new Map<string, number[]>();

const inputSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido").max(150),
  score: z.number().int().min(THRESHOLD).max(999999),
});

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < IP_WINDOW_MS);
  if (hits.length >= IP_MAX) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

function monthKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  if (!year || !month) throw new Error("No se pudo calcular el mes");
  return `${year}-${month}`;
}

function fnv(value: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function encode(value: number, length: number) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result = ALPH[value % 31] + result;
    value = Math.floor(value / 31);
  }
  return result;
}

function makeCode(score: number) {
  const day = Math.floor((Date.now() - EPOCH) / 86_400_000);
  const random = crypto.getRandomValues(new Uint32Array(1))[0] % 29791;
  const checksum = fnv(`${score}.${day}.${random}.${SALT}`) % 29791;
  const tail = encode(day, 2) + encode(random, 3) + encode(checksum, 3);
  return `SR-${score}-${tail.slice(0, 4)}-${tail.slice(4)}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) return json({ error: "Demasiados intentos. Inténtalo más tarde." }, 429);

  const parsed = inputSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ error: "Indica un email válido y una puntuación suficiente." }, 400);

  const { email, score } = parsed.data;
  const mes = monthKey(new Date());
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const existing = await supabase
    .from("codigos_tag_zombi")
    .select("codigo,puntos,mes,emitido_at")
    .eq("email", email)
    .eq("mes", mes)
    .maybeSingle();

  if (existing.error) return json({ error: "No se pudo comprobar el límite mensual." }, 500);
  if (existing.data) {
    return json({
      code: existing.data.codigo,
      score: existing.data.puntos,
      month: existing.data.mes,
      issuedAt: existing.data.emitido_at,
      alreadyIssued: true,
    });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const codigo = makeCode(score);
    const inserted = await supabase
      .from("codigos_tag_zombi")
      .insert({ codigo, email, puntos: score, mes })
      .select("codigo,puntos,mes,emitido_at")
      .single();

    if (!inserted.error) {
      return json({
        code: inserted.data.codigo,
        score: inserted.data.puntos,
        month: inserted.data.mes,
        issuedAt: inserted.data.emitido_at,
        alreadyIssued: false,
      }, 201);
    }

    if (inserted.error.code === "23505") {
      const concurrent = await supabase
        .from("codigos_tag_zombi")
        .select("codigo,puntos,mes,emitido_at")
        .eq("email", email)
        .eq("mes", mes)
        .maybeSingle();
      if (concurrent.data) {
        return json({
          code: concurrent.data.codigo,
          score: concurrent.data.puntos,
          month: concurrent.data.mes,
          issuedAt: concurrent.data.emitido_at,
          alreadyIssued: true,
        });
      }
      // The collision was between two generated codes; try another random suffix.
      continue;
    }

    return json({ error: "No se pudo emitir el código. Inténtalo de nuevo." }, 500);
  }

  return json({ error: "No se pudo emitir el código. Inténtalo de nuevo." }, 500);
});
