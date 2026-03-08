import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { updateUserProfile } from '@/db/api';
import { toast } from 'sonner';
import { User, Music, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [instrumentalOnly, setInstrumentalOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.focus_preferences) {
      setInstrumentalOnly(user.focus_preferences.instrumental_only_deep_work ?? false);
    }
  }, [user]);

  const handleSavePreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await updateUserProfile(user.id, {
        focus_preferences: {
          instrumental_only_deep_work: instrumentalOnly,
        },
      });
      await refreshProfile();
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    toast.success('Signed out successfully');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="pb-32 pt-6 px-4 max-w-screen-xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold gradient-text">{user.username}</h1>
        <p className="text-muted-foreground">
          {user.role === 'admin' ? '👑 Admin' : 'User'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 glass">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Focus Time</p>
              <p className="text-2xl font-bold">{user.total_focus_minutes || 0} minutes</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Settings className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-2xl font-bold">
                {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Focus Preferences */}
      <Card className="p-6 glass">
        <h2 className="text-2xl font-bold mb-6">Focus Preferences</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="instrumental-only" className="text-base font-semibold">
                Instrumental Only in Deep Work
              </Label>
              <p className="text-sm text-muted-foreground">
                Only play instrumental tracks when in Deep Work mode (81-100)
              </p>
            </div>
            <Switch
              id="instrumental-only"
              checked={instrumentalOnly}
              onCheckedChange={setInstrumentalOnly}
            />
          </div>

          <Button onClick={handleSavePreferences} disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="p-6 glass">
        <h2 className="text-2xl font-bold mb-6">Account</h2>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
