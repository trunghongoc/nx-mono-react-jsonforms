import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Checkbox } from './checkbox';
import {
  CheckboxGroup,
  type CheckboxGroupDirection,
  type CheckboxGroupProps,
  type CheckboxGroupType,
} from './checkbox-group';

const groupTypes: CheckboxGroupType[] = ['primary', 'default', 'dashed'];
const directions: CheckboxGroupDirection[] = ['horizontal', 'vertical'];

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Core/CheckboxGroup',
  component: CheckboxGroup,
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
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

const renderGroupCheckboxes = () => (
  <>
    <Checkbox>One</Checkbox>
    <Checkbox>Two</Checkbox>
    <Checkbox defaultChecked>Three</Checkbox>
  </>
);

export const Horizontal: Story = {
  args: {
    type: 'default',
    direction: 'horizontal',
  },
  render: (args) => (
    <CheckboxGroup {...args}>{renderGroupCheckboxes()}</CheckboxGroup>
  ),
};

export const Vertical: Story = {
  args: {
    type: 'default',
    direction: 'vertical',
  },
  render: (args) => (
    <CheckboxGroup {...args}>{renderGroupCheckboxes()}</CheckboxGroup>
  ),
};

export const Primary: Story = {
  args: {
    type: 'primary',
  },
  render: (args) => (
    <CheckboxGroup {...args}>{renderGroupCheckboxes()}</CheckboxGroup>
  ),
};

export const Dashed: Story = {
  args: {
    type: 'dashed',
  },
  render: (args) => (
    <CheckboxGroup {...args}>{renderGroupCheckboxes()}</CheckboxGroup>
  ),
};

export const Danger: Story = {
  args: {
    type: 'primary',
    danger: true,
  },
  render: (args) => (
    <CheckboxGroup {...args}>{renderGroupCheckboxes()}</CheckboxGroup>
  ),
};

export const Small: Story = {
  args: {
    size: 'sm',
    type: 'default',
  },
  render: (args) => (
    <CheckboxGroup {...args}>{renderGroupCheckboxes()}</CheckboxGroup>
  ),
};

export const Large: Story = {
  args: {
    size: 'lg',
    type: 'primary',
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Checkbox defaultChecked>One</Checkbox>
      <Checkbox defaultChecked>Two</Checkbox>
      <Checkbox defaultChecked>Three</Checkbox>
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    type: 'default',
  },
  render: (args) => (
    <CheckboxGroup {...args}>{renderGroupCheckboxes()}</CheckboxGroup>
  ),
};

const groupOptions = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
] as const;

function InteractiveCheckboxGroup(args: CheckboxGroupProps) {
  const [selected, setSelected] = useState<string[]>(['two']);

  const toggle = (value: string) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <CheckboxGroup {...args}>
        {groupOptions.map((option) => (
          <Checkbox
            key={option.value}
            checked={selected.includes(option.value)}
            onChange={() => toggle(option.value)}
          >
            {option.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
      <p className="text-body-sm text-text-description">
        Selected:{' '}
        {selected.length > 0 ? selected.join(', ') : 'none'}
      </p>
    </div>
  );
}

function TypePrimaryWithDisabledDemo() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (value: string) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <CheckboxGroup type="primary" direction="horizontal">
        <Checkbox
          checked={selected.includes('one')}
          onChange={() => toggle('one')}
        >
          One
        </Checkbox>
        <Checkbox
          checked={selected.includes('two')}
          onChange={() => toggle('two')}
        >
          Two
        </Checkbox>
        <Checkbox
          checked={selected.includes('three')}
          onChange={() => toggle('three')}
        >
          Three
        </Checkbox>
        <Checkbox disabled>Four (disabled)</Checkbox>
      </CheckboxGroup>
      <p className="text-body-sm text-text-description">
        Unchecked items use default style. Checked items use primary. Disabled
        item always uses disabled style. Selected:{' '}
        {selected.length > 0 ? selected.join(', ') : 'none'}
      </p>
    </div>
  );
}

export const TypePrimaryWithDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'type=primary: unchecked items are default, checked items are primary, disabled item stays disabled.',
      },
    },
  },
  render: () => <TypePrimaryWithDisabledDemo />,
};

export const Interactive: Story = {
  args: {
    type: 'primary',
    direction: 'horizontal',
    size: 'md',
    danger: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Click to toggle. Unchecked = default style. Checked = style from group `type`.',
      },
    },
  },
  render: (args) => <InteractiveCheckboxGroup {...args} />,
};

export const MixedTypes: Story = {
  render: () => (
    <CheckboxGroup type="default">
      <Checkbox>Left</Checkbox>
      <Checkbox type="primary" defaultChecked>
        Selected
      </Checkbox>
      <Checkbox>Right</Checkbox>
    </CheckboxGroup>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {groupTypes.map((type) => (
        <div key={type} className="flex flex-col gap-3">
          <span className="text-body-sm text-text-description">{type}</span>
          <div className="flex flex-wrap items-start gap-6">
            <CheckboxGroup type={type} direction="horizontal">
              {renderGroupCheckboxes()}
            </CheckboxGroup>
            <CheckboxGroup type={type} direction="vertical">
              {renderGroupCheckboxes()}
            </CheckboxGroup>
            <CheckboxGroup type={type} direction="horizontal" danger>
              {renderGroupCheckboxes()}
            </CheckboxGroup>
          </div>
        </div>
      ))}
    </div>
  ),
};
