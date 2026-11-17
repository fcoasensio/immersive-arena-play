CREATE TABLE public.canjes_tag_zombi (
  codigo text PRIMARY KEY,
  puntos integer NOT NULL,
  canjeado_at timestamptz NOT NULL DEFAULT now(),
  canjeado_por uuid
);
GRANT SELECT, INSERT ON public.canjes_tag_zombi TO authenticated;
GRANT ALL ON public.canjes_tag_zombi TO service_role;
ALTER TABLE public.canjes_tag_zombi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read canjes" ON public.canjes_tag_zombi FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert canjes" ON public.canjes_tag_zombi FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));