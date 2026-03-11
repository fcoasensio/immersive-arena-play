DROP POLICY IF EXISTS "Anyone can read reservations by id" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;
DROP TABLE IF EXISTS public.reservations;