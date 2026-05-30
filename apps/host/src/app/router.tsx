import React, { Suspense } from 'react';
import { Link, type RouteObject } from 'react-router-dom';

const Project1 = React.lazy(() => import('project1/Module'));
const Project2 = React.lazy(() => import('project2/Module'));

export const ROUTES = {
  HOME: '/',
  PROJECT1: '/project1',
  PROJECT2: '/project2',
  PAGE_2: '/page-2',
} as const;

export const navItems = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.PROJECT2, label: 'Project2' },
  { path: ROUTES.PROJECT1, label: 'Project1' },
  { path: ROUTES.PAGE_2, label: 'Page 2' },
] as const;

export const appRoutes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: (
      <div>
        This is the generated root route.{' '}
        <Link to={ROUTES.PAGE_2}>Click here for page 2.</Link>
      </div>
    ),
  },
  {
    path: `${ROUTES.PROJECT2}/*`,
    element: (
      <Suspense fallback={<div>Loading Project2...</div>}>
        <Project2 />
      </Suspense>
    ),
  },
  {
    path: `${ROUTES.PROJECT1}/*`,
    element: (
      <Suspense fallback={<div>Loading Project1...</div>}>
        <Project1 />
      </Suspense>
    ),
  },
  {
    path: ROUTES.PAGE_2,
    element: (
      <div>
        <Link to={ROUTES.HOME}>Click here to go back to root page.</Link>
      </div>
    ),
  },
];
