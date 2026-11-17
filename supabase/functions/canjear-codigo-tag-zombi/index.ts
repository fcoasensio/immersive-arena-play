import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

const SALT = "SR-MURCIA-2026";
const ALPH = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const EPOCH = Date.UTC(2026, 0, 1);
const VALID_DAYS = 30;
const inputSchema = z.object({
  codigo: z.string().trim().min(1).max(50),
  canjear: z.boolean().optional().default(false),
});

function decode(value: string) {
  let result = 0;
  for (const char of value) {
    const index = ALPH.indexOf(char);
    if (index < 0) return -1;
    result = result * 31 + index;
  }
  return result;
}

function fnv(value: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function parseCode(raw: string) {
  const normalized = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const match = normalized.match(/^SR(\d{1,6})([A-Z2-9]{8})$/);
  if (!match) return null;
  const score = Number(match[1]);
  const tail = match[2];
  const day = decode(tail.slice(0, 2));
  const random = decode(tail.slice(2, 5));
  const checksum = decode(tail.slice(5, 8));
  if (day < 0 || random < 0 || checksum < 0) return null;
  if (fnv(`${score}.${day}.${random}.${SALT}`) % 29791 !== checksum) return null;
  const age = Math.floor((Date.now() - EPOCH) / 86_400_000) - day;
  return {
    id: `SR-${score}-${tail.slice(0, 4)}-${tail.slice(4)}`,
    score,
    age,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData.user) return json({ error: "No autorizado" }, 401);
  const { data: isAdmin } = await supabase.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });
  if (!isAdmin) return json({ error: "No autorizado" }, 403);

  const parsedInput = inputSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsedInput.success) return json({ error: "Código inválido" }, 400);
  const parsed = parseCode(parsedInput.data.codigo);
  if (!parsed) return json({ status: "invalido", error: "El código no es auténtico o tiene un formato incorrecto." });
  if (parsed.age < 0) return json({ status: "fecha_futura", error: "La fecha del código es futura." });
  if (parsed.age > VALID_DAYS) return json({ status: "caducado", error: `El código ha caducado. El límite es ${VALID_DAYS} días.` });

  const issued = await supabase
    .from("codigos_tag_zombi")
    .select("codigo,email,puntos,mes,emitido_at")
    .eq("codigo", parsed.id)
    .maybeSingle();
  if (issued.error) return json({ error: "No se pudo consultar el código." }, 500);
  if (!issued.data || issued.data.puntos !== parsed.score) {
    return json({ status: "no_registrado", error: "Este código no está registrado. No aplicar el descuento." });
  }

  const details = {
    code: issued.data.codigo,
    score: issued.data.puntos,
    email: issued.data.email,
    month: issued.data.mes,
    issuedAt: issued.data.emitido_at,
  };
  const redeemed = await supabase
    .from("canjes_tag_zombi")
    .select("canjeado_at")
    .eq("codigo", parsed.id)
    .maybeSingle();
  if (redeemed.error) return json({ error: "No se pudo consultar el canje." }, 500);
  if (redeemed.data) return json({ status: "ya_canjeado", ...details, redeemedAt: redeemed.data.canjeado_at });
  if (!parsedInput.data.canjear) return json({ status: "valido", ...details });

  const inserted = await supabase.from("canjes_tag_zombi").insert({
    codigo: parsed.id,
    puntos: parsed.score,
    canjeado_por: userData.user.id,
  });
  if (inserted.error?.code === "23505") {
    const concurrent = await supabase.from("canjes_tag_zombi").select("canjeado_at").eq("codigo", parsed.id).maybeSingle();
    return json({ status: "ya_canjeado", ...details, redeemedAt: concurrent.data?.canjeado_at });
  }
  if (inserted.error) return json({ error: "No se pudo guardar el canje. Reintenta." }, 500);
  return json({ status: "canjeado", ...details });
});
