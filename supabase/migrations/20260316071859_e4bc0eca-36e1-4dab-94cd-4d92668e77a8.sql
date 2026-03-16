INSERT INTO storage.buckets (id, name, public) VALUES ('email-assets', 'email-assets', true);

CREATE POLICY "Public read access for email assets" ON storage.objects FOR SELECT TO public USING (bucket_id = 'email-assets');

CREATE POLICY "Admin upload email assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'));