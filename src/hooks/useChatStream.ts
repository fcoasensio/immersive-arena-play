import { useState, useRef, useCallback } from "react";

export type ChatMessage = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-asistente`;

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "¡Hola! 👋 Soy el asistente de shootandrun. Pregúntame lo que quieras sobre Laser Tag, Realidad Virtual, precios, cumpleaños o eventos.",
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsEscalation, setNeedsEscalation] = useState(false);
  const inFlight = useRef(false);

  const send = useCallback(
    async (text: string) => {
      if (inFlight.current) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      inFlight.current = true;
      setError(null);
      setNeedsEscalation(false);
      setIsStreaming(true);

      const userMsg: ChatMessage = { role: "user", content: trimmed };
      const baseHistory = [...messages, userMsg];
      setMessages(baseHistory);

      let assistantSoFar = "";
      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.length > baseHistory.length) {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
            );
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: baseHistory.slice(-20).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!resp.ok || !resp.body) {
          if (resp.status === 429) setError("Demasiadas consultas. Espera un momento.");
          else if (resp.status === 402) setError("Servicio no disponible ahora mismo.");
          else setError("No he podido responder. Inténtalo de nuevo.");
          setIsStreaming(false);
          inFlight.current = false;
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let done = false;

        while (!done) {
          const { done: rDone, value } = await reader.read();
          if (rDone) break;
          buffer += decoder.decode(value, { stream: true });

          let nl: number;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line || line.startsWith(":")) continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) upsert(content);
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }

        // Detectar etiqueta de escalado
        if (assistantSoFar.includes("[ESCALAR]")) {
          const cleaned = assistantSoFar.replace(/\[ESCALAR\]/g, "").trim();
          assistantSoFar = cleaned;
          setMessages((prev) =>
            prev.map((m, i) =>
              i === prev.length - 1 && m.role === "assistant"
                ? { ...m, content: cleaned }
                : m,
            ),
          );
          setNeedsEscalation(true);
        }
      } catch (e) {
        console.error(e);
        setError("Error de conexión. Inténtalo de nuevo.");
      } finally {
        setIsStreaming(false);
        inFlight.current = false;
      }
    },
    [messages],
  );

  const reset = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "¡Hola! 👋 Soy el asistente de shootandrun. Pregúntame lo que quieras sobre Laser Tag, Realidad Virtual, precios, cumpleaños o eventos.",
      },
    ]);
    setNeedsEscalation(false);
    setError(null);
  }, []);

  return { messages, isStreaming, error, needsEscalation, send, reset, setNeedsEscalation };
}
