
CREATE TABLE public.packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NOT NULL DEFAULT '',
  precio text NOT NULL DEFAULT '',
  duracion text NOT NULL DEFAULT '',
  jugadores text NOT NULL DEFAULT '',
  icono text NOT NULL DEFAULT 'Star',
  caracteristicas jsonb NOT NULL DEFAULT '[]'::jsonb,
  popular boolean NOT NULL DEFAULT false,
  color text NOT NULL DEFAULT 'neon-blue',
  orden integer NOT NULL DEFAULT 0,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;

-- Public read for active packs
CREATE POLICY "Public can read active packs"
ON public.packs FOR SELECT
TO public
USING (activo = true);

-- Admin full access
CREATE POLICY "Admins can insert packs"
ON public.packs FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update packs"
ON public.packs FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete packs"
ON public.packs FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
