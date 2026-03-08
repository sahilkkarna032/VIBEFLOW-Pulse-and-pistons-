import { Play, Heart, MoreVertical, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Track } from '@/types';
import { usePlayer } from '@/contexts/FocusContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { addLikedTrack, removeLikedTrack, isTrackLiked } from '@/db/api';
import { toast } from 'sonner';
import { AddToPlaylistDialog } from './player/AddToPlaylistDialog';
import { cn } from '@/lib/utils';

interface TrackCardProps {
  track: Track;
  playlist?: Track[];
}

export function TrackCard({ track, playlist }: TrackCardProps) {
  const { playTrack, currentTrack, addToQueue } = usePlayer();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCurrentTrack = currentTrack?.id === track.id;

  useEffect(() => {
    if (user) {
      isTrackLiked(user.id, track.id).then(setLiked);
    }
  }, [track.id, user]);

  const handlePlay = () => {
    playTrack(track, playlist);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to like tracks');
      return;
    }

    setLoading(true);
    try {
      if (liked) {
        await removeLikedTrack(user.id, track.id);
        setLiked(false);
      } else {
        await addLikedTrack(user.id, track.id);
        setLiked(true);
      }
    } catch (error) {
      toast.error('Failed to update liked songs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToQueue = () => {
    addToQueue(track);
    toast.success('Added to queue');
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!track.audio_url) {
      toast.error('Audio file not available for download');
      return;
    }

    try {
      toast.info('Starting download...');
      const response = await fetch(track.audio_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${track.artist} - ${track.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download track');
    }
  };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden cursor-pointer focus-transition hover:border-primary/50',
        isCurrentTrack && 'border-primary'
      )}
      onClick={handlePlay}
    >
      <div className="aspect-square relative">
        <img
          src={track.cover_url}
          alt={track.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 focus-transition flex items-center justify-center">
          <Button
            size="icon"
            className="neumorphic w-14 h-14 rounded-full bg-primary hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
          >
            <Play className="w-6 h-6 ml-0.5" />
          </Button>
        </div>
        {/* Always visible like and menu buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-90 group-hover:opacity-100 focus-transition">
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
            onClick={handleLike}
            disabled={loading}
          >
            <Heart
              className={cn('w-4 h-4', liked ? 'fill-primary text-primary' : 'text-white')}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                handleAddToQueue();
              }}>
                Add to Queue
              </DropdownMenuItem>
              <AddToPlaylistDialog
                trackId={track.id}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Add to Playlist
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{track.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {track.bpm} BPM
          </span>
          {track.is_instrumental && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              🎵
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
