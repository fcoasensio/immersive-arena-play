import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2, Send, Pencil, Trash2, Check, X, Eye } from "lucide-react";

type Draft = {
  id: string;
  lead_id: string;
  recipient_email: string;
  recipient_nombre: string;
  subject: string;
  body_html: string;
  categoria: string;
  status: string;
  sent_at: string | null;
  created_at: string;
};

const catBadge = (c: string) => {
  if (c === "A") return "bg-neon-green/20 text-neon-green border-neon-green/40";
  if (c === "B") return "bg-amber-500/20 text-amber-400 border-amber-500/40";
  return "bg-muted text-muted-foreground border-border";
};

const AdminEmailsPendientes = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pendiente_aprobacion");
  const [editing, setEditing] = useState<Record<string, { subject: string; body_html: string } | null>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lead_emails_pendientes")
      .select("*")
      .eq("status", statusFilter)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) toast.error("Error cargando borradores");
    setDrafts((data || []) as Draft[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const startEdit = (d: Draft) => {
    setEditing(s => ({ ...s, [d.id]: { subject: d.subject, body_html: d.body_html } }));
  };
  const cancelEdit = (id: string) => setEditing(s => ({ ...s, [id]: null }));

  const approve = async (d: Draft) => {
    setBusy(d.id);
    try {
      const edit = editing[d.id];
      const { error } = await supabase.functions.invoke("enviar-email-lead-aprobado", {
        body: {
          draft_id: d.id,
          subject: edit?.subject ?? d.subject,
          body_html: edit?.body_html ?? d.body_html,
        },
      });
      if (error) throw error;
      toast.success("Email enviado al cliente");
      await load();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Error enviando email");
    } finally {
      setBusy(null);
    }
  };

  const discard = async (d: Draft) => {
    if (!confirm("¿Descartar este borrador sin enviar?")) return;
    setBusy(d.id);
    const { error } = await supabase
      .from("lead_emails_pendientes")
      .update({ status: "descartado" })
      .eq("id", d.id);
    if (error) toast.error("Error descartando");
    else { toast.success("Borrador descartado"); await load(); }
    setBusy(null);
  };

  return (
    <div className="space-y-4">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="pendiente_aprobacion">Pendientes</TabsTrigger>
          <TabsTrigger value="enviado">Enviados</TabsTrigger>
          <TabsTrigger value="descartado">Descartados</TabsTrigger>
        </TabsList>
        <TabsContent value={statusFilter} className="mt-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
          ) : drafts.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">Sin borradores en esta categoría.</div>
          ) : (
            <div className="space-y-4">
              {drafts.map(d => {
                const ed = editing[d.id];
                const isEditing = !!ed;
                return (
                  <div key={d.id} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={catBadge(d.categoria)}>{d.categoria}</Badge>
                          <span className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString("es-ES")}</span>
                        </div>
                        <div className="font-semibold">{d.recipient_nombre}</div>
                        <div className="text-sm text-muted-foreground">{d.recipient_email}</div>
                      </div>
                      {d.status === "pendiente_aprobacion" && (
                        <div className="flex gap-2 flex-wrap">
                          {!isEditing ? (
                            <>
                              <Button size="sm" variant="outline" onClick={() => startEdit(d)}>
                                <Pencil className="w-4 h-4 mr-1" /> Editar
                              </Button>
                              <Button size="sm" variant="default" disabled={busy === d.id} onClick={() => approve(d)}>
                                {busy === d.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
                                Aprobar y enviar
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => discard(d)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => cancelEdit(d.id)}>
                                <X className="w-4 h-4 mr-1" /> Cancelar
                              </Button>
                              <Button size="sm" variant="default" disabled={busy === d.id} onClick={() => approve(d)}>
                                {busy === d.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                                Guardar y enviar
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                      {d.status === "enviado" && (
                        <Badge variant="outline" className="bg-neon-blue/15 text-neon-blue border-neon-blue/40">
                          Enviado {d.sent_at ? new Date(d.sent_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : ""}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      {isEditing ? (
                        <>
                          <Input
                            value={ed!.subject}
                            onChange={e => setEditing(s => ({ ...s, [d.id]: { ...ed!, subject: e.target.value } }))}
                            placeholder="Asunto"
                          />
                          <Textarea
                            value={ed!.body_html}
                            onChange={e => setEditing(s => ({ ...s, [d.id]: { ...ed!, body_html: e.target.value } }))}
                            rows={14}
                            className="font-mono text-xs"
                          />
                          <div className="text-xs text-muted-foreground">Vista previa:</div>
                          <div className="border border-border rounded p-2 bg-background max-h-72 overflow-auto" dangerouslySetInnerHTML={{ __html: ed!.body_html }} />
                        </>
                      ) : (
                        <>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">Asunto</div>
                          <div className="font-medium">{d.subject}</div>
                          <details>
                            <summary className="cursor-pointer text-xs text-primary inline-flex items-center gap-1 mt-2">
                              <Eye className="w-3 h-3" /> Ver email completo
                            </summary>
                            <div className="border border-border rounded p-2 bg-background max-h-96 overflow-auto mt-2" dangerouslySetInnerHTML={{ __html: d.body_html }} />
                          </details>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEmailsPendientes;
