import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrackCard } from '@/components/TrackCard';
import { GenreCard } from '@/components/GenreCard';
import { usePlayer } from '@/contexts/FocusContext';
import { searchTracks, getAllTracks, getCuratedPlaylists } from '@/db/api';
import { Search, TrendingUp, Music, Smile, Globe, Activity, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import type { Track, Playlist } from '@/types';

const musicGenres = [
  { name: 'Electronic', icon: '🎹', keywords: ['Electronic', 'Techno'] },
  { name: 'Lo-Fi', icon: '🎧', keywords: ['Lo-Fi'] },
  { name: 'Ambient', icon: '🌌', keywords: ['Ambient'] },
  { name: 'Jazz', icon: '🎷', keywords: ['Jazz'] },
  { name: 'Classical', icon: '🎻', keywords: ['Classical'] },
  { name: 'Synthwave', icon: '🌆', keywords: ['Synthwave'] },
  { name: 'Acoustic', icon: '🎸', keywords: ['Acoustic'] },
  { name: 'Minimal', icon: '⚪', keywords: ['Minimal Techno'] },
];

const moodCategories = [
  { name: 'Energetic', icon: '⚡', description: 'High energy tracks to boost your mood', color: 'from-orange-500/20 to-red-500/20' },
  { name: 'Calm', icon: '🌊', description: 'Peaceful and relaxing vibes', color: 'from-blue-500/20 to-cyan-500/20' },
  { name: 'Happy', icon: '😊', description: 'Uplifting and joyful melodies', color: 'from-yellow-500/20 to-orange-500/20' },
  { name: 'Melancholic', icon: '🌧️', description: 'Reflective and emotional tracks', color: 'from-purple-500/20 to-blue-500/20' },
  { name: 'Focused', icon: '🎯', description: 'Perfect for deep concentration', color: 'from-indigo-500/20 to-purple-500/20' },
  { name: 'Romantic', icon: '💕', description: 'Love songs and tender moments', color: 'from-pink-500/20 to-rose-500/20' },
  { name: 'Motivational', icon: '🔥', description: 'Inspiring tracks to push you forward', color: 'from-red-500/20 to-orange-500/20' },
  { name: 'Dreamy', icon: '✨', description: 'Ethereal and atmospheric sounds', color: 'from-violet-500/20 to-purple-500/20' },
];

const languageCategories = [
  { name: 'English', icon: '🇬🇧', flag: '🇺🇸' },
  { name: 'Spanish', icon: '🇪🇸', flag: '🇲🇽' },
  { name: 'French', icon: '🇫🇷', flag: '🇫🇷' },
  { name: 'Japanese', icon: '🇯🇵', flag: '🇯🇵' },
  { name: 'Korean', icon: '🇰🇷', flag: '🇰🇷' },
  { name: 'Portuguese', icon: '🇵🇹', flag: '🇧🇷' },
  { name: 'German', icon: '🇩🇪', flag: '🇩🇪' },
  { name: 'Italian', icon: '🇮🇹', flag: '🇮🇹' },
  { name: 'Chinese', icon: '🇨🇳', flag: '🇨🇳' },
  { name: 'Hindi', icon: '🇮🇳', flag: '🇮🇳' },
  { name: 'Arabic', icon: '🇸🇦', flag: '🇦🇪' },
  { name: 'Instrumental', icon: '🎵', flag: '🎼' },
];

const activityCategories = [
  { name: 'Workout', icon: '💪', description: 'High-energy beats for exercise', color: 'from-red-500/20 to-orange-500/20' },
  { name: 'Study', icon: '📚', description: 'Focus-enhancing background music', color: 'from-blue-500/20 to-indigo-500/20' },
  { name: 'Sleep', icon: '😴', description: 'Soothing sounds for rest', color: 'from-indigo-500/20 to-purple-500/20' },
  { name: 'Meditation', icon: '🧘', description: 'Calm tracks for mindfulness', color: 'from-green-500/20 to-teal-500/20' },
  { name: 'Party', icon: '🎉', description: 'Upbeat tracks to get the party started', color: 'from-pink-500/20 to-purple-500/20' },
  { name: 'Cooking', icon: '👨‍🍳', description: 'Pleasant tunes for the kitchen', color: 'from-orange-500/20 to-yellow-500/20' },
  { name: 'Driving', icon: '🚗', description: 'Perfect road trip companions', color: 'from-cyan-500/20 to-blue-500/20' },
  { name: 'Gaming', icon: '🎮', description: 'Epic soundtracks for gaming sessions', color: 'from-purple-500/20 to-pink-500/20' },
];

const timeCategories = [
  { name: 'Morning', icon: '🌅', description: 'Start your day right', color: 'from-yellow-500/20 to-orange-500/20' },
  { name: 'Afternoon', icon: '☀️', description: 'Midday energy boost', color: 'from-orange-500/20 to-amber-500/20' },
  { name: 'Evening', icon: '🌆', description: 'Wind down after work', color: 'from-purple-500/20 to-pink-500/20' },
  { name: 'Night', icon: '🌙', description: 'Late night vibes', color: 'from-indigo-500/20 to-purple-500/20' },
];

export default function DiscoverPage() {
  const { filteredTracks, isLoading } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('genres');

  useEffect(() => {
    getAllTracks().then(setAllTracks);
    getCuratedPlaylists().then(setPlaylists);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearching(true);
      const timer = setTimeout(() => {
        searchTracks(searchQuery).then((results) => {
          setSearchResults(results);
          setSearching(false);
        });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setSearching(false);
    }
  }, [searchQuery]);

  const displayTracks = searchQuery.trim() ? searchResults : filteredTracks;
  const trendingTracks = allTracks.slice(0, 6);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-screen-2xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold">Discover</h1>
          <p className="text-muted-foreground text-lg">Explore music by genre, mood, language, and more</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tracks, artists, genres, moods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 glass text-base"
          />
        </div>

        {/* Category Tabs */}
        {!searchQuery && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="genres" className="gap-2">
                <Music className="w-4 h-4" />
                Genres
              </TabsTrigger>
              <TabsTrigger value="moods" className="gap-2">
                <Smile className="w-4 h-4" />
                Moods
              </TabsTrigger>
              <TabsTrigger value="languages" className="gap-2">
                <Globe className="w-4 h-4" />
                Languages
              </TabsTrigger>
              <TabsTrigger value="activities" className="gap-2">
                <Activity className="w-4 h-4" />
                Activities
              </TabsTrigger>
              <TabsTrigger value="time" className="gap-2">
                <Clock className="w-4 h-4" />
                Time of Day
              </TabsTrigger>
            </TabsList>

            {/* Genres Tab */}
            <TabsContent value="genres" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {musicGenres.map((genre) => (
                    <GenreCard
                      key={genre.name}
                      genre={genre.name}
                      icon={genre.icon}
                      onClick={() => setSearchQuery(genre.keywords[0])}
                    />
                  ))}
                </div>
              </div>

              {/* Curated Playlists */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Curated Playlists</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {playlists.map((playlist) => (
                    <Card
                      key={playlist.id}
                      className="group cursor-pointer hover:border-primary/50 focus-transition overflow-hidden"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={playlist.cover_url || 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_7d9c76b6-3d91-4daf-a6bf-95224640b99b.jpg'}
                          alt={playlist.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm truncate">{playlist.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{playlist.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{playlist.track_ids.length} tracks</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Moods Tab */}
            <TabsContent value="moods" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Browse by Mood</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {moodCategories.map((mood) => (
                    <Card
                      key={mood.name}
                      className={`p-6 cursor-pointer hover:border-primary/50 focus-transition bg-gradient-to-br ${mood.color}`}
                      onClick={() => setSearchQuery(mood.name)}
                    >
                      <div className="text-4xl mb-3">{mood.icon}</div>
                      <h3 className="font-bold text-lg mb-1">{mood.name}</h3>
                      <p className="text-xs text-muted-foreground">{mood.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Languages Tab */}
            <TabsContent value="languages" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Browse by Language</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {languageCategories.map((lang) => (
                    <Card
                      key={lang.name}
                      className="p-6 cursor-pointer hover:border-primary/50 focus-transition text-center"
                      onClick={() => setSearchQuery(lang.name)}
                    >
                      <div className="text-5xl mb-3">{lang.icon}</div>
                      <h3 className="font-semibold">{lang.name}</h3>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Browse by Activity</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {activityCategories.map((activity) => (
                    <Card
                      key={activity.name}
                      className={`p-6 cursor-pointer hover:border-primary/50 focus-transition bg-gradient-to-br ${activity.color}`}
                      onClick={() => setSearchQuery(activity.name)}
                    >
                      <div className="text-4xl mb-3">{activity.icon}</div>
                      <h3 className="font-bold text-lg mb-1">{activity.name}</h3>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Time of Day Tab */}
            <TabsContent value="time" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Browse by Time of Day</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {timeCategories.map((time) => (
                    <Card
                      key={time.name}
                      className={`p-8 cursor-pointer hover:border-primary/50 focus-transition bg-gradient-to-br ${time.color}`}
                      onClick={() => setSearchQuery(time.name)}
                    >
                      <div className="text-5xl mb-4">{time.icon}</div>
                      <h3 className="font-bold text-xl mb-2">{time.name}</h3>
                      <p className="text-sm text-muted-foreground">{time.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Trending Tracks */}
        {!searchQuery && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square rounded-lg bg-muted" />
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {trendingTracks.map((track) => (
                  <TrackCard key={track.id} track={track} playlist={trendingTracks} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Results / Recommended Tracks */}
        {searchQuery && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Results for "{searchQuery}"</h2>
            {searching ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square rounded-lg bg-muted" />
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                  </div>
                ))}
              </div>
            ) : displayTracks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayTracks.map((track) => (
                  <TrackCard key={track.id} track={track} playlist={displayTracks} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">No tracks found for "{searchQuery}"</p>
                <p className="text-sm text-muted-foreground mt-2">Try searching for something else</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
