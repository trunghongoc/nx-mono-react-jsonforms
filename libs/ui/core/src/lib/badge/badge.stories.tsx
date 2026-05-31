import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { Badge, type BadgeType, type BadgeVariant } from './badge';

const badgeVariants: BadgeVariant[] = ['dot', 'md', 'sm'];
const badgeTypes: BadgeType[] = [
  'default',
  'success',
  'error',
  'primary',
  'warning',
];

const meta: Meta<typeof Badge> = {
  title: 'Core/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['dot', 'md', 'sm'],
    },
    type: {
      control: 'select',
      options: ['default', 'success', 'error', 'primary', 'warning'],
    },
    value: { control: 'text' },
    maxNumber: { control: 'number' },
  },
  args: {
    variant: 'md',
    type: 'default',
    value: 5,
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

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
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  );
}

export const Default: Story = {
  render: (args) => <Badge {...args} />,
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {badgeVariants.map((variant) => (
        <StorySection key={variant} title={`Variant: ${variant}`}>
          {badgeTypes.map((type) => (
            <Badge
              key={type}
              variant={variant}
              type={type}
              value={variant === 'dot' ? undefined : 99}
              maxNumber={variant === 'dot' ? undefined : 98}
              aria-label={variant === 'dot' ? `${type} dot badge` : undefined}
            />
          ))}
        </StorySection>
      ))}
    </div>
  ),
};

export const CountExamples: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="md" type="error" value={1} />
      <Badge variant="md" type="error" value={12} />
      <Badge variant="md" type="error" value={101} maxNumber={99} />
      <Badge variant="sm" type="primary" value="New" />
    </div>
  ),
};

export const MaxNumber: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="md" type="error" value={101} maxNumber={100} />
      <Badge variant="md" type="error" value={100} maxNumber={100} />
      <Badge variant="md" type="error" value={19} maxNumber={20} />
      <Badge variant="md" type="error" value={222222} maxNumber={999} />
    </div>
  ),
};

export const OnBackground: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6 rounded-border bg-fill-secondary p-padding-lg">
      <div className="relative inline-flex">
        <span className="inline-flex size-size-lg items-center justify-center rounded-full bg-primary text-body-md text-text-light-solid">
          A
        </span>
        <Badge
          variant="dot"
          type="error"
          className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
          aria-label="Unread"
        />
      </div>
      <div className="relative inline-flex">
        <span className="inline-flex size-size-lg items-center justify-center rounded-full bg-primary text-body-md text-text-light-solid">
          B
        </span>
        <Badge
          variant="md"
          type="error"
          className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
          value={3}
        />
      </div>
    </div>
  ),
};
