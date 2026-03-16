
-- Create a trigger function that computes precio_base and precio_final server-side
-- based on the reservation parameters and the configuracion table
CREATE OR REPLACE FUNCTION public.calcular_precios_reserva()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_precio_por_persona numeric;
  v_recargo numeric;
  v_config_precio_90 numeric;
  v_config_precio_150 numeric;
  v_config_precio_270 numeric;
  v_config_recargo numeric;
  v_es_finde boolean;
  v_es_festivo boolean;
BEGIN
  -- Read pricing config
  SELECT (valor::text)::numeric INTO v_config_precio_90
    FROM configuracion WHERE clave = 'precio_90min';
  SELECT (valor::text)::numeric INTO v_config_precio_150
    FROM configuracion WHERE clave = 'precio_150min';
  SELECT (valor::text)::numeric INTO v_config_precio_270
    FROM configuracion WHERE clave = 'precio_270min';
  SELECT (valor::text)::numeric INTO v_config_recargo
    FROM configuracion WHERE clave = 'recargo_finde_festivo';

  -- Defaults if config missing
  v_config_precio_90 := COALESCE(v_config_precio_90, 20);
  v_config_precio_150 := COALESCE(v_config_precio_150, 22);
  v_config_precio_270 := COALESCE(v_config_precio_270, 35);
  v_config_recargo := COALESCE(v_config_recargo, 2);

  -- Determine price per person based on duration
  IF NEW.duracion = '270' THEN
    v_precio_por_persona := v_config_precio_270;
  ELSIF NEW.duracion = '150' THEN
    v_precio_por_persona := v_config_precio_150;
  ELSE
    v_precio_por_persona := v_config_precio_90;
  END IF;

  -- Check if weekend or holiday
  v_es_finde := EXTRACT(DOW FROM NEW.fecha) IN (0, 6);
  v_es_festivo := EXISTS (SELECT 1 FROM festivos WHERE fecha = NEW.fecha);

  IF v_es_finde OR v_es_festivo THEN
    v_recargo := v_config_recargo;
  ELSE
    v_recargo := 0;
  END IF;

  -- Compute prices (overwrite whatever the client sent)
  NEW.precio_base := v_precio_por_persona * NEW.num_participantes;
  NEW.precio_final := (v_precio_por_persona + v_recargo) * NEW.num_participantes;

  RETURN NEW;
END;
$$;

-- Attach trigger on INSERT (and UPDATE for admin corrections)
CREATE TRIGGER trg_calcular_precios_reserva
BEFORE INSERT OR UPDATE ON public.reservas
FOR EACH ROW
EXECUTE FUNCTION public.calcular_precios_reserva();

-- Update RLS policy: no need to validate prices since trigger overwrites them
DROP POLICY "Permitir insertar reservas públicamente" ON public.reservas;
CREATE POLICY "Permitir insertar reservas públicamente"
ON public.reservas
FOR INSERT
TO public
WITH CHECK (
  estado = 'pendiente_pago'::estado_reserva
  AND anticipo = 50.00
  AND num_participantes > 0
);
