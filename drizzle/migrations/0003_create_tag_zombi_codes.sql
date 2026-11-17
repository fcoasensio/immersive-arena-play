CREATE TABLE public.codigos_tag_zombi (
  codigo text PRIMARY KEY,
  email text NOT NULL,
  puntos integer NOT NULL CHECK (puntos >= 0),
  mes text NOT NULL CHECK (mes ~ '^\\d{4}-\\d{2}$'),
  emitido_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT codigos_tag_zombi_email_mes_unico UNIQUE (email, mes)
);
GRANT SELECT ON public.codigos_tag_zombi TO authenticated;
GRANT ALL ON public.codigos_tag_zombi TO service_role;
ALTER TABLE public.codigos_tag_zombi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read codigos tag zombi" ON public.codigos_tag_zombi FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));