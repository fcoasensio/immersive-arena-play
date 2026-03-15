
DROP POLICY "Public can read config" ON public.configuracion;

CREATE POLICY "Authenticated can read config"
ON public.configuracion
FOR SELECT
TO authenticated
USING (true);
