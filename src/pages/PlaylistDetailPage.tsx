import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/FocusContext';
import { TrackCard } from '@/components/TrackCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlaylistById, getTracksByIds, deletePlaylist, updatePlaylist } from '@/db/api';
import { ArrowLeft, Play, Heart, MoreVertical, Edit, Trash, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Track, Playlist } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (id) {
      loadPlaylist();
    }
  }, [id]);

  const loadPlaylist = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const playlistData = await getPlaylistById(id);
      if (!playlistData) {
        toast.error('Playlist not found');
        navigate('/library');
        return;
      }
      
      setPlaylist(playlistData);
      setEditTitle(playlistData.title);
      setEditDescription(playlistData.description || '');
      
      if (playlistData.track_ids.length > 0) {
        const tracksData = await getTracksByIds(playlistData.track_ids);
        setTracks(tracksData);
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
      toast.error('Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
      toast.success('Playing playlist');
    }
  };

  const handleEdit = async () => {
    if (!playlist || !id) return;

    try {
      await updatePlaylist(id, {
        title: editTitle,
        description: editDescription,
      });
      setPlaylist({ ...playlist, title: editTitle, description: editDescription });
      setEditDialogOpen(false);
      toast.success('Playlist updated');
    } catch (error) {
      toast.error('Failed to update playlist');
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deletePlaylist(id);
      toast.success('Playlist deleted');
      navigate('/library');
    } catch (error) {
      toast.error('Failed to delete playlist');
    }
  };

  const handleDownload = async () => {
    if (!playlist) return;

    try {
      const playlistData = {
        title: playlist.title,
        description: playlist.description,
        track_count: tracks.length,
        tracks: tracks.map(t => ({
          title: t.title,
          artist: t.artist,
          bpm: t.bpm,
          genre: t.genre,
        })),
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
      toast.success('Playlist downloaded');
    } catch (error) {
      toast.error('Failed to download playlist');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-screen-xl mx-auto p-8 space-y-8">
          <Skeleton className="h-64 w-full bg-muted" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-screen-xl mx-auto p-8">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Playlist not found</h2>
            <Button onClick={() => navigate('/library')}>Back to Library</Button>
          </Card>
        </div>
      </div>
    );
  }

  const canEdit = user && playlist.created_by === user.id;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-screen-xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-start gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/library')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Playlist</p>
                <h1 className="text-5xl font-bold mb-4">{playlist.title}</h1>
                {playlist.description && (
                  <p className="text-muted-foreground mb-4">{playlist.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold">{tracks.length} tracks</span>
                  {playlist.is_curated && (
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      Curated
                    </span>
                  )}
                </div>
              </div>

              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteDialogOpen(true)}
                      className="text-red-500"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete Playlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex items-center gap-4 mt-6">
              <Button
                size="lg"
                onClick={handlePlayAll}
                disabled={tracks.length === 0}
                className="rounded-full"
              >
                <Play className="w-5 h-5 mr-2" />
                Play All
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => toast.info('Like playlist feature coming soon')}
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={handleDownload}
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tracks */}
        {tracks.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Tracks</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} playlist={tracks} />
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Plus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No tracks yet</h3>
            <p className="text-muted-foreground">
              Add tracks to this playlist to start listening
            </p>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
            <DialogDescription>
              Update your playlist details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Playlist name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add a description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Playlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{playlist.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
