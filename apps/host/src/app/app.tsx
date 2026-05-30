import { Link, useRoutes } from 'react-router-dom';

import { appRoutes, navItems } from './router';

export function App() {
  const routes = useRoutes(appRoutes);

  return (
    <div>
      <div role="navigation">
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
