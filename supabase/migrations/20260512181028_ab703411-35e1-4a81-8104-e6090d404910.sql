ALTER TYPE public.estado_reserva ADD VALUE IF NOT EXISTS 'sospechosa';

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS score_sospecha integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS motivos_sospecha text[] NOT NULL DEFAULT '{}';