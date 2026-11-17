const SALT = "SR-MURCIA-2026";
export const VALID_DAYS = 30;
const ALPH = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const EPOCH = Date.UTC(2026, 0, 1);
function fnv(s: string) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }
function dec(s: string) { let n = 0; for (const ch of s) { const i = ALPH.indexOf(ch); if (i < 0) return -1; n = n * 31 + i; } return n; }
export const todayIndex = (now = Date.now()) => Math.floor((now - EPOCH) / 86400000);
export const dayLabel = (d: number) => new Date(EPOCH + d * 86400000).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
export type Parsed = { ok: false; why: string } | { ok: true; id: string; score: number; day: number; age: number };
export function parseCode(raw: string, now = Date.now()): Parsed {
  const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const m = s.match(/^SR(\d{1,6})([A-Z2-9]{8})$/);
  if (!m) return { ok: false, why: "El formato no es el de un código del juego (SR-puntos-XXXX-XXXX)." };
  const score = +m[1], t = m[2], day = dec(t.slice(0, 2)), rnd = dec(t.slice(2, 5)), chk = dec(t.slice(5, 8));
  if (day < 0 || rnd < 0 || chk < 0) return { ok: false, why: "Contiene letras que el juego no usa. Revisa O/0 e I/1." };
  if (fnv(`${score}.${day}.${rnd}.${SALT}`) % 29791 !== chk) return { ok: false, why: "El código no es auténtico o hay una letra mal copiada." };
  return { ok: true, id: `SR-${score}-${t.slice(0, 4)}-${t.slice(4)}`, score, day, age: todayIndex(now) - day };
}
