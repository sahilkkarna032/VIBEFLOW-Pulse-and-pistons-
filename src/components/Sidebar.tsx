import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Library, Heart, Music, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CreatePlaylistDialog } from '@/components/CreatePlaylistDialog';
import { useEffect, useState } from 'react';
import { getUserPlaylists } from '@/db/api';
import type { Playlist } from '@/types';

const navigation = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'discover', label: 'Discover', icon: Compass, path: '/discover' },
  { id: 'library', label: 'Your Library', icon: Library, path: '/library' },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const loadPlaylists = () => {
    if (user) {
      getUserPlaylists(user.id).then(setPlaylists);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, [user]);

  return (
    <>
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">VibeFlow</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg focus-transition text-sm font-medium',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Separator className="my-4 mx-3" />

        {/* Playlists */}
        <div className="flex-1 overflow-hidden flex flex-col px-3">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Playlists
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1">
              <Link
                to="/library"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-transition"
              >
                <Heart className="w-4 h-4" />
                <span>Liked Songs</span>
              </Link>
              {playlists.slice(0, 10).map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-transition truncate"
                >
                  {playlist.title}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* User Profile */}
        {user && (
          <Link
            to="/profile"
            className="p-3 border-t border-border hover:bg-muted/50 focus-transition flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground">View profile</p>
            </div>
          </Link>
        )}
      </div>

      <CreatePlaylistDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadPlaylists}
      />
    </>
  );
}
