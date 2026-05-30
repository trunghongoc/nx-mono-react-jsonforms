import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Radio } from './radio';
import {
  RadioGroup,
  type RadioGroupDirection,
  type RadioGroupProps,
  type RadioGroupType,
} from './radio-group';

const groupTypes: RadioGroupType[] = ['primary', 'default', 'dashed'];
const directions: RadioGroupDirection[] = ['horizontal', 'vertical'];

const meta: Meta<typeof RadioGroup> = {
  title: 'Core/RadioGroup',
  component: RadioGroup,
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

type Story = StoryObj<typeof RadioGroup>;

const renderGroupRadios = () => (
  <>
    <Radio value="one">One</Radio>
    <Radio value="two">Two</Radio>
    <Radio value="three" defaultChecked>
      Three
    </Radio>
  </>
);

export const Horizontal: Story = {
  args: {
    type: 'default',
    direction: 'horizontal',
  },
  render: (args) => (
    <RadioGroup {...args}>{renderGroupRadios()}</RadioGroup>
  ),
};

export const Vertical: Story = {
  args: {
    type: 'default',
    direction: 'vertical',
  },
  render: (args) => (
    <RadioGroup {...args}>{renderGroupRadios()}</RadioGroup>
  ),
};

export const Primary: Story = {
  args: {
    type: 'primary',
  },
  render: (args) => (
    <RadioGroup {...args}>{renderGroupRadios()}</RadioGroup>
  ),
};

export const Dashed: Story = {
  args: {
    type: 'dashed',
  },
  render: (args) => (
    <RadioGroup {...args}>{renderGroupRadios()}</RadioGroup>
  ),
};

export const Danger: Story = {
  args: {
    type: 'primary',
    danger: true,
  },
  render: (args) => (
    <RadioGroup {...args}>{renderGroupRadios()}</RadioGroup>
  ),
};

export const Small: Story = {
  args: {
    size: 'sm',
    type: 'default',
  },
  render: (args) => (
    <RadioGroup {...args}>{renderGroupRadios()}</RadioGroup>
  ),
};

export const Large: Story = {
  args: {
    size: 'lg',
    type: 'primary',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="one" defaultChecked>
        One
      </Radio>
      <Radio value="two">Two</Radio>
      <Radio value="three">Three</Radio>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    type: 'default',
  },
  render: (args) => (
    <RadioGroup {...args}>{renderGroupRadios()}</RadioGroup>
  ),
};

const groupOptions = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
] as const;

function InteractiveRadioGroup(args: RadioGroupProps) {
  const [selected, setSelected] = useState('two');

  return (
    <div className="flex flex-col gap-4">
      <RadioGroup {...args}>
        {groupOptions.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            checked={selected === option.value}
            onChange={(event) => setSelected(event.target.value)}
          >
            {option.label}
          </Radio>
        ))}
      </RadioGroup>
      <p className="text-body-sm text-text-description">
        Selected: {selected}
      </p>
    </div>
  );
}

function TypePrimaryWithDisabledDemo() {
  const [selected, setSelected] = useState('one');

  return (
    <div className="flex flex-col gap-4">
      <RadioGroup type="primary" direction="horizontal">
        <Radio
          value="one"
          checked={selected === 'one'}
          onChange={(event) => setSelected(event.target.value)}
        >
          One
        </Radio>
        <Radio
          value="two"
          checked={selected === 'two'}
          onChange={(event) => setSelected(event.target.value)}
        >
          Two
        </Radio>
        <Radio
          value="three"
          checked={selected === 'three'}
          onChange={(event) => setSelected(event.target.value)}
        >
          Three
        </Radio>
        <Radio value="four" disabled>
          Four (disabled)
        </Radio>
      </RadioGroup>
      <p className="text-body-sm text-text-description">
        Unchecked items use default style. Checked item uses primary. Disabled
        item always uses disabled style. Selected: {selected}
      </p>
    </div>
  );
}

export const TypePrimaryWithDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'type=primary: unchecked items are default, checked item is primary, disabled item stays disabled.',
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
          'Click to select. Unchecked = default style. Checked = style from group `type`.',
      },
    },
  },
  render: (args) => <InteractiveRadioGroup {...args} />,
};

export const MixedTypes: Story = {
  render: () => (
    <RadioGroup type="default">
      <Radio value="left">Left</Radio>
      <Radio value="selected" type="primary" defaultChecked>
        Selected
      </Radio>
      <Radio value="right">Right</Radio>
    </RadioGroup>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {groupTypes.map((type) => (
        <div key={type} className="flex flex-col gap-3">
          <span className="text-body-sm text-text-description">{type}</span>
          <div className="flex flex-wrap items-start gap-6">
            <RadioGroup type={type} direction="horizontal">
              {renderGroupRadios()}
            </RadioGroup>
            <RadioGroup type={type} direction="vertical">
              {renderGroupRadios()}
            </RadioGroup>
            <RadioGroup type={type} direction="horizontal" danger>
              {renderGroupRadios()}
            </RadioGroup>
          </div>
        </div>
      ))}
    </div>
  ),
};
