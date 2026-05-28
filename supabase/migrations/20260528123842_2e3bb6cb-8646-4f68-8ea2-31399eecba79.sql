ALTER TABLE public.leads_rapidos ALTER COLUMN telefono DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.instagram_sync_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spreadsheet_id text NOT NULL,
  sheet_name text NOT NULL DEFAULT 'Instagram',
  active boolean NOT NULL DEFAULT true,
  last_sync_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.instagram_sync_config TO authenticated;
GRANT ALL ON public.instagram_sync_config TO service_role;

ALTER TABLE public.instagram_sync_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read instagram_sync_config"
  ON public.instagram_sync_config FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert instagram_sync_config"
  ON public.instagram_sync_config FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update instagram_sync_config"
  ON public.instagram_sync_config FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete instagram_sync_config"
  ON public.instagram_sync_config FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));