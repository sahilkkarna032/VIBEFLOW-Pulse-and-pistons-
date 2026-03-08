-- Create RPC functions to update cover URLs

CREATE OR REPLACE FUNCTION update_track_covers(old_url text, new_url text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE tracks
  SET cover_url = new_url
  WHERE cover_url = old_url;
END;
$$;

CREATE OR REPLACE FUNCTION update_playlist_covers(old_url text, new_url text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE playlists
  SET cover_url = new_url
  WHERE cover_url = old_url;
END;
$$;