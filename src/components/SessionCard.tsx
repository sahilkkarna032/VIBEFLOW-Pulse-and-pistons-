import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { usePlayer } from '@/contexts/FocusContext';
import { getTracksByFilter } from '@/db/api';
import { toast } from 'sonner';

interface SessionCardProps {
  title: string;
  subtitle: string;
  gradient: string;
  bpmRange?: [number, number];
  genres?: string[];
}

export function SessionCard({ title, subtitle, gradient, bpmRange, genres }: SessionCardProps) {
  const { playPlaylist } = usePlayer();

  const handleStartSession = async () => {
    try {
      const tracks = await getTracksByFilter(
        bpmRange?.[0],
        bpmRange?.[1],
        genres
      );
      
      if (tracks.length > 0) {
        playPlaylist(tracks);
        toast.success(`Started ${title} session`);
      } else {
        toast.error('No tracks available for this session');
      }
    } catch (error) {
      toast.error('Failed to start session');
    }
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden cursor-pointer group focus-transition hover:scale-105',
        'bg-gradient-to-br',
        gradient
      )}
      onClick={handleStartSession}
    >
      <div className="p-6 h-48 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/70">{subtitle}</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          START SESSION
        </Button>
      </div>
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 focus-transition flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Play className="w-8 h-8 text-white ml-1" />
        </div>
      </div>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
