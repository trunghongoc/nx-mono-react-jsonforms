import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from '../icon';
import { Span } from '../text';
import { Divider } from './divider';

const meta: Meta<typeof Divider> = {
  title: 'Core/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['center', 'left', 'right'],
    },
    dashed: { control: 'boolean' },
    width: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Divider>;

const labelWithIconAndText = (
  <span className="inline-flex items-center gap-1.5">
    <Icon name="user" size="sm" />
    <Span type="secondary" size="sm">
      Profile
    </Span>
  </span>
);

export const Default: Story = {
  render: () => (
    <div className="w-full py-8">
      <Divider />
    </div>
  ),
};

export const Dashed: Story = {
  render: () => (
    <div className="w-full py-8">
      <Divider dashed />
    </div>
  ),
};

export const CustomWidth: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-8 py-8">
      <Divider width="100%" />
      <Divider width={240} />
      <Divider width="50%" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-full py-8">
      <Divider label="Center label" />
    </div>
  ),
};

export const LabelAlignLeft: Story = {
  render: () => (
    <div className="w-full py-8">
      <Divider label="Left label" align="left" />
    </div>
  ),
};

export const LabelAlignRight: Story = {
  render: () => (
    <div className="w-full py-8">
      <Divider label="Right label" align="right" />
    </div>
  ),
};

export const DashedWithLabel: Story = {
  render: () => (
    <div className="w-full py-8">
      <Divider dashed label="Dashed divider" />
    </div>
  ),
};

export const CustomLabelNode: Story = {
  render: () => (
    <div className="w-full py-8">
      <Divider
        label={
          <Span type="secondary" size="sm">
            Custom node
          </Span>
        }
      />
    </div>
  ),
};

export const LabelWithIconAndText: Story = {
  render: () => (
    <div className="w-full py-8">
      <Divider label={labelWithIconAndText} />
    </div>
  ),
};

export const CustomClassName: Story = {
  render: () => (
    <div className="w-full py-8">
      <Divider className="w-full" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-10 py-8">
      <Divider />
      <Divider dashed />
      <Divider label="Center" />
      <Divider label="Left" align="left" />
      <Divider label="Right" align="right" />
      <Divider dashed label="Dashed with label" />
      <Divider label={labelWithIconAndText} />
    </div>
  ),
};
