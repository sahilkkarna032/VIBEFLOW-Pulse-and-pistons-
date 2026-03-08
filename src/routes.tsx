import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import LibraryPage from './pages/LibraryPage';
import FocusLabPage from './pages/FocusLabPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SessionsPage from './pages/SessionsPage';
import TransformCoversPage from './pages/TransformCoversPage';
import NotFound from './pages/NotFound';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
  },
  {
    name: 'Discover',
    path: '/discover',
    element: <DiscoverPage />,
  },
  {
    name: 'Library',
    path: '/library',
    element: <LibraryPage />,
  },
  {
    name: 'Focus Lab',
    path: '/focus-lab',
    element: <FocusLabPage />,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    name: 'Sessions',
    path: '/sessions',
    element: <SessionsPage />,
    visible: false,
  },
  {
    name: 'Transform Covers',
    path: '/transform-covers',
    element: <TransformCoversPage />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false,
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFound />,
    visible: false,
  },
];

export default routes;
