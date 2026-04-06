import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ConfigValues = {
  recargo_finde_festivo: number;
  min_participantes: number;
  max_participantes: number;
  max_participantes_laser_tag: number;
  max_participantes_realidad_virtual: number;
  anticipo: number;
  antelacion_horas: number;
  horas_disponibles: string[];
};

const DEFAULTS: ConfigValues = {
  recargo_finde_festivo: 2,
  min_participantes: 6,
  max_participantes: 20,
  max_participantes_laser_tag: 16,
  max_participantes_realidad_virtual: 12,
  anticipo: 50,
  antelacion_horas: 48,
  horas_disponibles: ["11:00", "12:30", "17:00", "18:30", "20:00", "21:30"],
};

export function useConfiguracion() {
  const [config, setConfig] = useState<ConfigValues>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from("configuracion")
        .select("clave, valor");

      if (!error && data) {
        const parsed = { ...DEFAULTS };
        data.forEach((row: any) => {
          const key = row.clave as keyof ConfigValues;
          if (key in parsed) {
            const val = row.valor;
            if (key === "horas_disponibles") {
              parsed[key] = Array.isArray(val) ? val : DEFAULTS.horas_disponibles;
            } else {
              parsed[key] = typeof val === "number" ? val : Number(val) || (DEFAULTS as any)[key];
            }
          }
        });
        setConfig(parsed);
      }
      setLoading(false);
    };
    fetchConfig();
  }, []);

  return { config, loading };
}
