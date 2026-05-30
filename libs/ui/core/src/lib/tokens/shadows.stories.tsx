import type { Meta, StoryObj } from '@storybook/react';

import tokens from '../../tokens.config';

const meta: Meta = {
  title: 'Tokens/Shadows',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Box-shadow tokens for depth, hierarchy, and materiality in the UI.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const SHADOW_ROWS = [
  {
    name: 'boxShadow',
    token: 'shadow-box',
    value: tokens.shadow.boxShadow,
    description: 'General control shadow — e.g. Cookie banner.',
  },
  {
    name: 'boxShadowSecondary',
    token: 'shadow-box-secondary',
    value: tokens.shadow.boxShadowSecondary,
    description:
      'Most intense element shadow — e.g. FloatButton, Dropdown, Cascader.',
  },
  {
    name: 'boxShadowTertiary',
    token: 'shadow-box-tertiary',
    value: tokens.shadow.boxShadowTertiary,
    description:
      'Smoothest element shadow — e.g. Action Panel, Login/Signup forms.',
  },
] as const;

function ShadowPreview({
  name,
  token,
  value,
  description,
}: (typeof SHADOW_ROWS)[number]) {
  return (
    <div className="mb-margin-lg">
      <div className="mb-margin-xs flex flex-wrap items-baseline gap-margin-sm">
        <code className="text-body-md font-medium text-text">{name}</code>
        <code className="text-body-sm text-text-tertiary">{token}</code>
      </div>
      <p className="mb-margin-sm text-body-sm text-text-secondary">
        {description}
      </p>
      <div
        className={`flex h-24 w-48 items-center justify-center rounded-border-lg bg-bg-container ${token}`}
      >
        <span className="text-body-sm text-text-tertiary">Preview</span>
      </div>
      <pre className="mt-margin-sm overflow-x-auto rounded-border-sm bg-bg-layout p-padding-sm text-body-sm text-text-secondary">
        {value}
      </pre>
    </div>
  );
}

export const AllShadows: Story = {
  render: () => (
    <div>
      <h2 className="mb-margin-lg text-heading-4 text-text">Shadows</h2>
      {SHADOW_ROWS.map((row) => (
        <ShadowPreview key={row.name} {...row} />
      ))}
    </div>
  ),
};
