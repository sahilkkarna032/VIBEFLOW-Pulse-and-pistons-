-- Create artists table
CREATE TABLE public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  genres TEXT[],
  followers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create albums table
CREATE TABLE public.albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  cover_url TEXT NOT NULL,
  release_date DATE,
  total_tracks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add artist_id and album_id to tracks
ALTER TABLE public.tracks 
  ADD COLUMN artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
  ADD COLUMN album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL,
  ADD COLUMN duration_seconds INTEGER DEFAULT 180,
  ADD COLUMN lyrics TEXT,
  ADD COLUMN play_count INTEGER DEFAULT 0;

-- Create user_recently_played table
CREATE TABLE public.user_recently_played (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_followed_artists table
CREATE TABLE public.user_followed_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, artist_id)
);

-- Update playlists table
ALTER TABLE public.playlists
  ADD COLUMN description TEXT,
  ADD COLUMN cover_url TEXT,
  ADD COLUMN is_public BOOLEAN DEFAULT true;

-- Artists policies
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view artists" ON artists
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage artists" ON artists
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Albums policies
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view albums" ON albums
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage albums" ON albums
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Recently played policies
ALTER TABLE public.user_recently_played ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recently played" ON user_recently_played
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can add recently played" ON user_recently_played
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Followed artists policies
ALTER TABLE public.user_followed_artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own followed artists" ON user_followed_artists
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can follow artists" ON user_followed_artists
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow artists" ON user_followed_artists
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Insert sample artists
INSERT INTO public.artists (name, bio, image_url, genres) VALUES
  ('Neural Beats', 'Electronic music producer specializing in focus-enhancing soundscapes', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e821803a-a7b9-494e-abe3-17cd4017f055.jpg', ARRAY['Electronic', 'Techno']),
  ('Binary Symphony', 'Experimental techno artist pushing boundaries', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7a188e27-39bb-4a74-918e-90bf4e8c33ef.jpg', ARRAY['Techno', 'Minimal Techno']),
  ('Lo-Fi Collective', 'Chill beats for study and relaxation', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_81969d48-b4c9-44f3-9aa3-90fd49bb1c7c.jpg', ARRAY['Lo-Fi', 'Ambient']),
  ('Smooth Trio', 'Contemporary jazz ensemble', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_445a6a67-019d-4948-8c1e-f1a40a03b7a1.jpg', ARRAY['Jazz', 'Acoustic']),
  ('Retro Future', 'Synthwave and retrowave productions', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7e8c3483-8ce8-4ffb-afeb-fc0b94132dd6.jpg', ARRAY['Synthwave']);

-- Insert sample albums
INSERT INTO public.albums (title, artist_id, cover_url, release_date, total_tracks) VALUES
  ('Deep Focus Sessions', (SELECT id FROM artists WHERE name = 'Neural Beats'), 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e821803a-a7b9-494e-abe3-17cd4017f055.jpg', '2025-01-15', 3),
  ('Minimal Waves', (SELECT id FROM artists WHERE name = 'Binary Symphony'), 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7a188e27-39bb-4a74-918e-90bf4e8c33ef.jpg', '2025-02-20', 2),
  ('Chill Vibes Vol. 1', (SELECT id FROM artists WHERE name = 'Lo-Fi Collective'), 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_81969d48-b4c9-44f3-9aa3-90fd49bb1c7c.jpg', '2024-11-10', 3),
  ('Jazz Nights', (SELECT id FROM artists WHERE name = 'Smooth Trio'), 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_445a6a67-019d-4948-8c1e-f1a40a03b7a1.jpg', '2024-12-05', 2),
  ('Neon Dreams', (SELECT id FROM artists WHERE name = 'Retro Future'), 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7e8c3483-8ce8-4ffb-afeb-fc0b94132dd6.jpg', '2025-03-01', 2);

-- Update existing tracks with artist and album references
UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Neural Beats'),
  album_id = (SELECT id FROM albums WHERE title = 'Deep Focus Sessions'),
  duration_seconds = 240
WHERE title = 'Deep Focus Flow';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Binary Symphony'),
  album_id = (SELECT id FROM albums WHERE title = 'Deep Focus Sessions'),
  duration_seconds = 210
WHERE title = 'Midnight Code';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Binary Symphony'),
  album_id = (SELECT id FROM albums WHERE title = 'Minimal Waves'),
  duration_seconds = 195
WHERE title = 'Algorithm Dreams';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Lo-Fi Collective'),
  album_id = (SELECT id FROM albums WHERE title = 'Chill Vibes Vol. 1'),
  duration_seconds = 180
WHERE title = 'Chill Waves';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Lo-Fi Collective'),
  album_id = (SELECT id FROM albums WHERE title = 'Chill Vibes Vol. 1'),
  duration_seconds = 220
WHERE title = 'Ambient Thoughts';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Lo-Fi Collective'),
  album_id = (SELECT id FROM albums WHERE title = 'Chill Vibes Vol. 1'),
  duration_seconds = 200
WHERE title = 'Flow State';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Smooth Trio'),
  album_id = (SELECT id FROM albums WHERE title = 'Jazz Nights'),
  duration_seconds = 270
WHERE title = 'Sunset Jazz';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Smooth Trio'),
  album_id = (SELECT id FROM albums WHERE title = 'Jazz Nights'),
  duration_seconds = 250
WHERE title = 'Acoustic Dreams';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Smooth Trio'),
  album_id = (SELECT id FROM albums WHERE title = 'Jazz Nights'),
  duration_seconds = 300
WHERE title = 'Piano Reflections';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Retro Future'),
  album_id = (SELECT id FROM albums WHERE title = 'Neon Dreams'),
  duration_seconds = 230
WHERE title = 'Synthwave Nights';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Retro Future'),
  album_id = (SELECT id FROM albums WHERE title = 'Neon Dreams'),
  duration_seconds = 215
WHERE title = 'Neon Drive';

UPDATE public.tracks SET 
  artist_id = (SELECT id FROM artists WHERE name = 'Lo-Fi Collective'),
  album_id = (SELECT id FROM albums WHERE title = 'Chill Vibes Vol. 1'),
  duration_seconds = 360
WHERE title = 'Morning Meditation';

-- Update artist field to reference artist name
UPDATE public.tracks t SET artist = a.name
FROM public.artists a
WHERE t.artist_id = a.id;
