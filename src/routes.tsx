import SplashPage from './pages/SplashPage';
import FollowGatePage from './pages/FollowGatePage';
import HomePage from './pages/HomePage';
import CreateImagePage from './pages/CreateImagePage';
import TextToImagePage from './pages/TextToImagePage';
import CreateVideoPage from './pages/CreateVideoPage';
import AboutPage from './pages/AboutPage';
import type { ComponentType } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  component: ComponentType;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Splash',
    path: '/',
    component: SplashPage,
    visible: false
  },
  {
    name: 'Follow Gate',
    path: '/follow-gate',
    component: FollowGatePage,
    visible: false
  },
  {
    name: 'Home',
    path: '/home',
    component: HomePage,
    visible: false
  },
  {
    name: 'Text to Image',
    path: '/text-to-image',
    component: TextToImagePage,
    visible: false
  },
  {
    name: 'Create Image',
    path: '/create-image',
    component: CreateImagePage,
    visible: false
  },
  {
    name: 'Create Video',
    path: '/create-video',
    component: CreateVideoPage,
    visible: false
  },
  {
    name: 'About',
    path: '/about',
    component: AboutPage,
    visible: false
  }
];

export default routes;
