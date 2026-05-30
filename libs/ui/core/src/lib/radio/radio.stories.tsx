import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';

import { Radio, type RadioSize } from './radio';

const radioSizes: RadioSize[] = ['sm', 'md', 'lg'];

const meta: Meta<typeof Radio> = {
  title: 'Core/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    size: 'md',
    disabled: false,
    children: 'Radio label',
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;

function StorySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-body-md font-medium text-text">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

export const Default: Story = {
  render: (args) => <Radio {...args} />,
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {radioSizes.map((size) => (
        <StorySection key={size} title={`Size: ${size}`}>
          <Radio size={size} name={`unchecked-${size}`}>
            Unchecked
          </Radio>
          <Radio size={size} name={`checked-${size}`} defaultChecked>
            Checked
          </Radio>
          <Radio size={size} name={`disabled-${size}`} disabled>
            Disabled
          </Radio>
          <Radio size={size} name={`checked-disabled-${size}`} defaultChecked disabled>
            Checked disabled
          </Radio>
        </StorySection>
      ))}
    </div>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Radio name="without-label" aria-label="Option A" />
      <Radio name="without-label" defaultChecked aria-label="Option B" />
    </div>
  ),
};

function ControlledGroupDemo() {
  const [value, setValue] = useState('apple');

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'pear', label: 'Pear' },
    { value: 'orange', label: 'Orange' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <Radio
          key={option.value}
          name="fruit"
          value={option.value}
          checked={value === option.value}
          onChange={(event) => setValue(event.target.value)}
        >
          {option.label}
        </Radio>
      ))}
      <p className="text-body-sm text-text-description">Selected: {value}</p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledGroupDemo />,
};
