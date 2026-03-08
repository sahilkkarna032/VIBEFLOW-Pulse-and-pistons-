import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TrackCard } from '@/components/TrackCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLikedTracks, getUserPlaylists } from '@/db/api';
import { Heart, Download, User, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CreatePlaylistDialog } from '@/components/CreatePlaylistDialog';
import type { Track, Playlist } from '@/types';
import { useNavigate } from 'react-router-dom';

export default function LibraryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!user) return;
    
    Promise.all([
      getLikedTracks(user.id),
      getUserPlaylists(user.id),
    ]).then(([liked, userPlaylists]) => {
      setLikedTracks(liked);
      setPlaylists(userPlaylists);
      setLoading(false);
    });
  };

  const handlePlaylistCreated = () => {
    setCreateDialogOpen(false);
    loadData(); // Reload playlists
  };

  if (!user) {
    return (
      <div className="pb-32 pt-6 px-4 max-w-screen-xl mx-auto">
        <Card className="p-12 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Sign in to view your library</h2>
          <p className="text-muted-foreground mb-6">
            Create an account to save your favorite tracks and playlists
          </p>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-6 px-4 max-w-screen-xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold gradient-text">My Library</h1>
        <p className="text-muted-foreground">Your personal music collection</p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 glass cursor-pointer hover:border-primary/50 focus-transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Liked Songs</h3>
              <p className="text-sm text-muted-foreground">{likedTracks.length} tracks</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass cursor-pointer hover:border-primary/50 focus-transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Download className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-bold">Downloaded</h3>
              <p className="text-sm text-muted-foreground">0 albums</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass cursor-pointer hover:border-primary/50 focus-transition" onClick={() => navigate('/profile')}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold">Focus Profiles</h3>
              <p className="text-sm text-muted-foreground">Customize settings</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liked Songs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Liked Songs</h2>
          <Heart className="w-6 h-6 text-primary fill-primary" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square rounded-lg bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
              </div>
            ))}
          </div>
        ) : likedTracks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likedTracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No liked songs yet</h3>
            <p className="text-muted-foreground">
              Start exploring and like tracks to build your collection
            </p>
          </Card>
        )}
      </div>

      {/* Playlists */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Playlists</h2>
          <Button size="sm" variant="outline" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </div>

        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="group cursor-pointer hover:border-primary/50 focus-transition overflow-hidden"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                {playlist.cover_url ? (
                  <div className="aspect-square relative">
                    <img
                      src={playlist.cover_url}
                      alt={playlist.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Plus className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold truncate">{playlist.title}</h3>
                  <p className="text-sm text-muted-foreground">{playlist.track_ids.length} tracks</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Plus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No playlists yet</h3>
            <p className="text-muted-foreground mb-4">Create your first playlist to organize your music</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </Card>
        )}
      </div>

      {/* Create Playlist Dialog */}
      <CreatePlaylistDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handlePlaylistCreated}
      />
    </div>
  );
}
