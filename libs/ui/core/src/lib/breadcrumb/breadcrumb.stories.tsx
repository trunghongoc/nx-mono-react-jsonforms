import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from '../icon';
import { Breadcrumb } from './breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Core/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    separator: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="#home">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="#applications">Applications</Breadcrumb.Item>
      <Breadcrumb.Item current>Detail</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const WithItemsProp: Story = {
  args: {
    items: [
      { title: 'Home', href: '#home' },
      { title: 'Applications', href: '#applications' },
      { title: 'Detail' },
    ],
  },
};

export const WithIcons: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item href="#home" icon="home">
        Home
      </Breadcrumb.Item>
      <Breadcrumb.Item href="#applications" icon="appstore">
        Applications
      </Breadcrumb.Item>
      <Breadcrumb.Item icon="file-text" current>
        Detail
      </Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const WithCustomIcons: Story = {
  render: () => (
    <Breadcrumb separator={<Icon name="right" size="sm" className="text-text-quaternary" />}>
      <Breadcrumb.Item
        href="#home"
        icon={<Icon name="home" theme="filled" size="sm" className="text-primary" />}
      >
        Home
      </Breadcrumb.Item>
      <Breadcrumb.Item
        href="#settings"
        icon={<Icon name="setting" size="sm" className="text-text-description" />}
      >
        Settings
      </Breadcrumb.Item>
      <Breadcrumb.Item current icon="user">
        Profile
      </Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const ItemsWithIcons: Story = {
  args: {
    separator: '/',
    items: [
      { title: 'Home', href: '#home', icon: 'home' },
      { title: 'Team', href: '#team', icon: 'team' },
      { title: 'Members', href: '#members', icon: 'user' },
      { title: 'Alice' },
    ],
  },
};

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb separator="›">
      <Breadcrumb.Item href="#a">Level 1</Breadcrumb.Item>
      <Breadcrumb.Item href="#b">Level 2</Breadcrumb.Item>
      <Breadcrumb.Item current>Level 3</Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const SingleItem: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.Item icon="home" current>
        Dashboard
      </Breadcrumb.Item>
    </Breadcrumb>
  ),
};

export const LongTrail: Story = {
  render: () => (
    <div className="max-w-xs">
      <Breadcrumb>
        <Breadcrumb.Item href="#1" icon="home">
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#2">Workspace</Breadcrumb.Item>
        <Breadcrumb.Item href="#3">Projects</Breadcrumb.Item>
        <Breadcrumb.Item href="#4">Design system</Breadcrumb.Item>
        <Breadcrumb.Item current>Components</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  ),
};
