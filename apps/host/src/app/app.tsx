import { Link, useRoutes } from 'react-router-dom';
import { useAppVersionStore } from '@nx-mono-react-jsonforms/store';

import { appRoutes, navItems } from './router';

export function App() {
  const routes = useRoutes(appRoutes);

  const version = useAppVersionStore((state) => state.versions.project2);

  return (
    <div>
      <div role="navigation">

        <div>Project 2 Version: {version}</div>
        <ul>
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <Link to={path}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>
      {routes}
    </div>
  );
}

export default App;
