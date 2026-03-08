import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Library, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'discover', label: 'Discover', icon: Compass, path: '/discover' },
  { id: 'library', label: 'Library', icon: Library, path: '/library' },
  { id: 'focus-lab', label: 'Focus Lab', icon: Activity, path: '/focus-lab' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full focus-transition',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
