import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../button';
import { Icon } from '../icon';
import { H3, Span } from '../text';
import { PageLeftSidebar } from './page-left-sidebar';

const meta: Meta<typeof PageLeftSidebar> = {
  title: 'Core/PageLeftSidebar',
  component: PageLeftSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    bordered: { control: 'boolean' },
    collapsible: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    fixed: { control: 'boolean' },
    height: {
      control: 'select',
      options: ['screen', 'parent'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full bg-bg-layout">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PageLeftSidebar>;

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' as const, selected: true },
  { key: 'projects', label: 'Projects', icon: 'appstore' as const },
  { key: 'team', label: 'Team', icon: 'team' as const },
  { key: 'settings', label: 'Settings', icon: 'setting' as const },
];

export const Default: Story = {
  args: {
    items: sidebarItems,
    header: (
      <Span type="secondary" size="sm" className="uppercase tracking-wide">
        Workspace
      </Span>
    ),
  },
};

export const WithChildren: Story = {
  render: () => (
    <PageLeftSidebar
      header={
        <div className="flex items-center gap-size-xs">
          <Button type="primary" size="md" iconOnly aria-label="Home">
            <Icon name="appstore" />
          </Button>
          <H3 className="text-heading-5">Acme</H3>
        </div>
      }
    >
      <PageLeftSidebar.Item icon="home" selected>
        Dashboard
      </PageLeftSidebar.Item>
      <PageLeftSidebar.Item icon="appstore">Projects</PageLeftSidebar.Item>
      <PageLeftSidebar.Item icon="team">Team</PageLeftSidebar.Item>
      <PageLeftSidebar.Item icon="setting">Settings</PageLeftSidebar.Item>
    </PageLeftSidebar>
  ),
};

export const Collapsible: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <PageLeftSidebar
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        items={sidebarItems}
        footer={
          <Button type="text" icon={<Icon name="logout" />} className="w-full justify-start">
            Sign out
          </Button>
        }
      />
    );
  },
};

export const Collapsed: Story = {
  args: {
    collapsible: true,
    collapsed: true,
    items: sidebarItems,
  },
};

export const FixedWhileScrolling: Story = {
  render: () => (
    <div className="flex h-svh overflow-y-auto bg-bg-layout">
      <PageLeftSidebar height="screen" fixed items={sidebarItems} />
      <div className="min-w-0 flex-1 space-y-4 px-padding-content-horizontal py-padding-content-vertical">
        {Array.from({ length: 50 }, (_, index) => (
          <p key={index} className="text-body-md text-text-description">
            Scrollable content {index + 1}. The sidebar stays pinned while this area scrolls.
          </p>
        ))}
      </div>
    </div>
  ),
};
