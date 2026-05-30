import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import {
  ButtonGroup,
  type ButtonGroupDirection,
  type ButtonGroupType,
} from './button-group';

const groupTypes: ButtonGroupType[] = ['primary', 'default', 'dashed'];
const directions: ButtonGroupDirection[] = ['horizontal', 'vertical'];

const meta: Meta<typeof ButtonGroup> = {
  title: 'Core/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: directions,
    },
    type: {
      control: 'select',
      options: groupTypes,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    danger: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

const renderGroupButtons = () => (
  <>
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </>
);

export const Horizontal: Story = {
  args: {
    type: 'default',
    direction: 'horizontal',
  },
  render: (args) => (
    <ButtonGroup {...args}>{renderGroupButtons()}</ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: {
    type: 'default',
    direction: 'vertical',
  },
  render: (args) => (
    <ButtonGroup {...args}>{renderGroupButtons()}</ButtonGroup>
  ),
};

export const Primary: Story = {
  args: {
    type: 'primary',
  },
  render: (args) => (
    <ButtonGroup {...args}>{renderGroupButtons()}</ButtonGroup>
  ),
};

export const Dashed: Story = {
  args: {
    type: 'dashed',
  },
  render: (args) => (
    <ButtonGroup {...args}>{renderGroupButtons()}</ButtonGroup>
  ),
};

export const Danger: Story = {
  args: {
    type: 'primary',
    danger: true,
  },
  render: (args) => (
    <ButtonGroup {...args}>{renderGroupButtons()}</ButtonGroup>
  ),
};

export const Small: Story = {
  args: {
    size: 'sm',
    type: 'default',
  },
  render: (args) => (
    <ButtonGroup {...args}>{renderGroupButtons()}</ButtonGroup>
  ),
};

export const Large: Story = {
  args: {
    size: 'lg',
    type: 'primary',
  },
  render: (args) => (
    <ButtonGroup {...args}>{renderGroupButtons()}</ButtonGroup>
  ),
};

export const MixedTypes: Story = {
  render: () => (
    <ButtonGroup type="default">
      <Button>Left</Button>
      <Button type="primary">Primary</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {groupTypes.map((type) => (
        <div key={type} className="flex flex-col gap-3">
          <span className="text-body-sm text-text-description">{type}</span>
          <div className="flex flex-wrap items-start gap-6">
            <ButtonGroup type={type} direction="horizontal">
              {renderGroupButtons()}
            </ButtonGroup>
            <ButtonGroup type={type} direction="vertical">
              {renderGroupButtons()}
            </ButtonGroup>
            <ButtonGroup type={type} direction="horizontal" danger>
              {renderGroupButtons()}
            </ButtonGroup>
          </div>
        </div>
      ))}
    </div>
  ),
};
