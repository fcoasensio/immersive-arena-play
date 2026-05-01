import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ChatMessage } from "@/hooks/useChatStream";

interface Props {
  historial: ChatMessage[];
  onSent: () => void;
  onCancel: () => void;
}

export default function EscalateForm({ historial, onSent, onCancel }: Props) {
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acepta) {
      toast.error("Debes aceptar el tratamiento de datos");
      return;
    }
    setEnviando(true);
    try {
      const { error } = await supabase.functions.invoke("escalar-consulta-chat", {
        body: { nombre, contacto, mensaje, historial },
      });
      if (error) throw error;
      toast.success("Consulta enviada. Te contactaremos pronto.");
      onSent();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo enviar. Llámanos al 606 323 053.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 p-4 border-t border-primary/20 bg-card/80">
      <p className="text-xs text-muted-foreground">
        Te ponemos en contacto con el gerente. Déjanos tus datos:
      </p>
      <Input
        required
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        maxLength={100}
      />
      <Input
        required
        placeholder="Email o teléfono"
        value={contacto}
        onChange={(e) => setContacto(e.target.value)}
        maxLength={150}
      />
      <Textarea
        required
        placeholder="¿En qué podemos ayudarte?"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        rows={3}
        maxLength={2000}
      />
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={acepta}
          onChange={(e) => setAcepta(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          Acepto el tratamiento de mis datos según la{" "}
          <a href="/politica-privacidad" target="_blank" className="text-primary underline">
            Política de Privacidad
          </a>
          .
        </span>
      </label>
      <div className="flex gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" className="flex-1" disabled={enviando}>
          {enviando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" /> Enviar al gerente
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
