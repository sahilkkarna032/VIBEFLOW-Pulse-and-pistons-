import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlayerProvider } from '@/contexts/FocusContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Sidebar } from '@/components/Sidebar';
import { NowPlayingBar } from '@/components/NowPlayingBar';
import { AudioPlayer } from '@/components/AudioPlayer';
import routes from './routes';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex min-h-screen bg-background">
      {!isLoginPage && <Sidebar />}
      <div className={`flex-1 flex flex-col ${!isLoginPage ? 'ml-64' : ''}`}>
        <main className="flex-1 overflow-auto pb-32">
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {!isLoginPage && <NowPlayingBar />}
      </div>
      <AudioPlayer />
      <Toaster />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <PlayerProvider>
          <TooltipProvider>
            <RouteGuard>
              <IntersectObserver />
              <AppContent />
            </RouteGuard>
          </TooltipProvider>
        </PlayerProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
