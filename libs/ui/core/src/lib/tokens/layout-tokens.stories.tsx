import type { Meta, StoryObj } from '@storybook/react';

import {
  BORDER_RADIUS_TOKENS,
  CONTROL_HEIGHT_TOKENS,
  MARGIN_TOKENS,
  PADDING_TOKENS,
  SCREEN_TOKENS,
  SIZE_TOKENS,
} from './layout-token-meta';
import { LayoutTokenTable } from './layout-token-table';

const meta: Meta = {
  title: 'Tokens/Layout',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Size, control height, margin, padding, border radius, and screen breakpoint tokens. Values sync with tokens.config.ts and tailwind.theme.css.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Size: Story = {
  render: () => <LayoutTokenTable title="Size" rows={SIZE_TOKENS} />,
};

export const ControlHeight: Story = {
  render: () => (
    <LayoutTokenTable title="Height" rows={CONTROL_HEIGHT_TOKENS} />
  ),
};

export const Margin: Story = {
  render: () => <LayoutTokenTable title="Margin" rows={MARGIN_TOKENS} />,
};

export const Padding: Story = {
  render: () => <LayoutTokenTable title="Padding" rows={PADDING_TOKENS} />,
};

export const BorderRadius: Story = {
  render: () => (
    <LayoutTokenTable title="Border Radius" rows={BORDER_RADIUS_TOKENS} />
  ),
};

export const ScreenSize: Story = {
  render: () => (
    <LayoutTokenTable title="Screen Size" rows={SCREEN_TOKENS} />
  ),
};

export const AllLayout: Story = {
  render: () => (
    <div>
      <LayoutTokenTable title="Size" rows={SIZE_TOKENS} />
      <LayoutTokenTable title="Height" rows={CONTROL_HEIGHT_TOKENS} />
      <LayoutTokenTable title="Margin" rows={MARGIN_TOKENS} />
      <LayoutTokenTable title="Padding" rows={PADDING_TOKENS} />
      <LayoutTokenTable title="Border Radius" rows={BORDER_RADIUS_TOKENS} />
      <LayoutTokenTable title="Screen Size" rows={SCREEN_TOKENS} />
    </div>
  ),
};
