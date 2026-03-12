
-- Drop all RLS policies first
DROP POLICY IF EXISTS "Admins can delete pricing" ON public.pricing_options;
DROP POLICY IF EXISTS "Admins can insert pricing" ON public.pricing_options;
DROP POLICY IF EXISTS "Admins can update pricing" ON public.pricing_options;
DROP POLICY IF EXISTS "Anyone can read active pricing" ON public.pricing_options;

DROP POLICY IF EXISTS "Admins can delete reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can read reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can update reservations" ON public.reservations;

DROP POLICY IF EXISTS "Admins can delete user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update user_roles" ON public.user_roles;

DROP POLICY IF EXISTS "Admins can delete holidays" ON public.holidays;
DROP POLICY IF EXISTS "Admins can insert holidays" ON public.holidays;
DROP POLICY IF EXISTS "Admins can update holidays" ON public.holidays;
DROP POLICY IF EXISTS "Anyone can read holidays" ON public.holidays;

-- Drop tables
DROP TABLE IF EXISTS public.pricing_options CASCADE;
DROP TABLE IF EXISTS public.reservations CASCADE;
DROP TABLE IF EXISTS public.holidays CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Drop enum
DROP TYPE IF EXISTS public.app_role;
