import { ListMusic, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlayer } from '@/contexts/FocusContext';
import { cn } from '@/lib/utils';

export function QueueDrawer() {
  const { queue, currentTrack, removeFromQueue, clearQueue, playTrack } = usePlayer();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9">
          <ListMusic className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Queue ({queue.length})</span>
            {queue.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearQueue}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ListMusic className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No tracks in queue</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add tracks to start building your queue
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  className={cn(
                    'group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer',
                    currentTrack?.id === track.id && 'bg-primary/10 border border-primary/20'
                  )}
                  onClick={() => playTrack(track, queue)}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  <img
                    src={track.cover_url}
                    alt={track.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      currentTrack?.id === track.id && 'text-primary'
                    )}>
                      {track.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(index);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
