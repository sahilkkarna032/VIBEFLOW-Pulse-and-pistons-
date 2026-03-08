import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { getFocusHistory } from '@/db/api';
import { Activity, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { FocusHistory } from '@/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export default function FocusLabPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<FocusHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getFocusHistory(user.id, 7).then((data) => {
        setHistory(data);
        setLoading(false);
      });
    }
  }, [user]);

  const chartData = history.map((entry) => ({
    date: new Date(entry.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: entry.focus_score,
    duration: entry.duration_minutes,
  }));

  const avgScore = history.length > 0
    ? Math.round(history.reduce((sum, entry) => sum + entry.focus_score, 0) / history.length)
    : 0;

  const totalMinutes = history.reduce((sum, entry) => sum + entry.duration_minutes, 0);

  const chartConfig = {
    score: {
      label: 'Focus Score',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div className="pb-32 pt-6 px-4 max-w-screen-xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold gradient-text">Focus Lab</h1>
        <p className="text-muted-foreground">Track your focus patterns and productivity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 glass">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-3xl font-bold">{avgScore}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Focus Time</p>
              <p className="text-3xl font-bold">{totalMinutes}m</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-3xl font-bold">{history.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Focus Score Chart */}
      <Card className="p-6 glass">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Focus Score Over Time</h2>
            <p className="text-sm text-muted-foreground">Your focus levels over the last 7 days</p>
          </div>

          {loading ? (
            <Skeleton className="h-80 w-full bg-muted" />
          ) : chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#fillScore)"
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No focus data yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start using the app to track your focus patterns
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Focus Zones Breakdown */}
      <Card className="p-6 glass">
        <h2 className="text-2xl font-bold mb-4">Focus Zones</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-semibold">Deep Work (81-100)</p>
                <p className="text-sm text-muted-foreground">Maximum concentration</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-pink-400">
                {history.filter((h) => h.focus_score >= 81).length}
              </p>
              <p className="text-xs text-muted-foreground">sessions</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌊</span>
              <div>
                <p className="font-semibold">Flow State (41-80)</p>
                <p className="text-sm text-muted-foreground">Balanced focus</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">
                {history.filter((h) => h.focus_score >= 41 && h.focus_score <= 80).length}
              </p>
              <p className="text-xs text-muted-foreground">sessions</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌙</span>
              <div>
                <p className="font-semibold">Relaxation (0-40)</p>
                <p className="text-sm text-muted-foreground">Calm & peaceful</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400">
                {history.filter((h) => h.focus_score <= 40).length}
              </p>
              <p className="text-xs text-muted-foreground">sessions</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
