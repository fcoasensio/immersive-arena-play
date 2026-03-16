
-- Drop the overly permissive INSERT policy
DROP POLICY "Permitir insertar reservas públicamente" ON public.reservas;

-- Create a tighter INSERT policy that validates inserted data
CREATE POLICY "Permitir insertar reservas públicamente"
ON public.reservas
FOR INSERT
TO public
WITH CHECK (
  estado = 'pendiente_pago'::estado_reserva
  AND anticipo = 50.00
  AND num_participantes > 0
);
