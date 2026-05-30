import { Link, type RouteObject } from 'react-router-dom';

import { Button } from '@nx-mono-react-jsonforms/core';

export const PREFIX = '/project2' as const;
export const PROJECT1_HOME = '/project1' as const;

export const ROUTES = {
  HOME: '',
  PAGE_2: 'page-2',
} as const;

export const navItems = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.PAGE_2, label: 'Page 2' },
] as const;

export const appRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <div>
        <p>Project 2</p>
        <Button>Click me</Button>
        <Link to={ROUTES.PAGE_2}>Go to page 2</Link>
        {' · '}
        <Link to={PROJECT1_HOME}>Go to Project 1</Link>
      </div>
    ),
  },
  {
    path: ROUTES.PAGE_2,
    element: (
      <div>
        <p>Project 2 — Page 2</p>
        <Link to="..">Back to home</Link>
      </div>
    ),
  },
];
