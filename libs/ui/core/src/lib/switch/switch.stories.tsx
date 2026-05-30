import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';

import { Switch, type SwitchSize } from './switch';

const switchSizes: SwitchSize[] = ['sm', 'md', 'lg'];

const meta: Meta<typeof Switch> = {
  title: 'Core/Switch',
  component: Switch,
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
    children: 'Switch label',
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

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
  render: (args) => <Switch {...args} />,
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {switchSizes.map((size) => (
        <StorySection key={size} title={`Size: ${size}`}>
          <Switch size={size}>Off</Switch>
          <Switch size={size} defaultChecked>
            On
          </Switch>
          <Switch size={size} disabled>
            Disabled off
          </Switch>
          <Switch size={size} defaultChecked disabled>
            Disabled on
          </Switch>
        </StorySection>
      ))}
    </div>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch aria-label="Notifications off" />
      <Switch defaultChecked aria-label="Notifications on" />
      <Switch disabled aria-label="Notifications disabled" />
    </div>
  ),
};

function ControlledDemo() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Switch
        checked={enabled}
        onChange={(event) => setEnabled(event.target.checked)}
      >
        Enable feature
      </Switch>
      <p className="text-body-sm text-text-description">
        Status: {enabled ? 'enabled' : 'disabled'}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
