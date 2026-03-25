-- Insert per-event-type pricing config rows
INSERT INTO public.configuracion (clave, valor, descripcion)
VALUES
  ('precio_cumpleanos', '25', 'Precio por persona para cumpleaños'),
  ('precio_despedida', '20', 'Precio por persona para despedidas')
ON CONFLICT (clave) DO NOTHING;

-- Update the trigger function to use event-type-specific pricing
CREATE OR REPLACE FUNCTION public.calcular_precios_reserva()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_precio_por_persona numeric;
  v_recargo numeric;
  v_config_precio_90 numeric;
  v_config_precio_150 numeric;
  v_config_precio_270 numeric;
  v_config_precio_cumpleanos numeric;
  v_config_precio_despedida numeric;
  v_config_recargo numeric;
  v_es_finde boolean;
  v_es_festivo boolean;
BEGIN
  SELECT (valor::text)::numeric INTO v_config_precio_90
    FROM configuracion WHERE clave = 'precio_90min';
  SELECT (valor::text)::numeric INTO v_config_precio_150
    FROM configuracion WHERE clave = 'precio_150min';
  SELECT (valor::text)::numeric INTO v_config_precio_270
    FROM configuracion WHERE clave = 'precio_270min';
  SELECT (valor::text)::numeric INTO v_config_precio_cumpleanos
    FROM configuracion WHERE clave = 'precio_cumpleanos';
  SELECT (valor::text)::numeric INTO v_config_precio_despedida
    FROM configuracion WHERE clave = 'precio_despedida';
  SELECT (valor::text)::numeric INTO v_config_recargo
    FROM configuracion WHERE clave = 'recargo_finde_festivo';

  v_config_precio_90 := COALESCE(v_config_precio_90, 20);
  v_config_precio_150 := COALESCE(v_config_precio_150, 22);
  v_config_precio_270 := COALESCE(v_config_precio_270, 35);
  v_config_precio_cumpleanos := COALESCE(v_config_precio_cumpleanos, 25);
  v_config_precio_despedida := COALESCE(v_config_precio_despedida, 20);
  v_config_recargo := COALESCE(v_config_recargo, 2);

  IF NEW.tipo_reserva = 'cumpleanos' THEN
    v_precio_por_persona := v_config_precio_cumpleanos;
  ELSIF NEW.tipo_reserva = 'despedida' THEN
    v_precio_por_persona := v_config_precio_despedida;
  ELSIF NEW.duracion = '270' THEN
    v_precio_por_persona := v_config_precio_270;
  ELSIF NEW.duracion = '150' THEN
    v_precio_por_persona := v_config_precio_150;
  ELSE
    v_precio_por_persona := v_config_precio_90;
  END IF;

  v_es_finde := EXTRACT(DOW FROM NEW.fecha) IN (0, 6);
  v_es_festivo := EXISTS (SELECT 1 FROM festivos WHERE fecha = NEW.fecha);

  IF v_es_finde OR v_es_festivo THEN
    v_recargo := v_config_recargo;
  ELSE
    v_recargo := 0;
  END IF;

  NEW.precio_base := v_precio_por_persona * NEW.num_participantes;
  NEW.precio_final := (v_precio_por_persona + v_recargo) * NEW.num_participantes;

  RETURN NEW;
END;
$function$;