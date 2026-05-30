import { Link, type RouteObject } from 'react-router-dom';

import { HomePage } from './home-page';
import { ROUTES, navItems } from './routes';

export { PREFIX, PROJECT2_HOME, ROUTES, navItems } from './routes';

export const appRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: ROUTES.PAGE_2,
    element: (
      <div>
        <p>Project 1 — Page 2</p>
        <Link to="..">Back to home</Link>
      </div>
    ),
  },
];
