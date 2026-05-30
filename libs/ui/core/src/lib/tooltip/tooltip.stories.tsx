import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Button } from '../button';
import { Icon } from '../icon';
import { Tooltip, type TooltipPlace } from './index';

const meta: Meta<typeof Tooltip> = {
  title: 'Core/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

const sampleContent = 'Tooltip content';

function PlacementDemo({
  label,
  place,
}: {
  label: string;
  place: TooltipPlace;
}) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-28 text-body-sm text-text-description">{label}</span>
      <Tooltip
        anchor={<Button type="default">Trigger</Button>}
        place={place}
        defaultOpen
        trigger="click"
      >
        {sampleContent}
      </Tooltip>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <Tooltip anchor={<Button type="primary">Hover me</Button>} place="top">
      {sampleContent}
    </Tooltip>
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
      <Tooltip anchor={<Button type="default">Auto place</Button>} defaultOpen>
        {sampleContent}
      </Tooltip>
    </div>
  ),
};

export const ClickTrigger: Story = {
  render: () => (
    <Tooltip
      anchor={<Button type="default">Click me</Button>}
      place="top"
      trigger="click"
    >
      {sampleContent}
    </Tooltip>
  ),
};

export const FocusTrigger: Story = {
  render: () => (
    <Tooltip
      anchor={<Button type="default">Focus me</Button>}
      place="top"
      trigger="focus"
    >
      {sampleContent}
    </Tooltip>
  ),
};

export const ControlledShow: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    return (
      <div className="flex flex-col items-center gap-4">
        <Tooltip
          anchor={<Button type="default">Anchor</Button>}
          place="top"
          show={visible}
        >
          {sampleContent}
        </Tooltip>
        <Button type="primary" onClick={() => setVisible((value) => !value)}>
          {visible ? 'Hide tooltip' : 'Show tooltip'}
        </Button>
      </div>
    );
  },
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip
      anchor={
        <span className="inline-flex cursor-pointer">
          <Icon name="question-circle" size={16} className="!text-icon" />
        </span>
      }
      place="top"
    >
      Help text for this field
    </Tooltip>
  ),
};
