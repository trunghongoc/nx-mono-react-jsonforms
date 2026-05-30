import { Link, useRoutes } from 'react-router-dom';

import { appRoutes, navItems } from './router';

export function App() {
  const routes = useRoutes(appRoutes);

  return (
    <div className="border-1 border-gray-500 p-4">
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
