export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  focus_preferences: {
    instrumental_only_deep_work: boolean;
  };
  total_focus_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  image_url?: string;
  genres: string[];
  followers_count: number;
  created_at: string;
}

export interface Album {
  id: string;
  title: string;
  artist_id: string;
  cover_url: string;
  release_date?: string;
  total_tracks: number;
  created_at: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artist_id?: string;
  album_id?: string;
  audio_url?: string;
  cover_url: string;
  bpm: number;
  energy_level: number;
  is_instrumental: boolean;
  genre: string;
  duration_seconds: number;
  lyrics?: string;
  play_count: number;
  created_at: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  created_by: string;
  track_ids: string[];
  is_curated: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserLikedTrack {
  id: string;
  user_id: string;
  track_id: string;
  created_at: string;
}

export interface UserLikedPlaylist {
  id: string;
  user_id: string;
  playlist_id: string;
  created_at: string;
}

export interface RecentlyPlayed {
  id: string;
  user_id: string;
  track_id: string;
  played_at: string;
}

export interface FocusHistory {
  id: string;
  user_id: string;
  focus_score: number;
  duration_minutes: number;
  recorded_at: string;
}

export type FocusMode = 'deep-work' | 'flow-state' | 'relaxation';
export type RepeatMode = 'off' | 'all' | 'one';

export interface FocusZone {
  mode: FocusMode;
  label: string;
  range: [number, number];
  description: string;
}
