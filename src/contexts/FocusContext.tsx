import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { FocusMode, Track, RepeatMode } from '@/types';
import { getTracksByFilter, addRecentlyPlayed, incrementPlayCount, getTracksByIds } from '@/db/api';
import { useAuth } from './AuthContext';

interface PlayerContextType {
  // Focus
  focusScore: number;
  setFocusScore: (score: number) => void;
  focusMode: FocusMode;
  filteredTracks: Track[];
  isLoading: boolean;
  
  // Playback
  currentTrack: Track | null;
  setCurrentTrack: (track: Track | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  
  // Queue
  queue: Track[];
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  
  // Controls
  shuffle: boolean;
  setShuffle: (shuffle: boolean) => void;
  repeatMode: RepeatMode;
  setRepeatMode: (mode: RepeatMode) => void;
  volume: number;
  setVolume: (volume: number) => void;
  
  // Progress
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  
  // Actions
  playTrack: (track: Track, playlist?: Track[]) => void;
  playAlbum: (tracks: Track[], startIndex?: number) => void;
  playPlaylist: (tracks: Track[], startIndex?: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // Focus state
  const [focusScore, setFocusScore] = useState(50);
  const [focusMode, setFocusMode] = useState<FocusMode>('flow-state');
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Playback state
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Queue state
  const [queue, setQueue] = useState<Track[]>([]);
  const [originalQueue, setOriginalQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Controls state
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [volume, setVolume] = useState(70);
  
  // Progress state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Determine focus mode based on score
  useEffect(() => {
    if (focusScore >= 81) {
      setFocusMode('deep-work');
    } else if (focusScore >= 41) {
      setFocusMode('flow-state');
    } else {
      setFocusMode('relaxation');
    }
  }, [focusScore]);

  // Filter tracks based on focus mode
  useEffect(() => {
    async function filterTracks() {
      setIsLoading(true);
      try {
        let tracks: Track[] = [];
        const instrumentalOnly = user?.focus_preferences?.instrumental_only_deep_work ?? false;

        switch (focusMode) {
          case 'deep-work':
            tracks = await getTracksByFilter(
              121,
              undefined,
              undefined,
              instrumentalOnly ? true : undefined
            );
            break;
          case 'flow-state':
            tracks = await getTracksByFilter(
              90,
              120,
              ['Ambient', 'Lo-Fi', 'Minimal Techno', 'Synthwave']
            );
            break;
          case 'relaxation':
            tracks = await getTracksByFilter(
              undefined,
              89,
              ['Acoustic', 'Jazz', 'Classical', 'Ambient']
            );
            break;
        }

        setFilteredTracks(tracks);
      } catch (error) {
        console.error('Error filtering tracks:', error);
      } finally {
        setIsLoading(false);
      }
    }

    filterTracks();
  }, [focusMode, user?.focus_preferences]);

  // Handle shuffle
  useEffect(() => {
    if (shuffle && queue.length > 0) {
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
    } else if (!shuffle && originalQueue.length > 0) {
      setQueue(originalQueue);
    }
  }, [shuffle]);

  // Track recently played
  useEffect(() => {
    if (currentTrack && user && isPlaying) {
      addRecentlyPlayed(user.id, currentTrack.id).catch(console.error);
      incrementPlayCount(currentTrack.id).catch(console.error);
    }
  }, [currentTrack, user, isPlaying]);

  const playTrack = useCallback((track: Track, playlist?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(track.duration_seconds);
    
    if (playlist && playlist.length > 0) {
      setQueue(playlist);
      setOriginalQueue(playlist);
      const index = playlist.findIndex(t => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, []);

  const playAlbum = useCallback((tracks: Track[], startIndex: number = 0) => {
    if (tracks.length === 0) return;
    setQueue(tracks);
    setOriginalQueue(tracks);
    setCurrentIndex(startIndex);
    setCurrentTrack(tracks[startIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(tracks[startIndex].duration_seconds);
  }, []);

  const playPlaylist = useCallback((tracks: Track[], startIndex: number = 0) => {
    if (tracks.length === 0) return;
    setQueue(tracks);
    setOriginalQueue(tracks);
    setCurrentIndex(startIndex);
    setCurrentTrack(tracks[startIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(tracks[startIndex].duration_seconds);
  }, []);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    if (repeatMode === 'one') {
      setCurrentTime(0);
      return;
    }

    let nextIndex = currentIndex + 1;
    
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setCurrentTime(0);
    setDuration(queue[nextIndex].duration_seconds);
    setIsPlaying(true);
  }, [queue, currentIndex, repeatMode]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;

    if (currentTime > 3) {
      setCurrentTime(0);
      return;
    }

    let prevIndex = currentIndex - 1;
    
    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = queue.length - 1;
      } else {
        prevIndex = 0;
      }
    }

    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setCurrentTime(0);
    setDuration(queue[prevIndex].duration_seconds);
    setIsPlaying(true);
  }, [queue, currentIndex, currentTime, repeatMode]);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
    if (!shuffle) {
      setOriginalQueue(prev => [...prev, track]);
    }
  }, [shuffle]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (!shuffle) {
      setOriginalQueue(prev => prev.filter((_, i) => i !== index));
    }
  }, [shuffle]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setOriginalQueue([]);
    setCurrentIndex(0);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        focusScore,
        setFocusScore,
        focusMode,
        filteredTracks,
        isLoading,
        currentTrack,
        setCurrentTrack,
        isPlaying,
        setIsPlaying,
        queue,
        setQueue,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playNext,
        playPrevious,
        shuffle,
        setShuffle,
        repeatMode,
        setRepeatMode,
        volume,
        setVolume,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        playTrack,
        playAlbum,
        playPlaylist,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
