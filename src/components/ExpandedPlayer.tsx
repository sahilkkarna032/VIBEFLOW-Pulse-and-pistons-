import { ChevronDown, Play, Pause, SkipForward, SkipBack, Heart, Repeat, Repeat1, Shuffle, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/contexts/FocusContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { addLikedTrack, removeLikedTrack, isTrackLiked } from '@/db/api';
import { toast } from 'sonner';
import { ProgressBar } from './player/ProgressBar';
import { VolumeControl } from './player/VolumeControl';
import { QueueDrawer } from './player/QueueDrawer';
import { AddToPlaylistDialog } from './player/AddToPlaylistDialog';
import { cn } from '@/lib/utils';
import type { RepeatMode } from '@/types';

interface ExpandedPlayerProps {
  onClose: () => void;
}

export function ExpandedPlayer({ onClose }: ExpandedPlayerProps) {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    playNext,
    playPrevious,
    shuffle,
    setShuffle,
    repeatMode,
    setRepeatMode,
    addToQueue,
  } = usePlayer();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTrack && user) {
      isTrackLiked(user.id, currentTrack.id).then(setLiked);
    }
  }, [currentTrack, user]);

  const handleLike = async () => {
    if (!currentTrack || !user) return;

    setLoading(true);
    try {
      if (liked) {
        await removeLikedTrack(user.id, currentTrack.id);
        setLiked(false);
        toast.success('Removed from liked songs');
      } else {
        await addLikedTrack(user.id, currentTrack.id);
        setLiked(true);
        toast.success('Added to liked songs');
      }
    } catch (error) {
      toast.error('Failed to update liked songs');
    } finally {
      setLoading(false);
    }
  };

  const handleRepeatToggle = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const handleAddToQueue = () => {
    if (currentTrack) {
      addToQueue(currentTrack);
      toast.success('Added to queue');
    }
  };

  if (!currentTrack) return null;

  const bpm = currentTrack.bpm;
  const animationSpeed = Math.max(0.3, 1 - (bpm - 60) / 200);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronDown className="w-6 h-6" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">Now Playing</span>
        <div className="flex items-center gap-2">
          <QueueDrawer />
          <Button variant="ghost" size="icon" className="w-9 h-9" onClick={handleAddToQueue}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full max-w-md aspect-square">
          <img
            src={currentTrack.cover_url}
            alt={currentTrack.title}
            className="w-full h-full rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </div>

      {/* Waveform Visualizer */}
      <div className="flex items-center justify-center gap-1 h-20 px-8">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="wave-bar bg-primary w-1 rounded-full"
            style={{
              height: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${animationSpeed}s`,
              opacity: isPlaying ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Track Info */}
      <div className="px-8 py-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold mb-1 truncate">{currentTrack.title}</h2>
            <p className="text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 shrink-0"
            onClick={handleLike}
            disabled={loading}
          >
            <Heart
              className={cn('w-6 h-6', liked && 'fill-primary text-primary')}
            />
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {currentTrack.genre}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {currentTrack.bpm} BPM
          </span>
          {currentTrack.is_instrumental && (
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              Instrumental
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-8 pb-4">
        <ProgressBar />
      </div>

      {/* Controls */}
      <div className="px-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className={cn('w-9 h-9', shuffle && 'text-primary')}
              onClick={() => setShuffle(!shuffle)}
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <AddToPlaylistDialog trackId={currentTrack.id} trigger={
              <Button variant="ghost" size="icon" className="w-9 h-9" asChild>
                <div>
                  <MoreVertical className="w-4 h-4" />
                </div>
              </Button>
            } />
          </div>
          <div className="flex items-center gap-2">
            <VolumeControl />
            <Button
              size="icon"
              variant="ghost"
              className={cn('w-9 h-9', repeatMode !== 'off' && 'text-primary')}
              onClick={handleRepeatToggle}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button size="icon" variant="ghost" className="w-14 h-14" onClick={playPrevious}>
            <SkipBack className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            className="neumorphic w-20 h-20 rounded-full bg-primary hover:bg-primary/90"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>
          <Button size="icon" variant="ghost" className="w-14 h-14" onClick={playNext}>
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
