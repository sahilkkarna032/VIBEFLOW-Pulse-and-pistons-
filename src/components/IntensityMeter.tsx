import { Card } from '@/components/ui/card';
import { usePlayer } from '@/contexts/FocusContext';
import { Sparkles } from 'lucide-react';

export function IntensityMeter() {
  const { focusScore, focusMode } = usePlayer();

  const modeLabels = {
    'deep-work': 'Deep Work',
    'flow-state': 'Steady Productivity',
    'relaxation': 'Relaxation',
  };

  const modeSubtitles = {
    'deep-work': 'MAXIMUM FOCUS',
    'flow-state': 'STEADY PROGRESSION',
    'relaxation': 'CALM & PEACEFUL',
  };

  return (
    <Card className="p-6 glass border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>INTENSITY</span>
        </div>
        
        <div className="relative">
          <div className="text-7xl font-bold gradient-text">
            {focusScore}%
          </div>
          <div className="absolute -right-2 -top-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold">{modeLabels[focusMode]}</h3>
          <p className="text-xs font-semibold text-primary tracking-wider">
            {modeSubtitles[focusMode]}
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          <div className="h-1 w-16 rounded-full bg-primary"></div>
          <div className="h-1 w-16 rounded-full bg-primary/50"></div>
        </div>
      </div>
    </Card>
  );
}
