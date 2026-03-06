import { supabase } from './supabase';
import type { Track, Playlist, User, UserLikedTrack, UserLikedPlaylist, FocusHistory, Artist, Album, RecentlyPlayed } from '@/types';

// Tracks
export async function getAllTracks(): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getTracksByFilter(
  bpmMin?: number,
  bpmMax?: number,
  genres?: string[],
  isInstrumental?: boolean
): Promise<Track[]> {
  let query = supabase.from('tracks').select('*');

  if (bpmMin !== undefined) {
    query = query.gte('bpm', bpmMin);
  }
  if (bpmMax !== undefined) {
    query = query.lte('bpm', bpmMax);
  }
  if (genres && genres.length > 0) {
    query = query.in('genre', genres);
  }
  if (isInstrumental !== undefined) {
    query = query.eq('is_instrumental', isInstrumental);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getTrackById(id: string): Promise<Track | null> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getTracksByIds(ids: string[]): Promise<Track[]> {
  if (ids.length === 0) return [];
  
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .in('id', ids);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function incrementPlayCount(trackId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_play_count', { track_id: trackId });
  if (error) console.error('Error incrementing play count:', error);
}

// User Profile
export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Liked Tracks
export async function getLikedTracks(userId: string): Promise<Track[]> {
  const { data, error } = await supabase
    .from('user_liked_tracks')
    .select('track_id, tracks!inner(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data.map((item: any) => item.tracks) : [];
}

export async function addLikedTrack(userId: string, trackId: string): Promise<void> {
  const { error } = await supabase
    .from('user_liked_tracks')
    .insert({ user_id: userId, track_id: trackId });

  if (error) throw error;
}

export async function removeLikedTrack(userId: string, trackId: string): Promise<void> {
  const { error } = await supabase
    .from('user_liked_tracks')
    .delete()
    .eq('user_id', userId)
    .eq('track_id', trackId);

  if (error) throw error;
}

export async function isTrackLiked(userId: string, trackId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_liked_tracks')
    .select('id')
    .eq('user_id', userId)
    .eq('track_id', trackId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

// Playlists
export async function getCuratedPlaylists(): Promise<Playlist[]> {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('is_curated', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getUserPlaylists(userId: string): Promise<Playlist[]> {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getPlaylistById(id: string): Promise<Playlist | null> {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createPlaylist(
  userId: string,
  title: string,
  description?: string,
  trackIds: string[] = []
): Promise<Playlist | null> {
  const { data, error } = await supabase
    .from('playlists')
    .insert({
      title,
      description: description || null,
      created_by: userId,
      track_ids: trackIds,
      is_curated: false,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updatePlaylist(
  playlistId: string,
  updates: Partial<Playlist>
): Promise<Playlist | null> {
  const { data, error } = await supabase
    .from('playlists')
    .update(updates)
    .eq('id', playlistId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deletePlaylist(playlistId: string): Promise<void> {
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', playlistId);

  if (error) throw error;
}

export async function addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
  const playlist = await getPlaylistById(playlistId);
  if (!playlist) throw new Error('Playlist not found');

  const updatedTrackIds = [...playlist.track_ids, trackId];
  await updatePlaylist(playlistId, { track_ids: updatedTrackIds });
}

export async function removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<void> {
  const playlist = await getPlaylistById(playlistId);
  if (!playlist) throw new Error('Playlist not found');

  const updatedTrackIds = playlist.track_ids.filter(id => id !== trackId);
  await updatePlaylist(playlistId, { track_ids: updatedTrackIds });
}

// User Liked Playlists
export async function addLikedPlaylist(userId: string, playlistId: string): Promise<void> {
  const { error } = await supabase
    .from('user_liked_playlists')
    .insert({ user_id: userId, playlist_id: playlistId });

  if (error) throw error;
}

export async function removeLikedPlaylist(userId: string, playlistId: string): Promise<void> {
  const { error } = await supabase
    .from('user_liked_playlists')
    .delete()
    .eq('user_id', userId)
    .eq('playlist_id', playlistId);

  if (error) throw error;
}

export async function isPlaylistLiked(userId: string, playlistId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_liked_playlists')
    .select('id')
    .eq('user_id', userId)
    .eq('playlist_id', playlistId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}

export async function getLikedPlaylists(userId: string): Promise<Playlist[]> {
  const { data: likedData, error: likedError } = await supabase
    .from('user_liked_playlists')
    .select('playlist_id')
    .eq('user_id', userId);

  if (likedError || !likedData) return [];

  const playlistIds = likedData.map(item => item.playlist_id);
  if (playlistIds.length === 0) return [];

  const { data: playlists, error: playlistsError } = await supabase
    .from('playlists')
    .select('*')
    .in('id', playlistIds);

  if (playlistsError) return [];
  return Array.isArray(playlists) ? playlists : [];
}

// Focus History
export async function addFocusHistory(
  userId: string,
  focusScore: number,
  durationMinutes: number
): Promise<void> {
  const { error } = await supabase
    .from('user_focus_history')
    .insert({
      user_id: userId,
      focus_score: focusScore,
      duration_minutes: durationMinutes,
    });

  if (error) throw error;
}

export async function getFocusHistory(
  userId: string,
  days: number = 7
): Promise<FocusHistory[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('user_focus_history')
    .select('*')
    .eq('user_id', userId)
    .gte('recorded_at', startDate.toISOString())
    .order('recorded_at', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Recently Played
export async function addRecentlyPlayed(userId: string, trackId: string): Promise<void> {
  const { error } = await supabase
    .from('user_recently_played')
    .insert({ user_id: userId, track_id: trackId });

  if (error) throw error;
}

export async function getRecentlyPlayed(userId: string, limit: number = 20): Promise<Track[]> {
  const { data, error } = await supabase
    .from('user_recently_played')
    .select('track_id, tracks!inner(*)')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return Array.isArray(data) ? data.map((item: any) => item.tracks) : [];
}

// Artists
export async function getAllArtists(): Promise<Artist[]> {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getArtistById(id: string): Promise<Artist | null> {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getArtistTracks(artistId: string): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('artist_id', artistId)
    .order('play_count', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getArtistAlbums(artistId: string): Promise<Album[]> {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('artist_id', artistId)
    .order('release_date', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Albums
export async function getAllAlbums(): Promise<Album[]> {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('release_date', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAlbumById(id: string): Promise<Album | null> {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAlbumTracks(albumId: string): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Search tracks
export async function searchTracks(query: string): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .or(`title.ilike.%${query}%,artist.ilike.%${query}%,genre.ilike.%${query}%`)
    .order('play_count', { ascending: false })
    .limit(20);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function searchArtists(query: string): Promise<Artist[]> {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(10);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function searchAlbums(query: string): Promise<Album[]> {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .ilike('title', `%${query}%`)
    .limit(10);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}
