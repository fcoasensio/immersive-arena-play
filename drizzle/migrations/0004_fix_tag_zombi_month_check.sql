ALTER TABLE public.codigos_tag_zombi DROP CONSTRAINT codigos_tag_zombi_mes_check;
ALTER TABLE public.codigos_tag_zombi ADD CONSTRAINT codigos_tag_zombi_mes_check CHECK (mes ~ '^[0-9]{4}-[0-9]{2}$');