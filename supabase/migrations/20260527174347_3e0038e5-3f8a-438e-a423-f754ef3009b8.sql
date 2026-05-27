CREATE TABLE public.leads_rapidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo_evento TEXT NOT NULL,
  num_personas TEXT,
  fecha_orientativa DATE,
  consentimiento BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'popup_contacto_rapido',
  page_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  client_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.leads_rapidos TO authenticated;
GRANT ALL ON public.leads_rapidos TO service_role;

ALTER TABLE public.leads_rapidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read leads_rapidos"
  ON public.leads_rapidos FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update leads_rapidos"
  ON public.leads_rapidos FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete leads_rapidos"
  ON public.leads_rapidos FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny direct inserts on leads_rapidos"
  ON public.leads_rapidos FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE INDEX idx_leads_rapidos_created_at ON public.leads_rapidos (created_at DESC);