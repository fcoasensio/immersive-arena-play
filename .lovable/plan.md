## Objetivo

Añadir tests automatizados que verifiquen que el asistente del chat responde con los valores exactos de la base de conocimiento en los casos clave: edades mínimas, duración de las experiencias, "recargos"/anticipo, y límites indoor/outdoor por actividad.

## Aclaración importante sobre "recargos"

La base de conocimiento del chat (`knowledge.ts`) **no contiene recargos de precio** (esos viven en el motor de pricing del servidor para reservas, no en el chat). Lo único equivalente que el asistente sí debe citar exactamente es:

- **Anticipo obligatorio: 50 €** por Bizum al **606 323 053**
- **Antelación mínima: 48 horas**

Los tests cubrirán esos dos como sustitutos coherentes de "recargos". Si quieres testear recargos reales de pricing (festivos, fines de semana, etc.) habría que añadirlos primero a la knowledge base — dímelo y lo hacemos en una segunda iteración.

## Casos a cubrir

| # | Pregunta del usuario | Debe aparecer en la respuesta |
|---|---|---|
| 1 | "¿A partir de qué edad se puede jugar a VR?" | `12` (años) |
| 2 | "¿Mi hijo de 7 años puede jugar al laser tag?" | `8` (no, edad mínima 8) |
| 3 | "¿Cuánto dura una partida estándar de laser tag?" | `90` y `min` |
| 4 | "¿Cuánto dura un cumpleaños?" | `150` y `min` |
| 5 | "¿Cuánto es el anticipo y cómo se paga?" | `50`, `Bizum`, `606 323 053` |
| 6 | "¿Con cuánta antelación tengo que reservar?" | `48` (horas) |
| 7 | "¿Hacéis VR outdoor?" | menciona que VR es **solo indoor** |
| 8 | "¿Hacéis laser tag outdoor?" | confirma `indoor` y `outdoor` para laser tag |
| 9 | "¿Cuántos pueden jugar a laser tag a la vez?" | `16` |
| 10 | "¿Cuántos pueden jugar a VR a la vez?" | `12` |

Cada aserción será **case-insensitive** y buscará subcadenas (no match exacto), porque la salida del LLM es no determinista. Eso da robustez sin perder rigor sobre los valores que tienen que estar.

## Implementación técnica

**Archivo nuevo**: `supabase/functions/chat-asistente/index.test.ts`

- Usa `Deno.test` con `sanitizeOps/Resources: false` (porque consumimos un stream SSE).
- Carga `.env` raíz vía `https://deno.land/std@0.224.0/dotenv/load.ts` para tener `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Helper `askAssistant(question: string): Promise<string>`:
  1. `POST` a `${VITE_SUPABASE_URL}/functions/v1/chat-asistente` con `apikey` + `Authorization: Bearer <anon>` y body `{ messages: [{ role: "user", content: question }] }`.
  2. Lee el `ReadableStream` SSE línea a línea, parsea cada `data: {...}` y concatena `choices[0].delta.content`.
  3. Devuelve el texto final completo (sin la etiqueta `[ESCALAR]` para las aserciones).
- Cada caso es un `Deno.test` independiente con `assertStringIncludes` (case-insensitive comparando en lowercase).
- Timeout generoso por test (el modelo puede tardar varios segundos). Reutilizamos el mismo patrón de fetch que ya tienes en otros edge functions.

**Sin cambios** en `index.ts` ni en `knowledge.ts`. Los tests se ejecutan contra la función desplegada (mismo modelo, misma KB, mismo stream).

## Ejecución

Una vez creado el archivo, los tests se podrán lanzar desde la herramienta de tests de edge functions filtrando por `chat-asistente`. Los resultados mostrarán por consola la respuesta completa del asistente para cada pregunta, lo que también te servirá como forma rápida de auditar tono y exactitud.

## Notas / limitaciones

- Como el modelo es no determinista, un test puede fallar puntualmente si el modelo parafrasea de forma poco habitual (p. ej. escribe "doce" en vez de "12"). Si ocurre, ampliamos las aserciones a aceptar variantes (`12|doce`).
- Estos tests **consumen créditos de Lovable AI** cada vez que se ejecutan (10 llamadas al modelo por corrida completa). Usa el modelo más barato ya configurado (`gemini-3-flash-preview`).