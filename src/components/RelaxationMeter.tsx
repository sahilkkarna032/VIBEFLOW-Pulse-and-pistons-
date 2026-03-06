import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Waves } from 'lucide-react';

interface RelaxationMeterProps {
  value: number;
  onChange: (value: number) => void;
}

export function RelaxationMeter({ value, onChange }: RelaxationMeterProps) {
  const getRelaxationLevel = (score: number) => {
    if (score <= 30) return { label: 'Deep Relaxation', color: 'text-blue-400', description: 'Meditation & Sleep' };
    if (score <= 60) return { label: 'Moderate Relaxation', color: 'text-purple-400', description: 'Calm & Peaceful' };
    return { label: 'Light Relaxation', color: 'text-pink-400', description: 'Gentle Energy' };
  };

  const level = getRelaxationLevel(value);

  return (
    <Card className="p-6 glass border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className={`w-5 h-5 ${level.color}`} />
            <div>
              <h3 className="font-semibold">Relaxation Level</h3>
              <p className="text-xs text-muted-foreground">{level.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${level.color}`}>{value}</p>
            <p className="text-xs text-muted-foreground">0-100</p>
          </div>
        </div>

        <div className="space-y-2">
          <Slider
            value={[value]}
            onValueChange={(values) => onChange(values[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Deep</span>
            <span className={level.color}>{level.label}</span>
            <span>Light</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded bg-blue-500/10">
            <p className="font-semibold text-blue-400">0-30</p>
            <p className="text-muted-foreground">Deep</p>
          </div>
          <div className="text-center p-2 rounded bg-purple-500/10">
            <p className="font-semibold text-purple-400">31-60</p>
            <p className="text-muted-foreground">Moderate</p>
          </div>
          <div className="text-center p-2 rounded bg-pink-500/10">
            <p className="font-semibold text-pink-400">61-100</p>
            <p className="text-muted-foreground">Light</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
