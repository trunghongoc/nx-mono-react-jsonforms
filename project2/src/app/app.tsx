import { useEffect } from 'react';
import { Link, useRoutes } from 'react-router-dom';
import { useAppVersionStore, initAppVersion } from '@nx-mono-react-jsonforms/store';


import { appRoutes, navItems } from './router';

export function App() {
  const routes = useRoutes(appRoutes);

  const version = useAppVersionStore((state) => state.versions.project2);

  useEffect(() => {
    initAppVersion('project2', '0.0.2');
  }, []);


  return (
    <div className="border-1 border-gray-500 p-4">
        <div>Project 2 Version: {version}</div>

      <nav>
        <ul>
          {navItems.map(({ path, label }) => (
            <li key={path || 'home'}>
              <Link to={path}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      {routes}
    </div>
  );
}

export default App;
