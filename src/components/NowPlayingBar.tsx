import { Play, Pause, SkipForward, SkipBack, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/contexts/FocusContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ExpandedPlayer } from './ExpandedPlayer';
import { ProgressBar } from './player/ProgressBar';

export function NowPlayingBar() {
  const { currentTrack, isPlaying, setIsPlaying, playNext, playPrevious } = usePlayer();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) return null;

  if (isExpanded) {
    return <ExpandedPlayer onClose={() => setIsExpanded(false)} />;
  }

  return (
    <div className="fixed bottom-0 left-64 right-0 z-30 glass border-t border-border">
      <div className="max-w-screen-2xl mx-auto">
        <div className="px-6 pt-2 pb-1">
          <ProgressBar />
        </div>
        <div
          className="flex items-center gap-4 px-6 pb-3 cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <img
            src={currentTrack.cover_url}
            alt={currentTrack.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="w-9 h-9"
              onClick={(e) => {
                e.stopPropagation();
                playPrevious();
              }}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="neumorphic w-11 h-11 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="w-9 h-9"
              onClick={(e) => {
                e.stopPropagation();
                playNext();
              }}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
