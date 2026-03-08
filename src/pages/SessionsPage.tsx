import { useState, useEffect } from 'react';
import { SessionCard } from '@/components/SessionCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SessionsPage() {
  const navigate = useNavigate();

  const allSessions = [
    // Deep Work Sessions
    {
      title: 'Deep Logic',
      subtitle: 'Minimal Techno',
      gradient: 'from-blue-900/80 to-blue-950/80',
      bpmRange: [120, 140] as [number, number],
      genres: ['Techno', 'Minimal Techno'],
    },
    {
      title: 'Code Flow',
      subtitle: 'Electronic Focus',
      gradient: 'from-indigo-900/80 to-indigo-950/80',
      bpmRange: [125, 145] as [number, number],
      genres: ['Electronic', 'Techno'],
    },
    {
      title: 'Algorithm Master',
      subtitle: 'High Energy Beats',
      gradient: 'from-cyan-900/80 to-cyan-950/80',
      bpmRange: [130, 150] as [number, number],
      genres: ['Electronic', 'Minimal Techno'],
    },
    
    // Flow State Sessions
    {
      title: 'Creative Flow',
      subtitle: 'Ambient Jazz',
      gradient: 'from-purple-900/80 to-purple-950/80',
      bpmRange: [80, 110] as [number, number],
      genres: ['Ambient', 'Jazz'],
    },
    {
      title: 'Steady Rhythm',
      subtitle: 'Lo-Fi Beats',
      gradient: 'from-violet-900/80 to-violet-950/80',
      bpmRange: [85, 105] as [number, number],
      genres: ['Lo-Fi', 'Ambient'],
    },
    {
      title: 'Smooth Sailing',
      subtitle: 'Synthwave Dreams',
      gradient: 'from-fuchsia-900/80 to-fuchsia-950/80',
      bpmRange: [90, 115] as [number, number],
      genres: ['Synthwave', 'Ambient'],
    },
    
    // Relaxation Sessions
    {
      title: 'Speed Reading',
      subtitle: 'Classical Chill',
      gradient: 'from-emerald-900/80 to-emerald-950/80',
      bpmRange: [60, 90] as [number, number],
      genres: ['Classical', 'Acoustic'],
    },
    {
      title: 'Zen Garden',
      subtitle: 'Peaceful Meditation',
      gradient: 'from-green-900/80 to-green-950/80',
      bpmRange: [45, 65] as [number, number],
      genres: ['Ambient', 'Classical'],
    },
    {
      title: 'Ocean Waves',
      subtitle: 'Nature Sounds',
      gradient: 'from-teal-900/80 to-teal-950/80',
      bpmRange: [40, 60] as [number, number],
      genres: ['Ambient'],
    },
    {
      title: 'Spa Retreat',
      subtitle: 'Wellness & Calm',
      gradient: 'from-sky-900/80 to-sky-950/80',
      bpmRange: [50, 70] as [number, number],
      genres: ['Ambient', 'Classical'],
    },
    {
      title: 'Deep Sleep',
      subtitle: 'Nighttime Rest',
      gradient: 'from-slate-900/80 to-slate-950/80',
      bpmRange: [35, 55] as [number, number],
      genres: ['Ambient', 'Classical'],
    },
    {
      title: 'Yoga Flow',
      subtitle: 'Mindful Movement',
      gradient: 'from-lime-900/80 to-lime-950/80',
      bpmRange: [55, 75] as [number, number],
      genres: ['Ambient', 'Acoustic'],
    },
    {
      title: 'Morning Meditation',
      subtitle: 'Start Your Day',
      gradient: 'from-amber-900/80 to-amber-950/80',
      bpmRange: [50, 70] as [number, number],
      genres: ['Ambient', 'Jazz'],
    },
    {
      title: 'Evening Unwind',
      subtitle: 'Peaceful Sunset',
      gradient: 'from-orange-900/80 to-orange-950/80',
      bpmRange: [55, 75] as [number, number],
      genres: ['Jazz', 'Acoustic'],
    },
    {
      title: 'Nature Walk',
      subtitle: 'Forest Sounds',
      gradient: 'from-emerald-900/80 to-emerald-950/80',
      bpmRange: [45, 65] as [number, number],
      genres: ['Ambient'],
    },
    {
      title: 'Peaceful Piano',
      subtitle: 'Classical Serenity',
      gradient: 'from-rose-900/80 to-rose-950/80',
      bpmRange: [50, 70] as [number, number],
      genres: ['Classical'],
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-screen-2xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">All Sessions</h1>
            <p className="text-muted-foreground mt-2">
              Choose a session that matches your current focus level and mood
            </p>
          </div>
        </div>

        {/* Deep Work Sessions */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Deep Work</h2>
            <p className="text-sm text-muted-foreground">
              High-energy tracks for maximum concentration (BPM 120-150)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allSessions.slice(0, 3).map((session) => (
              <SessionCard key={session.title} {...session} />
            ))}
          </div>
        </div>

        {/* Flow State Sessions */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Flow State</h2>
            <p className="text-sm text-muted-foreground">
              Balanced rhythms for steady productivity (BPM 80-115)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allSessions.slice(3, 6).map((session) => (
              <SessionCard key={session.title} {...session} />
            ))}
          </div>
        </div>

        {/* Relaxation Sessions */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Relaxation & Meditation</h2>
            <p className="text-sm text-muted-foreground">
              Peaceful tracks for unwinding and mindfulness (BPM 35-90)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allSessions.slice(6).map((session) => (
              <SessionCard key={session.title} {...session} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
