import { useEffect, useState } from 'react';
import { TrackCard } from '@/components/TrackCard';
import { SessionCard } from '@/components/SessionCard';
import { IntensityMeter } from '@/components/IntensityMeter';
import { RelaxationMeter } from '@/components/RelaxationMeter';
import { usePlayer } from '@/contexts/FocusContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Sparkles, Zap, Brain, Music2, Heart, Download } from 'lucide-react';
import { getRecentlyPlayed, getTracksByFilter, getCuratedPlaylists, getAllTracks, isPlaylistLiked, addLikedPlaylist, removeLikedPlaylist } from '@/db/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import type { Track, Playlist } from '@/types';

export default function HomePage() {
  const { focusMode, focusScore, setFocusScore, currentTrack, isPlaying, playTrack } = usePlayer();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [relaxationTracks, setRelaxationTracks] = useState<Track[]>([]);
  const [relaxationPlaylists, setRelaxationPlaylists] = useState<Playlist[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [loadingRelaxation, setLoadingRelaxation] = useState(false);
  const [relaxationLevel, setRelaxationLevel] = useState(50);
  const [likedPlaylists, setLikedPlaylists] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      setLoadingRecent(true);
      getRecentlyPlayed(user.id, 4).then((tracks) => {
        setRecentTracks(tracks);
        setLoadingRecent(false);
      });
    }
  }, [user]);

  useEffect(() => {
    // Load relaxation music based on relaxation level
    setLoadingRelaxation(true);
    
    let bpmMin: number | undefined;
    let bpmMax: number | undefined;
    let genres: string[] = ['Acoustic', 'Jazz', 'Classical', 'Ambient'];

    // Adjust filters based on relaxation level with 6 levels
    if (relaxationLevel <= 20) {
      // Deep Sleep: Very slow BPM for meditation and deep rest
      bpmMin = undefined;
      bpmMax = 50;
      genres = ['Ambient', 'Classical'];
    } else if (relaxationLevel <= 40) {
      // Deep Relaxation: Slow, calming
      bpmMin = 45;
      bpmMax = 65;
      genres = ['Ambient', 'Classical', 'Acoustic'];
    } else if (relaxationLevel <= 60) {
      // Moderate Relaxation: Balanced, peaceful
      bpmMin = 60;
      bpmMax = 80;
      genres = ['Acoustic', 'Jazz', 'Classical', 'Ambient'];
    } else if (relaxationLevel <= 75) {
      // Light Relaxation: Gentle energy
      bpmMin = 75;
      bpmMax = 95;
      genres = ['Acoustic', 'Jazz', 'Lo-Fi'];
    } else if (relaxationLevel <= 90) {
      // Active Relaxation: Uplifting
      bpmMin = 90;
      bpmMax = 110;
      genres = ['Lo-Fi', 'Jazz', 'Acoustic'];
    } else {
      // Energized: Vibrant and refreshed
      bpmMin = 105;
      bpmMax = 125;
      genres = ['Lo-Fi', 'Electronic', 'Jazz'];
    }

    Promise.all([
      getTracksByFilter(bpmMin, bpmMax, genres),
      getCuratedPlaylists(),
    ]).then(([tracks, allPlaylists]) => {
      const filteredTracks = tracks.slice(0, 16);
      setRelaxationTracks(filteredTracks);
      
      // Filter for relaxation playlists
      const relaxPlaylists = allPlaylists.filter(p => 
        p.title.toLowerCase().includes('relaxation') ||
        p.title.toLowerCase().includes('peaceful') ||
        p.title.toLowerCase().includes('zen') ||
        p.title.toLowerCase().includes('spa') ||
        p.title.toLowerCase().includes('sleep') ||
        p.title.toLowerCase().includes('meditation') ||
        p.title.toLowerCase().includes('yoga') ||
        p.title.toLowerCase().includes('ocean') ||
        p.title.toLowerCase().includes('nature')
      );
      setRelaxationPlaylists(relaxPlaylists.slice(0, 4));
      setLoadingRelaxation(false);

      // Load liked status for playlists
      if (user) {
        Promise.all(
          relaxPlaylists.slice(0, 4).map(p => isPlaylistLiked(user.id, p.id))
        ).then(results => {
          const liked = new Set<string>();
          relaxPlaylists.slice(0, 4).forEach((p, i) => {
            if (results[i]) liked.add(p.id);
          });
          setLikedPlaylists(liked);
        });
      }

      // Auto-play immediately when relaxation level changes
      if (filteredTracks.length > 0) {
        // Find the best matching track for the new level
        const suitableTrack = filteredTracks.find(track => {
          if (relaxationLevel <= 20) return track.bpm <= 50;
          if (relaxationLevel <= 40) return track.bpm >= 45 && track.bpm <= 65;
          if (relaxationLevel <= 60) return track.bpm >= 60 && track.bpm <= 80;
          if (relaxationLevel <= 75) return track.bpm >= 75 && track.bpm <= 95;
          if (relaxationLevel <= 90) return track.bpm >= 90 && track.bpm <= 110;
          return track.bpm >= 105 && track.bpm <= 125;
        });

        // Auto-switch immediately if we have a suitable track
        if (suitableTrack) {
          playTrack(suitableTrack, filteredTracks);
          
          // Show appropriate message based on level
          let levelName = 'Deep Sleep';
          if (relaxationLevel > 20 && relaxationLevel <= 40) levelName = 'Deep Relaxation';
          else if (relaxationLevel > 40 && relaxationLevel <= 60) levelName = 'Moderate Relaxation';
          else if (relaxationLevel > 60 && relaxationLevel <= 75) levelName = 'Light Relaxation';
          else if (relaxationLevel > 75 && relaxationLevel <= 90) levelName = 'Active Relaxation';
          else if (relaxationLevel > 90) levelName = 'Energized';
          
          toast.info(`Now playing ${levelName} music (${suitableTrack.bpm} BPM)`);
        }
      }
    });
  }, [relaxationLevel, user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickSessions = [
    {
      title: 'Deep Logic',
      subtitle: 'Minimal Techno',
      gradient: 'from-blue-900/80 to-blue-950/80',
      bpmRange: [120, 140] as [number, number],
      genres: ['Techno', 'Minimal Techno'],
    },
    {
      title: 'Creative Flow',
      subtitle: 'Ambient Jazz',
      gradient: 'from-purple-900/80 to-purple-950/80',
      bpmRange: [80, 110] as [number, number],
      genres: ['Ambient', 'Jazz'],
    },
    {
      title: 'Speed Reading',
      subtitle: 'Classical Chill',
      gradient: 'from-emerald-900/80 to-emerald-950/80',
      bpmRange: [60, 90] as [number, number],
      genres: ['Classical', 'Acoustic'],
    },
  ];

  const handleModeToggle = (mode: 'adaptive' | 'deep-work') => {
    if (mode === 'adaptive') {
      setFocusScore(50);
      toast.info('Switched to Adaptive mode');
    } else {
      setFocusScore(85);
      toast.info('Switched to Deep Work mode');
    }
  };

  const handlePlaylistLike = async (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to like playlists');
      return;
    }

    try {
      const isLiked = likedPlaylists.has(playlistId);
      if (isLiked) {
        await removeLikedPlaylist(user.id, playlistId);
        setLikedPlaylists(prev => {
          const newSet = new Set(prev);
          newSet.delete(playlistId);
          return newSet;
        });
        toast.success('Removed from liked playlists');
      } else {
        await addLikedPlaylist(user.id, playlistId);
        setLikedPlaylists(prev => new Set(prev).add(playlistId));
        toast.success('Added to liked playlists');
      }
    } catch (error) {
      toast.error('Failed to update liked playlists');
    }
  };

  const handlePlaylistDownload = async (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const playlistData = {
        title: playlist.title,
        description: playlist.description,
        track_count: playlist.track_ids.length,
        created_at: playlist.created_at,
      };
      
      const blob = new Blob([JSON.stringify(playlistData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${playlist.title}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Playlist info downloaded');
    } catch (error) {
      toast.error('Failed to download playlist');
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-screen-2xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary/50 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              AI ASSISTANT ACTIVE
            </Badge>
            <h1 className="text-5xl font-bold">
              {getGreeting()}, {user?.username || 'Guest'}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={focusMode === 'flow-state' ? 'default' : 'outline'}
              onClick={() => handleModeToggle('adaptive')}
              className="gap-2"
            >
              <Zap className="w-4 h-4" />
              Adaptive
            </Button>
            <Button
              variant={focusMode === 'deep-work' ? 'default' : 'outline'}
              onClick={() => handleModeToggle('deep-work')}
              className="gap-2"
            >
              <Brain className="w-4 h-4" />
              Deep Work
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Start Sessions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Quick Start Sessions</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground" 
                  onClick={() => navigate('/sessions')}
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickSessions.map((session) => (
                  <SessionCard key={session.title} {...session} />
                ))}
              </div>
            </div>

            {/* Dynamic Flow */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Dynamic Flow</h2>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm">
                    Current State: <span className="text-primary font-semibold">
                      {focusMode === 'deep-work' ? 'Deep Work' : focusMode === 'flow-state' ? 'Steady Productivity' : 'Relaxation'}
                    </span>
                  </span>
                </div>
              </div>

              <Card className="glass border-border/50">
                <div className="p-6">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    <div className="col-span-1">#</div>
                    <div className="col-span-7">TITLE</div>
                    <div className="col-span-3">MOOD</div>
                    <div className="col-span-1 text-right">
                      <Clock className="w-4 h-4 ml-auto" />
                    </div>
                  </div>
                  {recentTracks.length > 0 ? (
                    <div className="space-y-2">
                      {recentTracks.map((track, index) => (
                        <div
                          key={track.id}
                          className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg hover:bg-muted/50 cursor-pointer focus-transition group"
                        >
                          <div className="col-span-1 text-muted-foreground group-hover:text-foreground">
                            {index + 1}
                          </div>
                          <div className="col-span-7 flex items-center gap-3">
                            <img
                              src={track.cover_url}
                              alt={track.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div className="min-w-0">
                              <p className="font-medium truncate">{track.title}</p>
                              <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                            </div>
                          </div>
                          <div className="col-span-3">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {track.genre}
                            </span>
                          </div>
                          <div className="col-span-1 text-right text-sm text-muted-foreground">
                            {Math.floor(track.duration_seconds / 60)}:{(track.duration_seconds % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No recent tracks</p>
                      <p className="text-sm mt-2">Start playing to see your dynamic flow</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Relaxation Level Control */}
            <RelaxationMeter value={relaxationLevel} onChange={setRelaxationLevel} />

            {/* Intensity Meter */}
            <IntensityMeter />

            {/* Recent History */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>RECENT HISTORY</span>
              </div>
              {loadingRecent ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded bg-muted" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4 bg-muted" />
                        <Skeleton className="h-3 w-1/2 bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentTracks.length > 0 ? (
                <div className="space-y-3">
                  {recentTracks.slice(0, 3).map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer focus-transition"
                    >
                      <img
                        src={track.cover_url}
                        alt={track.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Yesterday • {Math.floor(track.duration_seconds / 60)}m
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No history yet</p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Relaxation Music Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music2 className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-3xl font-bold">Relaxation Music</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Peaceful tracks to help you unwind and relax
                </p>
              </div>
            </div>
          </div>

          {/* Relaxation Playlists */}
          {relaxationPlaylists.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Curated Playlists</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relaxationPlaylists.map((playlist) => (
                  <Card
                    key={playlist.id}
                    className="group cursor-pointer hover:border-primary/50 focus-transition overflow-hidden"
                    onClick={() => {
                      // Navigate to playlist or play it
                      console.log('Play playlist:', playlist.id);
                    }}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={playlist.cover_url || ''}
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 focus-transition flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {/* Like and Download buttons for playlist */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-90 group-hover:opacity-100 focus-transition">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                          onClick={(e) => handlePlaylistLike(playlist.id, e)}
                        >
                          <Heart
                            className={cn(
                              'w-4 h-4',
                              likedPlaylists.has(playlist.id) ? 'fill-primary text-primary' : 'text-white'
                            )}
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                          onClick={(e) => handlePlaylistDownload(playlist, e)}
                        >
                          <Download className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold truncate">{playlist.title}</h4>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {playlist.description || 'Relaxation playlist'}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Relaxation Tracks */}
          {loadingRelaxation ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full bg-muted" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                    <Skeleton className="h-3 w-1/2 bg-muted" />
                  </div>
                </Card>
              ))}
            </div>
          ) : relaxationTracks.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Relaxing Tracks</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relaxationTracks.map((track) => (
                  <TrackCard key={track.id} track={track} playlist={relaxationTracks} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Music2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No relaxation tracks available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
