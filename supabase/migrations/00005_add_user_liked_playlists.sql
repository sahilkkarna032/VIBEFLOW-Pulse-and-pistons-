-- Create user_liked_playlists table
CREATE TABLE IF NOT EXISTS public.user_liked_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, playlist_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_liked_playlists_user_id ON public.user_liked_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_liked_playlists_playlist_id ON public.user_liked_playlists(playlist_id);

-- Enable RLS
ALTER TABLE public.user_liked_playlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own liked playlists"
  ON public.user_liked_playlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own liked playlists"
  ON public.user_liked_playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own liked playlists"
  ON public.user_liked_playlists FOR DELETE
  USING (auth.uid() = user_id);