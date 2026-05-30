export const PREFIX = '/project1' as const;
export const PROJECT2_HOME = '/project2' as const;

export const ROUTES = {
  HOME: '',
  PAGE_2: 'page-2',
} as const;

export const navItems = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.PAGE_2, label: 'Page 2' },
] as const;
