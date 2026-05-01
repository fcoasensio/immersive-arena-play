import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, RotateCcw, UserPlus } from "lucide-react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStream } from "@/hooks/useChatStream";
import EscalateForm from "./EscalateForm";
import { cn } from "@/lib/utils";

export default function ChatWidget() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showEscalate, setShowEscalate] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isStreaming, error, needsEscalation, send, reset, setNeedsEscalation } =
    useChatStream();

  // Ocultar en /admin
  if (location.pathname.startsWith("/admin")) return null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    send(input);
    setInput("");
  };

  return (
    <>
      {/* Burbuja flotante */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_30px_hsl(var(--primary)/0.6)] flex items-center justify-center text-primary-foreground"
            aria-label="Abrir asistente de chat"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed z-50 bg-card/95 backdrop-blur-xl border border-primary/40 shadow-[0_0_40px_hsl(var(--primary)/0.4)]",
              "flex flex-col overflow-hidden",
              "inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[380px] sm:h-[560px] sm:rounded-2xl",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20 bg-gradient-to-r from-primary/20 to-accent/20">
              <div>
                <h3 className="font-bold text-foreground" translate="no">
                  shootandrun
                </h3>
                <p className="text-xs text-muted-foreground">Asistente virtual</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={reset} aria-label="Reiniciar chat">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Cerrar">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm border border-border/50",
                    )}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">{m.content}</span>
                    )}
                  </div>
                </div>
              ))}
              {isStreaming && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 border border-border/50">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                      <span
                        className="h-2 w-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <p className="text-xs text-destructive text-center">{error}</p>
              )}
              {needsEscalation && !showEscalate && (
                <div className="flex justify-center pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowEscalate(true)}
                    className="border-accent/50 text-accent hover:bg-accent/10"
                  >
                    <UserPlus className="h-4 w-4 mr-1" /> Escalar al gerente
                  </Button>
                </div>
              )}
            </div>

            {/* Form de escalado o input */}
            {showEscalate ? (
              <EscalateForm
                historial={messages}
                onSent={() => {
                  setShowEscalate(false);
                  setNeedsEscalation(false);
                }}
                onCancel={() => setShowEscalate(false)}
              />
            ) : (
              <form onSubmit={handleSend} className="p-3 border-t border-primary/20 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta…"
                  maxLength={1000}
                  disabled={isStreaming}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isStreaming || !input.trim()}>
                  {isStreaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            )}

            <div className="px-3 pb-2 text-[10px] text-muted-foreground text-center">
              Si no encuentro la respuesta, te paso con el gerente.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
