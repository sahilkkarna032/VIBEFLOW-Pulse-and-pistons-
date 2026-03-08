import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { usePlayer } from '@/contexts/FocusContext';
import type { FocusMode } from '@/types';

const focusZones = [
  {
    mode: 'relaxation' as FocusMode,
    label: 'Relaxation',
    range: [0, 40] as [number, number],
    description: 'Calm & peaceful',
    color: 'text-blue-400',
  },
  {
    mode: 'flow-state' as FocusMode,
    label: 'Flow State',
    range: [41, 80] as [number, number],
    description: 'Balanced focus',
    color: 'text-purple-400',
  },
  {
    mode: 'deep-work' as FocusMode,
    label: 'Deep Work',
    range: [81, 100] as [number, number],
    description: 'Maximum concentration',
    color: 'text-pink-400',
  },
];

export function FocusSlider() {
  const { focusScore, setFocusScore, focusMode } = usePlayer();

  const currentZone = focusZones.find((zone) => zone.mode === focusMode);

  return (
    <Card className="p-6 glass">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Adaptive Focus Engine</h3>
            <p className="text-sm text-muted-foreground">Adjust your focus level</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold gradient-text">{focusScore}</div>
            <div className={`text-xs font-medium ${currentZone?.color}`}>
              {currentZone?.label}
            </div>
          </div>
        </div>

        <Slider
          value={[focusScore]}
          onValueChange={(value) => setFocusScore(value[0])}
          max={100}
          min={0}
          step={1}
          className="py-4"
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          {focusZones.map((zone) => (
            <div key={zone.mode} className="text-center">
              <div className={`font-medium ${zone.mode === focusMode ? zone.color : ''}`}>
                {zone.label}
              </div>
              <div className="text-xs opacity-70">{zone.range[0]}-{zone.range[1]}</div>
            </div>
          ))}
        </div>

        {currentZone && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-center">{currentZone.description}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
