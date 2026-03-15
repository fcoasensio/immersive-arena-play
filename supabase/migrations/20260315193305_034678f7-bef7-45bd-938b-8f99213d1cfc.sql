
DROP POLICY "Authenticated can read config" ON public.configuracion;

CREATE POLICY "Admins can read config"
ON public.configuracion
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
