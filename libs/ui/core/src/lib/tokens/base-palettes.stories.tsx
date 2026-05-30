import type { Meta, StoryObj } from '@storybook/react';

import {
  BASE_PALETTE_NAMES,
  BASE_PALETTE_TITLES,
} from './color-token-meta';
import { BasePaletteTable } from './color-token-table';

const meta: Meta = {
  title: 'Tokens/Colors/Base Palettes',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Base color palettes with 10 steps each. Step 1 is the lightest tint; step 10 is the darkest shade.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-text">Base Color Palettes</h1>
      <p className="max-w-3xl text-text-secondary">
        Twelve base palettes used across the design system. Each palette provides
        light and dark theme values from step 1 to 10.
      </p>
    </div>
  ),
};

export const Blue: Story = {
  render: () => (
    <BasePaletteTable paletteName="blue" title={BASE_PALETTE_TITLES.blue} />
  ),
};

export const Cyan: Story = {
  render: () => (
    <BasePaletteTable paletteName="cyan" title={BASE_PALETTE_TITLES.cyan} />
  ),
};

export const GeekBlue: Story = {
  render: () => (
    <BasePaletteTable
      paletteName="geekblue"
      title={BASE_PALETTE_TITLES.geekblue}
    />
  ),
};

export const Gold: Story = {
  render: () => (
    <BasePaletteTable paletteName="gold" title={BASE_PALETTE_TITLES.gold} />
  ),
};

export const Green: Story = {
  render: () => (
    <BasePaletteTable paletteName="green" title={BASE_PALETTE_TITLES.green} />
  ),
};

export const Lime: Story = {
  render: () => (
    <BasePaletteTable paletteName="lime" title={BASE_PALETTE_TITLES.lime} />
  ),
};

export const Magenta: Story = {
  render: () => (
    <BasePaletteTable
      paletteName="magenta"
      title={BASE_PALETTE_TITLES.magenta}
    />
  ),
};

export const Orange: Story = {
  render: () => (
    <BasePaletteTable paletteName="orange" title={BASE_PALETTE_TITLES.orange} />
  ),
};

export const Purple: Story = {
  render: () => (
    <BasePaletteTable paletteName="purple" title={BASE_PALETTE_TITLES.purple} />
  ),
};

export const Red: Story = {
  render: () => (
    <BasePaletteTable paletteName="red" title={BASE_PALETTE_TITLES.red} />
  ),
};

export const Volcano: Story = {
  render: () => (
    <BasePaletteTable
      paletteName="volcano"
      title={BASE_PALETTE_TITLES.volcano}
    />
  ),
};

export const Yellow: Story = {
  render: () => (
    <BasePaletteTable paletteName="yellow" title={BASE_PALETTE_TITLES.yellow} />
  ),
};

export const AllPalettes: Story = {
  render: () => (
    <div>
      {BASE_PALETTE_NAMES.map((name) => (
        <BasePaletteTable
          key={name}
          paletteName={name}
          title={BASE_PALETTE_TITLES[name]}
        />
      ))}
    </div>
  ),
};
