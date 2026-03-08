import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Waves } from 'lucide-react';

interface RelaxationMeterProps {
  value: number;
  onChange: (value: number) => void;
}

export function RelaxationMeter({ value, onChange }: RelaxationMeterProps) {
  const getRelaxationLevel = (score: number) => {
    if (score <= 20) return { 
      label: 'Deep Sleep', 
      color: 'text-indigo-400', 
      description: 'Meditation & Deep Rest',
      bgColor: 'bg-indigo-500/10'
    };
    if (score <= 40) return { 
      label: 'Deep Relaxation', 
      color: 'text-blue-400', 
      description: 'Calm & Soothing',
      bgColor: 'bg-blue-500/10'
    };
    if (score <= 60) return { 
      label: 'Moderate Relaxation', 
      color: 'text-cyan-400', 
      description: 'Balanced & Peaceful',
      bgColor: 'bg-cyan-500/10'
    };
    if (score <= 75) return { 
      label: 'Light Relaxation', 
      color: 'text-teal-400', 
      description: 'Gentle Energy',
      bgColor: 'bg-teal-500/10'
    };
    if (score <= 90) return { 
      label: 'Active Relaxation', 
      color: 'text-green-400', 
      description: 'Uplifting & Positive',
      bgColor: 'bg-green-500/10'
    };
    return { 
      label: 'Energized', 
      color: 'text-lime-400', 
      description: 'Vibrant & Refreshed',
      bgColor: 'bg-lime-500/10'
    };
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
            <span>Deep Sleep</span>
            <span className={level.color}>{level.label}</span>
            <span>Energized</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded bg-indigo-500/10">
            <p className="font-semibold text-indigo-400">0-20</p>
            <p className="text-muted-foreground">Deep Sleep</p>
          </div>
          <div className="text-center p-2 rounded bg-blue-500/10">
            <p className="font-semibold text-blue-400">21-40</p>
            <p className="text-muted-foreground">Deep</p>
          </div>
          <div className="text-center p-2 rounded bg-cyan-500/10">
            <p className="font-semibold text-cyan-400">41-60</p>
            <p className="text-muted-foreground">Moderate</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded bg-teal-500/10">
            <p className="font-semibold text-teal-400">61-75</p>
            <p className="text-muted-foreground">Light</p>
          </div>
          <div className="text-center p-2 rounded bg-green-500/10">
            <p className="font-semibold text-green-400">76-90</p>
            <p className="text-muted-foreground">Active</p>
          </div>
          <div className="text-center p-2 rounded bg-lime-500/10">
            <p className="font-semibold text-lime-400">91-100</p>
            <p className="text-muted-foreground">Energized</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
