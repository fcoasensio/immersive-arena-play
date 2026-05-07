CREATE TABLE public.chat_eventos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  session_id uuid NOT NULL,
  escalada boolean NOT NULL DEFAULT false
);

CREATE INDEX idx_chat_eventos_created_at ON public.chat_eventos (created_at DESC);
CREATE INDEX idx_chat_eventos_session_id ON public.chat_eventos (session_id);

ALTER TABLE public.chat_eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read chat_eventos"
ON public.chat_eventos FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny inserts on chat_eventos"
ON public.chat_eventos FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny updates on chat_eventos"
ON public.chat_eventos FOR UPDATE
TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Deny deletes on chat_eventos"
ON public.chat_eventos FOR DELETE
TO anon, authenticated
USING (false);