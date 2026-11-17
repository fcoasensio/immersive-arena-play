import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeTagZombiEmail } from "@/lib/tagZombiMonthly";

type CodeRequest = {
  type: "tag-zombi:emitir-codigo";
  requestId: string;
  email: string;
  score: number;
};

const TagZombi = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    document.title = "Tag Zombi · shootandrun";

    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      const request = event.data as Partial<CodeRequest>;
      if (
        request.type !== "tag-zombi:emitir-codigo" ||
        typeof request.requestId !== "string" ||
        typeof request.email !== "string" ||
        typeof request.score !== "number"
      ) return;

      let payload: Record<string, unknown>;
      try {
        const { data, error } = await supabase.functions.invoke("emitir-codigo-tag-zombi", {
          body: { email: normalizeTagZombiEmail(request.email), score: request.score },
        });
        if (error) {
          const context = (error as { context?: Response }).context;
          const body = await context?.json().catch(() => null);
          payload = { error: body?.error || "No se pudo emitir el código. Inténtalo de nuevo." };
        } else {
          payload = (data || {}) as Record<string, unknown>;
        }
      } catch {
        payload = { error: "No hay conexión. Comprueba tu red e inténtalo de nuevo." };
      }

      iframeRef.current?.contentWindow?.postMessage({
        type: "tag-zombi:codigo-resultado",
        requestId: request.requestId,
        ...payload,
      }, window.location.origin);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <>
      <iframe ref={iframeRef} src="/juego/tag-zombi.html" title="Tag Zombi" className="fixed inset-0 w-full h-full border-0" allow="autoplay" />
      <Link
        to="/"
        aria-label="Salir del juego"
        className="fixed bottom-4 left-4 z-[60] flex items-center gap-1 rounded-md border border-border bg-background/80 px-3 py-2 text-sm font-semibold text-foreground backdrop-blur hover:bg-background"
      >
        <X size={16} /> Salir
      </Link>
    </>
  );
};
export default TagZombi;
