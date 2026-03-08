import { Card } from '@/components/ui/card';

interface GenreCardProps {
  genre: string;
  icon: string;
  trackCount?: number;
  onClick?: () => void;
}

export function GenreCard({ genre, icon, trackCount, onClick }: GenreCardProps) {
  return (
    <Card
      className="group relative overflow-hidden cursor-pointer focus-transition hover:border-primary/50 aspect-square"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 focus-transition" />
      <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="font-bold text-sm">{genre}</h3>
        {trackCount !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">{trackCount} tracks</p>
        )}
      </div>
    </Card>
  );
}
