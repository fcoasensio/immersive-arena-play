
-- Fix reservations policies: change from RESTRICTIVE to PERMISSIVE
DROP POLICY "Admins can read reservations" ON public.reservations;
CREATE POLICY "Admins can read reservations" ON public.reservations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can update reservations" ON public.reservations;
CREATE POLICY "Admins can update reservations" ON public.reservations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can delete reservations" ON public.reservations;
CREATE POLICY "Admins can delete reservations" ON public.reservations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix user_roles policies: change from RESTRICTIVE to PERMISSIVE
DROP POLICY "Admins can read user_roles" ON public.user_roles;
CREATE POLICY "Admins can read user_roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix holidays policies: change from RESTRICTIVE to PERMISSIVE
DROP POLICY "Anyone can read holidays" ON public.holidays;
CREATE POLICY "Anyone can read holidays" ON public.holidays
  FOR SELECT TO public USING (true);

DROP POLICY "Admins can insert holidays" ON public.holidays;
CREATE POLICY "Admins can insert holidays" ON public.holidays
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can update holidays" ON public.holidays;
CREATE POLICY "Admins can update holidays" ON public.holidays
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can delete holidays" ON public.holidays;
CREATE POLICY "Admins can delete holidays" ON public.holidays
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix pricing_options policies: change from RESTRICTIVE to PERMISSIVE
DROP POLICY "Anyone can read active pricing" ON public.pricing_options;
CREATE POLICY "Anyone can read active pricing" ON public.pricing_options
  FOR SELECT TO public USING (is_active = true);

DROP POLICY "Admins can insert pricing" ON public.pricing_options;
CREATE POLICY "Admins can insert pricing" ON public.pricing_options
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can update pricing" ON public.pricing_options;
CREATE POLICY "Admins can update pricing" ON public.pricing_options
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can delete pricing" ON public.pricing_options;
CREATE POLICY "Admins can delete pricing" ON public.pricing_options
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
