import type { Decorator, Preview } from '@storybook/react';
import { useEffect } from 'react';

import './styles.css';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

const withTheme: Decorator = (Story, { globals }) => {
  const theme = (globals.theme as Theme | undefined) ?? 'light';

  applyTheme(theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="box-border w-full min-h-full bg-bg-layout text-text">
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme for design tokens',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      disable: true,
    },
  },
};

export default preview;
