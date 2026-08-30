ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS expira_at timestamptz,
  ADD COLUMN IF NOT EXISTS recordatorio_enviado_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelada_motivo text;

UPDATE public.reservas
SET expira_at = created_at + interval '5 hours'
WHERE estado = 'pendiente_pago' AND expira_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_reservas_expira_at ON public.reservas (expira_at) WHERE estado = 'pendiente_pago';