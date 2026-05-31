import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { Ribbon, type RibbonPlacement, type RibbonType } from './ribbon';

const ribbonPlacements: RibbonPlacement[] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

const ribbonTypes: RibbonType[] = [
  'blue',
  'volcano',
  'magenta',
  'dust-red',
  'cyan',
  'green',
  'purple',
];

const ribbonTypeLabels: Record<RibbonType, string> = {
  blue: 'Daybreak Blue',
  volcano: 'Volcano',
  magenta: 'Magenta',
  'dust-red': 'Dust Red',
  cyan: 'Cyan',
  green: 'Polar Green',
  purple: 'Golden Purple',
};

const meta: Meta<typeof Ribbon> = {
  title: 'Core/Ribbon',
  component: Ribbon,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ribbonTypes,
    },
    value: { control: 'text' },
    placement: {
      control: 'select',
      options: ribbonPlacements,
    },
  },
  args: {
    type: 'blue',
    placement: 'bottom-right',
    value: 'Ribbon',
  },
};

export default meta;

type Story = StoryObj<typeof Ribbon>;

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
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}

export const Default: Story = {
  render: (args) => <Ribbon {...args} />,
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {ribbonTypes.map((type) => (
        <div key={type} className="flex items-start gap-6">
          <span className="w-32 shrink-0 text-body-md text-text-secondary">
            {ribbonTypeLabels[type]}
          </span>
          <Ribbon type={type} value="Ribbon" />
        </div>
      ))}
    </div>
  ),
};

export const ValueExamples: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Ribbon type="blue" value="Ribbon" />
      <Ribbon type="volcano" value={42} />
      <Ribbon type="magenta" value={<strong>New</strong>} />
    </div>
  ),
};

export const OnBackground: Story = {
  render: () => (
    <StorySection title="On elevated surface">
      <div className="rounded-border bg-bg-elevated p-padding-lg">
        <Ribbon type="green" value="Published" />
      </div>
    </StorySection>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {ribbonPlacements.map((placement) => (
        <div key={placement} className="flex items-start gap-6">
          <span className="w-28 shrink-0 text-body-md text-text-secondary">
            {placement}
          </span>
          <Ribbon type="blue" placement={placement} value="Ribbon" />
        </div>
      ))}
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Ribbon
        value="Custom bg"
        background="#531dab"
        color="#ffffff"
      />
      <Ribbon
        value="Dark text"
        type="cyan"
        color="#001d66"
      />
      <Ribbon
        value="Brand"
        background="linear-gradient(90deg, #1677ff, #722ed1)"
        color="#fff"
      />
    </div>
  ),
};
