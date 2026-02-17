
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Centers table
CREATE TABLE public.centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT DEFAULT '',
  total_locals INTEGER NOT NULL DEFAULT 0,
  available_locals INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own centers" ON public.centers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own centers" ON public.centers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own centers" ON public.centers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own centers" ON public.centers FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_centers_updated_at BEFORE UPDATE ON public.centers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Owners table
CREATE TABLE public.owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  locals_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own owners" ON public.owners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own owners" ON public.owners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own owners" ON public.owners FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own owners" ON public.owners FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON public.owners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Locals table
CREATE TABLE public.locals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  size NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented')),
  center_id UUID REFERENCES public.centers(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES public.owners(id) ON DELETE SET NULL,
  monthly_rent NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.locals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own locals" ON public.locals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own locals" ON public.locals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own locals" ON public.locals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own locals" ON public.locals FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_locals_updated_at BEFORE UPDATE ON public.locals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'autre' CHECK (type IN ('boutique', 'restaurant', 'service', 'artisanat', 'autre')),
  description TEXT DEFAULT '',
  local_id UUID REFERENCES public.locals(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activities" ON public.activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON public.activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activities" ON public.activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own activities" ON public.activities FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
