import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, UserPlus, Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Evento = { created_at: string; session_id: string; escalada: boolean };

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function AdminChatbotStats() {
  const [eventos, setEventos] = useState<Evento[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const { data, error } = await supabase
        .from("chat_eventos")
        .select("created_at, session_id, escalada")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setEventos(data ?? []);
    })();
  }, []);

  const stats = useMemo(() => {
    if (!eventos) return null;
    const now = new Date();
    const d1 = startOfDay(now);
    const d7 = new Date(d1); d7.setDate(d7.getDate() - 6);
    const d30 = new Date(d1); d30.setDate(d30.getDate() - 29);

    const inRange = (e: Evento, from: Date) => new Date(e.created_at) >= from;
    const distinct = (arr: Evento[]) => new Set(arr.map(e => e.session_id)).size;

    const hoy = eventos.filter(e => inRange(e, d1));
    const semana = eventos.filter(e => inRange(e, d7));
    const mes = eventos.filter(e => inRange(e, d30));

    const escaladas30 = mes.filter(e => e.escalada).length;
    const conv30 = distinct(mes);

    // Series por día (últimos 30)
    const days: { fecha: string; mensajes: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(d1); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const count = eventos.filter(
        e => new Date(e.created_at) >= d && new Date(e.created_at) < next,
      ).length;
      days.push({
        fecha: d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }),
        mensajes: count,
      });
    }

    return {
      msgHoy: hoy.length,
      msg7: semana.length,
      msg30: mes.length,
      conv7: distinct(semana),
      conv30,
      escaladas30,
      pctEscalada: conv30 > 0 ? Math.round((escaladas30 / conv30) * 100) : 0,
      days,
    };
  }, [eventos]);

  if (error) {
    return <p className="text-destructive text-sm">Error: {error}</p>;
  }

  if (!stats) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<MessageCircle size={18} />} label="Mensajes hoy" value={stats.msgHoy} />
        <StatCard icon={<MessageCircle size={18} />} label="Mensajes 7d" value={stats.msg7} />
        <StatCard icon={<MessageCircle size={18} />} label="Mensajes 30d" value={stats.msg30} />
        <StatCard icon={<Users size={18} />} label="Conversaciones 30d" value={stats.conv30} />
        <StatCard icon={<Users size={18} />} label="Conversaciones 7d" value={stats.conv7} />
        <StatCard
          icon={<UserPlus size={18} />}
          label="Escaladas 30d"
          value={`${stats.escaladas30} (${stats.pctEscalada}%)`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mensajes por día (últimos 30)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.days}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="fecha"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                interval={3}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="mensajes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Solo se registran un identificador de sesión anónimo y un timestamp por mensaje.
        No se almacena ningún contenido de las conversaciones.
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          {icon} {label}
        </div>
        <div className="text-2xl font-bold text-primary">{value}</div>
      </CardContent>
    </Card>
  );
}
