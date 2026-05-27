
-- 1. Reservas: explicit deny INSERT for anon and authenticated (edge function uses service_role which bypasses RLS)
CREATE POLICY "Deny direct inserts on reservas"
ON public.reservas
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny direct deletes on reservas"
ON public.reservas
FOR DELETE
TO anon, authenticated
USING (false);

-- 2. Recursos bucket: admin-only policies
CREATE POLICY "Admins can read recursos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'recursos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can upload recursos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recursos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update recursos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'recursos' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'recursos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete recursos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'recursos' AND public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Drop broad public listing policy on email-assets (public bucket files remain accessible via direct URL)
DROP POLICY IF EXISTS "Public read access for email assets" ON storage.objects;

-- 4. Restrict has_role execution: keep authenticated (needed for RLS), revoke from PUBLIC and anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
