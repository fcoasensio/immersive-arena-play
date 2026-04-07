
-- Explicit DENY policies on user_roles for INSERT, UPDATE, DELETE
CREATE POLICY "Deny all inserts on user_roles"
  ON public.user_roles FOR INSERT
  TO authenticated, anon
  WITH CHECK (false);

CREATE POLICY "Deny all updates on user_roles"
  ON public.user_roles FOR UPDATE
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny all deletes on user_roles"
  ON public.user_roles FOR DELETE
  TO authenticated, anon
  USING (false);

-- Remove public INSERT policy on reservas (will be handled by edge function with service role)
DROP POLICY IF EXISTS "Permitir insertar reservas públicamente" ON public.reservas;
