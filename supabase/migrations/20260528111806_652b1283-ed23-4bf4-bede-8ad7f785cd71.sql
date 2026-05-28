
-- Extend leads_rapidos with qualification + scoring fields
ALTER TABLE public.leads_rapidos
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS actividad_interes text,
  ADD COLUMN IF NOT EXISTS edad_participantes text,
  ADD COLUMN IF NOT EXISTS presupuesto text,
  ADD COLUMN IF NOT EXISTS cuando text,
  ADD COLUMN IF NOT EXISTS codigo_postal text,
  ADD COLUMN IF NOT EXISTS como_nos_conociste text,
  ADD COLUMN IF NOT EXISTS score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS categoria text NOT NULL DEFAULT 'C',
  ADD COLUMN IF NOT EXISTS motivos_score jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_leads_rapidos_categoria_score
  ON public.leads_rapidos (categoria, score DESC, created_at DESC);

-- Table for pending email drafts to leads
CREATE TABLE IF NOT EXISTS public.lead_emails_pendientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads_rapidos(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  recipient_nombre text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  categoria text NOT NULL,
  status text NOT NULL DEFAULT 'pendiente_aprobacion',
  sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT lead_emails_pendientes_status_chk
    CHECK (status IN ('pendiente_aprobacion', 'enviado', 'descartado'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_emails_pendientes TO authenticated;
GRANT ALL ON public.lead_emails_pendientes TO service_role;

ALTER TABLE public.lead_emails_pendientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read lead_emails_pendientes"
  ON public.lead_emails_pendientes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lead_emails_pendientes"
  ON public.lead_emails_pendientes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lead_emails_pendientes"
  ON public.lead_emails_pendientes FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Deny direct inserts on lead_emails_pendientes"
  ON public.lead_emails_pendientes FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE INDEX IF NOT EXISTS idx_lead_emails_pendientes_status
  ON public.lead_emails_pendientes (status, created_at DESC);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_lead_emails_pendientes_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lead_emails_pendientes_updated_at ON public.lead_emails_pendientes;
CREATE TRIGGER lead_emails_pendientes_updated_at
  BEFORE UPDATE ON public.lead_emails_pendientes
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_lead_emails_pendientes_updated_at();
