-- Create user_role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  focus_preferences JSONB DEFAULT '{"instrumental_only_deep_work": false}'::jsonb,
  total_focus_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tracks table
CREATE TABLE public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  audio_url TEXT,
  cover_url TEXT NOT NULL,
  bpm INTEGER NOT NULL,
  energy_level INTEGER NOT NULL CHECK (energy_level >= 0 AND energy_level <= 100),
  is_instrumental BOOLEAN NOT NULL DEFAULT false,
  genre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_ids UUID[] DEFAULT ARRAY[]::UUID[],
  is_curated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_liked_tracks table
CREATE TABLE public.user_liked_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Create user_focus_history table for stats
CREATE TABLE public.user_focus_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  focus_score INTEGER NOT NULL CHECK (focus_score >= 0 AND focus_score <= 100),
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for album covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-a2nh4x72mkn5_album_covers', 'app-a2nh4x72mkn5_album_covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for album covers
CREATE POLICY "Public read access for album covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-a2nh4x72mkn5_album_covers');

CREATE POLICY "Authenticated users can upload album covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'app-a2nh4x72mkn5_album_covers');

-- Auth trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Auth trigger
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Helper function for admin check
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Public profiles view
CREATE VIEW public_profiles AS
  SELECT id, username, role FROM profiles;

-- Tracks policies (public read)
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tracks" ON tracks
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tracks" ON tracks
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Playlists policies
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view playlists" ON playlists
  FOR SELECT USING (true);

CREATE POLICY "Users can create playlists" ON playlists
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own playlists" ON playlists
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own playlists" ON playlists
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all playlists" ON playlists
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- User liked tracks policies
ALTER TABLE public.user_liked_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own liked tracks" ON user_liked_tracks
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can add liked tracks" ON user_liked_tracks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove liked tracks" ON user_liked_tracks
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User focus history policies
ALTER TABLE public.user_focus_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own focus history" ON user_focus_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can add focus history" ON user_focus_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Insert sample tracks
INSERT INTO public.tracks (title, artist, cover_url, bpm, energy_level, is_instrumental, genre) VALUES
  ('Deep Focus Flow', 'Neural Beats', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e821803a-a7b9-494e-abe3-17cd4017f055.jpg', 128, 85, true, 'Electronic'),
  ('Midnight Code', 'Binary Symphony', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e821803a-a7b9-494e-abe3-17cd4017f055.jpg', 135, 90, true, 'Techno'),
  ('Algorithm Dreams', 'Data Pulse', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7a188e27-39bb-4a74-918e-90bf4e8c33ef.jpg', 140, 88, true, 'Minimal Techno'),
  ('Chill Waves', 'Lo-Fi Collective', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_81969d48-b4c9-44f3-9aa3-90fd49bb1c7c.jpg', 95, 60, false, 'Lo-Fi'),
  ('Ambient Thoughts', 'Soundscape Artists', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_81969d48-b4c9-44f3-9aa3-90fd49bb1c7c.jpg', 100, 55, true, 'Ambient'),
  ('Flow State', 'Productivity Beats', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_81969d48-b4c9-44f3-9aa3-90fd49bb1c7c.jpg', 110, 65, true, 'Lo-Fi'),
  ('Sunset Jazz', 'Smooth Trio', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_445a6a67-019d-4948-8c1e-f1a40a03b7a1.jpg', 75, 40, false, 'Jazz'),
  ('Acoustic Dreams', 'String Theory', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_445a6a67-019d-4948-8c1e-f1a40a03b7a1.jpg', 80, 35, false, 'Acoustic'),
  ('Piano Reflections', 'Classical Minds', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_8a7930b0-b2e3-4e0d-9148-232a5179c697.jpg', 65, 30, true, 'Classical'),
  ('Synthwave Nights', 'Retro Future', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7e8c3483-8ce8-4ffb-afeb-fc0b94132dd6.jpg', 115, 70, true, 'Synthwave'),
  ('Neon Drive', 'Cyber Pulse', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7e8c3483-8ce8-4ffb-afeb-fc0b94132dd6.jpg', 120, 75, true, 'Synthwave'),
  ('Morning Meditation', 'Zen Masters', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_445a6a67-019d-4948-8c1e-f1a40a03b7a1.jpg', 60, 25, true, 'Ambient');
