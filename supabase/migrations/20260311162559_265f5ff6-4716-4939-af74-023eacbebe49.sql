
-- Admin role system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TEXT NOT NULL,
  number_of_people INTEGER NOT NULL DEFAULT 2,
  activity_type TEXT NOT NULL DEFAULT 'both',
  event_type TEXT NOT NULL DEFAULT 'casual',
  extras TEXT[] DEFAULT '{}',
  video_invitation_theme TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Holidays / blocked dates
CREATE TABLE public.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- Pricing options
CREATE TABLE public.pricing_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_options ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- user_roles: only admins can read
CREATE POLICY "Admins can read user_roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- reservations: public insert (guests), admin full access
CREATE POLICY "Anyone can insert reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read reservations" ON public.reservations
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reservations" ON public.reservations
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reservations" ON public.reservations
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- holidays: public read (for calendar), admin write
CREATE POLICY "Anyone can read holidays" ON public.holidays
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert holidays" ON public.holidays
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update holidays" ON public.holidays
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete holidays" ON public.holidays
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- pricing_options: public read, admin write
CREATE POLICY "Anyone can read active pricing" ON public.pricing_options
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert pricing" ON public.pricing_options
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pricing" ON public.pricing_options
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pricing" ON public.pricing_options
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_updated_at
  BEFORE UPDATE ON public.pricing_options
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
