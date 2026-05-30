import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { Input, type InputSize, type InputStatus } from './input';

const inputSizes: InputSize[] = ['sm', 'md', 'lg'];
const inputStatuses: InputStatus[] = ['error', 'warning', 'success'];

const meta: Meta<typeof Input> = {
  title: 'Core/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    status: {
      control: 'select',
      options: [undefined, 'error', 'warning', 'success'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'password'],
    },
  },
  args: {
    placeholder: 'Enter text',
    size: 'md',
    disabled: false,
    type: 'text',
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

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
      <div className="max-w-sm">{children}</div>
    </section>
  );
}

export const Default: Story = {
  render: (args) => <Input {...args} />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Input label="Username" placeholder="Enter username" />
      <Input label="Email" placeholder="Enter email" required />
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        required
        tooltip="Must be at least 8 characters"
      />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Input
        placeholder="Enter username"
        error="Username is required"
        status="error"
        defaultValue="ab"
      />
      <Input
        label="Email"
        placeholder="Enter email"
        error="Please enter a valid email address"
        status="error"
      />
    </div>
  ),
};

export const LabelSizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {inputSizes.map((size) => (
        <Input
          key={size}
          size={size}
          label={`Label ${size}`}
          placeholder={`Size ${size}`}
          required
          tooltip="Help text"
        />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {inputSizes.map((size) => (
        <Input key={size} size={size} placeholder={`Size ${size}`} />
      ))}
    </div>
  ),
};

export const Statuses: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {inputStatuses.map((status) => (
        <Input
          key={status}
          status={status}
          defaultValue="Input value"
          placeholder={`Status ${status}`}
        />
      ))}
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Input type="password" placeholder="Password" defaultValue="secret123" />
      <Input
        type="password"
        placeholder="Disabled password"
        defaultValue="secret123"
        disabled
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Input placeholder="Disabled default" disabled />
      {inputStatuses.map((status) => (
        <Input
          key={status}
          status={status}
          defaultValue="Disabled"
          disabled
        />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <StorySection title="Sizes">
        <div className="flex flex-col gap-3">
          {inputSizes.map((size) => (
            <Input key={size} size={size} placeholder={`Size ${size}`} />
          ))}
        </div>
      </StorySection>

      <StorySection title="Validation states">
        <div className="flex flex-col gap-3">
          {inputStatuses.map((status) => (
            <Input
              key={status}
              status={status}
              defaultValue="Input value"
            />
          ))}
        </div>
      </StorySection>

      <StorySection title="Label">
        <div className="flex flex-col gap-3">
          <Input label="Username" placeholder="Enter username" />
          <Input label="Email" placeholder="Enter email" required />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            required
            tooltip="Must be at least 8 characters"
          />
        </div>
      </StorySection>

      <StorySection title="Label sizes">
        <div className="flex flex-col gap-3">
          {inputSizes.map((size) => (
            <Input
              key={size}
              size={size}
              label={`Label ${size}`}
              placeholder={`Size ${size}`}
              required
              tooltip="Help text"
            />
          ))}
        </div>
      </StorySection>

      <StorySection title="Error message">
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Enter username"
            error="Username is required"
            status="error"
            defaultValue="ab"
          />
          <div className="mb-2" />
          <Input
            label="Email"
            placeholder="Enter email"
            error="Please enter a valid email address"
            status="error"
          />
        </div>
      </StorySection>

      <StorySection title="Password">
        <Input type="password" defaultValue="password123" />
      </StorySection>

      <StorySection title="Disabled">
        <div className="flex flex-col gap-3">
          <Input placeholder="Default" disabled />
          {inputStatuses.map((status) => (
            <Input key={status} status={status} defaultValue="Disabled" disabled />
          ))}
          <Input type="password" defaultValue="password123" disabled />
        </div>
      </StorySection>
    </div>
  ),
};
