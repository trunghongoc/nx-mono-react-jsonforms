import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';

import { Icon } from '../icon';
import { EmailInput } from './email-input';
import { Input, type InputSize, type InputStatus } from './input';
import { NumberInput } from './number-input';
import { TextArea } from './textarea';

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
      options: ['text', 'password', 'textarea'],
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

export const WithPrefix: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Input
        prefix={<Icon name="user" size={16} />}
        placeholder="Username"
      />
      <Input
        prefix={<Icon name="user" size={16} />}
        label="Username"
        placeholder="Enter username"
        required
      />
      <Input
        prefix="$"
        placeholder="Amount"
        defaultValue="100"
      />
      <Input
        prefix={<Icon name="user" size={16} />}
        placeholder="With status"
        status="success"
        defaultValue="valid-user"
      />
      <Input
        prefix={<Icon name="user" size={16} />}
        type="password"
        placeholder="Password"
        defaultValue="secret123"
      />
      <Input
        prefix={<Icon name="user" size={16} />}
        placeholder="Disabled"
        disabled
        defaultValue="readonly"
      />
    </div>
  ),
};

export const Textarea: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Input
        type="textarea"
        placeholder="Description"
        defaultValue={'Line one\nLine two'}
      />
      <TextArea placeholder="Using TextArea component" />
      <TextArea
        label="Bio"
        placeholder="Tell us about yourself"
        required
        defaultValue="Short bio text."
      />
      {inputSizes.map((size) => (
        <TextArea
          key={size}
          size={size}
          placeholder={`Size ${size}`}
          defaultValue={`Textarea size ${size}`}
        />
      ))}
      <TextArea
        status="success"
        defaultValue="Valid content"
        placeholder="With status"
      />
      <TextArea
        prefix={<Icon name="edit" size={16} />}
        label="Notes"
        placeholder="Add notes"
      />
      <TextArea placeholder="Disabled" disabled defaultValue="Cannot edit" />
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

export const Emails: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <EmailInput placeholder="Enter email" />
      <EmailInput
        label="Email"
        placeholder="name@example.com"
        required
        autoComplete="email"
      />
      <EmailInput
        prefix={<Icon name="mail" size={16} />}
        label="Work email"
        placeholder="you@company.com"
        defaultValue="user@example.com"
      />
      <EmailInput
        label="Email"
        status="error"
        error="Please enter a valid email address"
        defaultValue="invalid-email"
      />
      <EmailInput
        placeholder="Disabled"
        defaultValue="user@example.com"
        disabled
      />
    </div>
  ),
};

function AgeInputWithValidation() {
  const [value, setValue] = useState('16');
  const age = Number(value);
  const hasError = value !== '' && !Number.isNaN(age) && age < 18;

  return (
    <NumberInput
      label="Age"
      status={hasError ? 'error' : undefined}
      error={hasError ? 'Must be at least 18' : undefined}
      min={18}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

function FormattedAmountInput() {
  const [value, setValue] = useState('1234567.789');

  return (
    <div className="flex flex-col gap-1">
      <NumberInput
        label="Amount (formatted)"
        prefix="$"
        format={{ decimal: 2, round: 'ceil' }}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p className="text-body-sm text-text-secondary">Raw value: {value}</p>
    </div>
  );
}

export const Numbers: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <NumberInput placeholder="Enter amount" />
      <NumberInput
        label="Quantity"
        placeholder="0"
        min={0}
        max={100}
        step={1}
        defaultValue={1}
        required
      />
      <NumberInput
        prefix="$"
        placeholder="Price"
        min={0}
        step={0.01}
        defaultValue={99.99}
      />
      <FormattedAmountInput />
      <NumberInput
        label="Price (floor)"
        prefix="$"
        format={{ decimal: 2, round: 'floor' }}
        defaultValue={1234567.899}
      />
      <NumberInput
        label="Price (no rounding)"
        prefix="$"
        format={{ decimal: 2, round: 'none' }}
        defaultValue={1234567.899}
      />
      <AgeInputWithValidation />
      <NumberInput placeholder="Disabled" defaultValue={42} disabled />
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

      <StorySection title="Prefix">
        <div className="flex flex-col gap-3">
          <Input
            prefix={<Icon name="user" size={16} />}
            placeholder="Username"
          />
          <Input
            prefix={<Icon name="user" size={16} />}
            label="Email"
            placeholder="Enter email"
          />
        </div>
      </StorySection>

      <StorySection title="Textarea">
        <div className="flex flex-col gap-3">
          <Input type="textarea" placeholder="Via Input type=textarea" />
          <TextArea placeholder="Via TextArea" />
          {inputSizes.map((size) => (
            <TextArea key={size} size={size} placeholder={`Size ${size}`} />
          ))}
        </div>
      </StorySection>

      <StorySection title="Password">
        <Input type="password" defaultValue="password123" />
      </StorySection>

      <StorySection title="Email">
        <div className="flex flex-col gap-3">
          <EmailInput placeholder="Enter email" />
          <EmailInput
            label="Email"
            placeholder="name@example.com"
            required
          />
          <EmailInput
            prefix={<Icon name="mail" size={16} />}
            defaultValue="user@example.com"
          />
        </div>
      </StorySection>

      <StorySection title="Number">
        <div className="flex flex-col gap-3">
          <NumberInput placeholder="Enter amount" />
          <NumberInput
            label="Quantity"
            min={0}
            max={100}
            defaultValue={1}
          />
          <NumberInput
            prefix="$"
            min={0}
            step={0.01}
            defaultValue={99.99}
          />
          <NumberInput
            label="Formatted amount"
            prefix="$"
            format={{ decimal: 2 }}
            defaultValue={1234567.89}
          />
        </div>
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
