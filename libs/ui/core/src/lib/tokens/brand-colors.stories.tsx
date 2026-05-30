import type { Meta, StoryObj } from '@storybook/react';

import {
  BRAND_CONTROL_TOKENS,
  BRAND_ERROR_TOKENS,
  BRAND_INFO_TOKENS,
  BRAND_LINK_TOKENS,
  BRAND_PRIMARY_TOKENS,
  BRAND_SUCCESS_TOKENS,
  BRAND_WARNING_TOKENS,
} from './color-token-meta';
import { ColorTokenTable } from './color-token-table';

const meta: Meta = {
  title: 'Tokens/Colors/Brand',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Brand semantic colors mapped from base palettes or dedicated error values.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: () => (
    <ColorTokenTable title="Primary" rows={BRAND_PRIMARY_TOKENS} />
  ),
};

export const Success: Story = {
  render: () => (
    <ColorTokenTable title="Success" rows={BRAND_SUCCESS_TOKENS} />
  ),
};

export const Warning: Story = {
  render: () => (
    <ColorTokenTable title="Warning" rows={BRAND_WARNING_TOKENS} />
  ),
};

export const Info: Story = {
  render: () => <ColorTokenTable title="Info" rows={BRAND_INFO_TOKENS} />,
};

export const Error: Story = {
  render: () => <ColorTokenTable title="Error" rows={BRAND_ERROR_TOKENS} />,
};

export const Link: Story = {
  render: () => <ColorTokenTable title="Link" rows={BRAND_LINK_TOKENS} />,
};

export const Control: Story = {
  render: () => (
    <ColorTokenTable title="Control" rows={BRAND_CONTROL_TOKENS} />
  ),
};

export const AllBrand: Story = {
  render: () => (
    <div>
      <ColorTokenTable title="Primary" rows={BRAND_PRIMARY_TOKENS} />
      <ColorTokenTable title="Success" rows={BRAND_SUCCESS_TOKENS} />
      <ColorTokenTable title="Warning" rows={BRAND_WARNING_TOKENS} />
      <ColorTokenTable title="Info" rows={BRAND_INFO_TOKENS} />
      <ColorTokenTable title="Error" rows={BRAND_ERROR_TOKENS} />
      <ColorTokenTable title="Link" rows={BRAND_LINK_TOKENS} />
      <ColorTokenTable title="Control" rows={BRAND_CONTROL_TOKENS} />
    </div>
  ),
};
