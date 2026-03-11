
DROP POLICY "Anyone can read active pricing" ON public.pricing_options;
CREATE POLICY "Anyone can read active pricing"
  ON public.pricing_options
  FOR SELECT
  TO public
  USING (is_active = true);
