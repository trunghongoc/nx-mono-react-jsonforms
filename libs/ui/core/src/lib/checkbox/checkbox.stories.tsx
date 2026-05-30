import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';

import { Checkbox, type CheckboxSize } from './checkbox';

const checkboxSizes: CheckboxSize[] = ['sm', 'md', 'lg'];

const meta: Meta<typeof Checkbox> = {
  title: 'Core/Checkbox',
  component: Checkbox,
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
    indeterminate: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    size: 'md',
    disabled: false,
    indeterminate: false,
    children: 'Checkbox label',
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

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
  render: (args) => <Checkbox {...args} />,
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {checkboxSizes.map((size) => (
        <StorySection key={size} title={`Size: ${size}`}>
          <Checkbox size={size}>Unchecked</Checkbox>
          <Checkbox size={size} defaultChecked>
            Checked
          </Checkbox>
          <Checkbox size={size} indeterminate>
            Indeterminate
          </Checkbox>
          <Checkbox size={size} disabled>
            Disabled
          </Checkbox>
          <Checkbox size={size} defaultChecked disabled>
            Checked disabled
          </Checkbox>
          <Checkbox size={size} indeterminate disabled>
            Indeterminate disabled
          </Checkbox>
        </StorySection>
      ))}
    </div>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="Option A" />
      <Checkbox defaultChecked aria-label="Option B" />
      <Checkbox indeterminate aria-label="Option C" />
    </div>
  ),
};

function ControlledGroupDemo() {
  const [checkedList, setCheckedList] = useState(['Apple']);

  const options = ['Apple', 'Pear', 'Orange'];
  const allChecked = options.every((item) => checkedList.includes(item));
  const indeterminate =
    checkedList.length > 0 && checkedList.length < options.length;

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        indeterminate={indeterminate}
        checked={allChecked}
        onChange={(event) => {
          setCheckedList(event.target.checked ? options : []);
        }}
      >
        Check all
      </Checkbox>
      <div className="ml-6 flex flex-col gap-2">
        {options.map((option) => (
          <Checkbox
            key={option}
            checked={checkedList.includes(option)}
            onChange={(event) => {
              setCheckedList((prev) =>
                event.target.checked
                  ? [...prev, option]
                  : prev.filter((item) => item !== option)
              );
            }}
          >
            {option}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}

export const CheckAll: Story = {
  render: () => <ControlledGroupDemo />,
};
