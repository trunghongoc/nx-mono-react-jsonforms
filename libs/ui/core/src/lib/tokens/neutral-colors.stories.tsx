import type { Meta, StoryObj } from '@storybook/react';

import {
  NEUTRAL_BG_TOKENS,
  NEUTRAL_BORDER_TOKENS,
  NEUTRAL_FILL_TOKENS,
  NEUTRAL_ICON_TOKENS,
  NEUTRAL_TEXT_TOKENS,
} from './color-token-meta';
import { ColorTokenTable } from './color-token-table';

const meta: Meta = {
  title: 'Tokens/Colors/Neutral',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Neutral colors for text, icons, backgrounds, borders, and fills in light and dark themes.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Text: Story = {
  render: () => <ColorTokenTable title="Text" rows={NEUTRAL_TEXT_TOKENS} />,
};

export const Icon: Story = {
  render: () => <ColorTokenTable title="Icon" rows={NEUTRAL_ICON_TOKENS} />,
};

export const Background: Story = {
  render: () => <ColorTokenTable title="Background" rows={NEUTRAL_BG_TOKENS} />,
};

export const Border: Story = {
  render: () => <ColorTokenTable title="Border" rows={NEUTRAL_BORDER_TOKENS} />,
};

export const Fill: Story = {
  render: () => <ColorTokenTable title="Fill" rows={NEUTRAL_FILL_TOKENS} />,
};

export const AllNeutral: Story = {
  render: () => (
    <div>
      <ColorTokenTable title="Text" rows={NEUTRAL_TEXT_TOKENS} />
      <ColorTokenTable title="Icon" rows={NEUTRAL_ICON_TOKENS} />
      <ColorTokenTable title="Background" rows={NEUTRAL_BG_TOKENS} />
      <ColorTokenTable title="Border" rows={NEUTRAL_BORDER_TOKENS} />
      <ColorTokenTable title="Fill" rows={NEUTRAL_FILL_TOKENS} />
    </div>
  ),
};
