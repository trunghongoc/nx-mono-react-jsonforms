import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Button } from '../button';
import { Popover, type PopoverPlace } from './index';

const meta: Meta<typeof Popover> = {
  title: 'Core/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

const sampleContent =
  'Conveniently initiate viral synergy without multi functional platforms.';

function PlacementDemo({
  label,
  place,
}: {
  label: string;
  place: PopoverPlace;
}) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-28 text-body-sm text-text-description">{label}</span>
      <Popover
        anchor={<Button type="default">Trigger</Button>}
        title="Popover title"
        place={place}
        defaultOpen
        trigger="click"
      >
        {sampleContent}
      </Popover>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <Popover
      anchor={<Button type="primary">Hover me</Button>}
      title="Popover title"
      place="top"
    >
      {sampleContent}
    </Popover>
  ),
};

export const AllPlacements: Story = {
  render: () => (
    <div className="flex flex-col gap-10 py-8">
      <PlacementDemo label="Right Top" place="rightTop" />
      <PlacementDemo label="Top Left" place="topLeft" />
      <PlacementDemo label="Top" place="top" />
      <PlacementDemo label="Top Right" place="topRight" />
      <PlacementDemo label="Bottom Left" place="bottomLeft" />
      <PlacementDemo label="Bottom" place="bottom" />
      <PlacementDemo label="Bottom Right" place="bottomRight" />
      <PlacementDemo label="Left Top" place="leftTop" />
      <PlacementDemo label="Left" place="left" />
      <PlacementDemo label="Left Bottom" place="leftBottom" />
      <PlacementDemo label="Right" place="right" />
      <PlacementDemo label="Right Bottom" place="rightBottom" />
    </div>
  ),
};

export const AutoPlacement: Story = {
  render: () => (
    <div className="flex h-[420px] w-full items-end justify-end p-6">
      <Popover
        anchor={<Button type="default">Auto place</Button>}
        title="Popover title"
        defaultOpen
      >
        {sampleContent}
      </Popover>
    </div>
  ),
};

export const HoverTrigger: Story = {
  render: () => (
    <Popover
      anchor={<Button type="default">Hover me</Button>}
      title="Popover title"
      place="top"
    >
      {sampleContent}
    </Popover>
  ),
};

export const ClickTrigger: Story = {
  render: () => (
    <Popover
      anchor={<Button type="default">Click me</Button>}
      title="Popover title"
      place="top"
      trigger="click"
    >
      {sampleContent}
    </Popover>
  ),
};

export const RightClickTrigger: Story = {
  render: () => (
    <Popover
      anchor={<Button type="default">Right click me</Button>}
      title="Popover title"
      place="top"
      trigger="rightClick"
    >
      {sampleContent}
    </Popover>
  ),
};

export const DoubleClickTrigger: Story = {
  render: () => (
    <Popover
      anchor={<Button type="default">Double click me</Button>}
      title="Popover title"
      place="top"
      trigger="doubleClick"
    >
      {sampleContent}
    </Popover>
  ),
};

function ControlledShowDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="flex flex-col items-center gap-4">
      <Popover
        anchor={<Button type="default">Anchor</Button>}
        title="Popover title"
        place="top"
        show={visible}
      >
        {sampleContent}
      </Popover>
      <Button type="primary" onClick={() => setVisible((value) => !value)}>
        {visible ? 'Hide popover' : 'Show popover'}
      </Button>
    </div>
  );
}

export const ControlledShow: Story = {
  render: () => <ControlledShowDemo />,
};

export const WithoutTitle: Story = {
  render: () => (
    <Popover anchor={<Button type="default">No title</Button>} place="top">
      {sampleContent}
    </Popover>
  ),
};
