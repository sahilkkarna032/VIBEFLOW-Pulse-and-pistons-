import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPlaylists, createPlaylist, addTrackToPlaylist } from '@/db/api';
import { toast } from 'sonner';
import type { Playlist } from '@/types';

interface AddToPlaylistDialogProps {
  trackId: string;
  trigger?: React.ReactNode;
}

export function AddToPlaylistDialog({ trackId, trigger }: AddToPlaylistDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const loadPlaylists = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserPlaylists(user.id);
      setPlaylists(data);
    } catch (error) {
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      loadPlaylists();
      setShowCreateForm(false);
      setNewPlaylistTitle('');
      setNewPlaylistDescription('');
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await addTrackToPlaylist(playlistId, trackId);
      toast.success('Added to playlist');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to add to playlist');
    }
  };

  const handleCreatePlaylist = async () => {
    if (!user || !newPlaylistTitle.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    setLoading(true);
    try {
      const playlist = await createPlaylist(
        user.id,
        newPlaylistTitle,
        newPlaylistDescription,
        [trackId]
      );
      if (playlist) {
        toast.success('Playlist created');
        setOpen(false);
      }
    } catch (error) {
      toast.error('Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add to Playlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist or create a new one
          </DialogDescription>
        </DialogHeader>

        {!showCreateForm ? (
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Playlist
            </Button>

            <ScrollArea className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : playlists.length > 0 ? (
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <Button
                      key={playlist.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleAddToPlaylist(playlist.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          🎵
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-medium truncate">{playlist.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {playlist.track_ids.length} tracks
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-sm text-muted-foreground">No playlists yet</p>
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Playlist Name</Label>
              <Input
                id="title"
                placeholder="My Awesome Playlist"
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your playlist..."
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreatePlaylist}
                disabled={loading || !newPlaylistTitle.trim()}
              >
                <Check className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
