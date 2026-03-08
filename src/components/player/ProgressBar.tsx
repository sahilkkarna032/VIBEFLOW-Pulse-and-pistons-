import { Slider } from '@/components/ui/slider';
import { usePlayer } from '@/contexts/FocusContext';

export function ProgressBar() {
  const { currentTime, duration, setCurrentTime } = usePlayer();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  return (
    <div className="w-full space-y-1">
      <Slider
        value={[currentTime]}
        onValueChange={handleSeek}
        max={duration || 100}
        step={1}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
