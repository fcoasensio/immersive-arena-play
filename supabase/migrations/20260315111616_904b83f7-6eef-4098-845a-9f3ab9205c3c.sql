
-- Enums
CREATE TYPE public.tipo_reserva AS ENUM ('cumpleanos', 'grupos', 'despedida');
CREATE TYPE public.actividad AS ENUM ('laser_tag', 'realidad_virtual');
CREATE TYPE public.estado_reserva AS ENUM ('pendiente_pago', 'pago_recibido', 'confirmada', 'cancelada');
CREATE TYPE public.duracion_reserva AS ENUM ('90', '150');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Reservas table
CREATE TABLE public.reservas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tipo_reserva public.tipo_reserva NOT NULL,
  actividad public.actividad NOT NULL,
  estado public.estado_reserva NOT NULL DEFAULT 'pendiente_pago',
  nombre_completo TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  dni_cif TEXT NOT NULL,
  direccion TEXT NOT NULL,
  codigo_postal TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  duracion public.duracion_reserva NOT NULL DEFAULT '90',
  num_participantes INTEGER NOT NULL,
  nombre_menor TEXT,
  edad_menor INTEGER,
  tematica_invitacion TEXT,
  precio_base NUMERIC(8,2),
  precio_final NUMERIC(8,2),
  anticipo NUMERIC(8,2) DEFAULT 50.00,
  notas TEXT
);

ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir insertar reservas públicamente"
  ON public.reservas FOR INSERT WITH CHECK (true);

CREATE POLICY "No lectura pública"
  ON public.reservas FOR SELECT USING (false);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  unique (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
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

CREATE POLICY "Admins can read roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Configuracion table
CREATE TABLE public.configuracion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave TEXT UNIQUE NOT NULL,
  valor JSONB NOT NULL,
  descripcion TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read config" ON public.configuracion FOR SELECT USING (true);

CREATE POLICY "Admins can update config" ON public.configuracion
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert config" ON public.configuracion
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin read/update reservas
CREATE POLICY "Admins can read reservas" ON public.reservas
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reservas" ON public.reservas
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default config
INSERT INTO public.configuracion (clave, valor, descripcion) VALUES
  ('precio_90min', '15', 'Precio por persona para sesión de 90 min'),
  ('precio_150min', '22', 'Precio por persona para sesión de 150 min'),
  ('recargo_finde_festivo', '2', 'Recargo por jugador en fin de semana o festivo'),
  ('min_participantes', '6', 'Mínimo de participantes'),
  ('max_participantes', '20', 'Máximo de participantes'),
  ('max_participantes_laser_tag', '16', 'Máximo participantes Láser Tag'),
  ('max_participantes_realidad_virtual', '12', 'Máximo participantes Realidad Virtual'),
  ('anticipo', '50', 'Anticipo requerido en euros'),
  ('antelacion_horas', '48', 'Horas mínimas de antelación'),
  ('horas_disponibles', '["10:00","11:30","13:00","16:00","17:30","19:00","20:30"]', 'Franjas horarias disponibles');

-- Festivos table
CREATE TABLE public.festivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha date NOT NULL UNIQUE,
  nombre text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.festivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read festivos" ON public.festivos FOR SELECT USING (true);
CREATE POLICY "Admins can insert festivos" ON public.festivos FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update festivos" ON public.festivos FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete festivos" ON public.festivos FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
