import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';

import { Button } from '../button';
import { Divider } from '../divider';
import { Dropdown } from '../dropdown';
import { Icon, type IconName } from '../icon';
import { H3 } from '../text';
import { PageLeftSidebar } from './page-left-sidebar';

function DropdownMenuItem({ icon, label }: { icon: IconName; label: string }) {
  return (
    <span className="inline-flex items-center gap-size-xs">
      <Icon name={icon} size="sm" className="shrink-0" />
      {label}
    </span>
  );
}

const sidebarNavDropdownClasses =
  'h-auto min-h-0 min-w-0 flex-1 !p-0 justify-between gap-size-xs border-0 bg-transparent font-normal shadow-none hover:bg-transparent active:bg-transparent';

function SidebarNavDropdown({
  label,
  icon,
  children,
}: {
  label: string;
  icon: IconName;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full items-center gap-size-xs rounded-border-xs px-padding-sm py-padding-xs text-body-md transition-colors hover:bg-fill-secondary active:bg-fill-tertiary">
      <Icon name={icon} size="md" className="shrink-0" aria-hidden />
      <Dropdown
        label={label}
        variant="basic"
        icon={{ name: 'right' }}
        placement="rightTop"
        className={sidebarNavDropdownClasses}
      >
        {children}
      </Dropdown>
    </div>
  );
}

function WorkspaceMenu() {
  return (
    <>
      <Dropdown.Item>
        <DropdownMenuItem icon="appstore" label="Acme workspace" />
      </Dropdown.Item>
      <Dropdown.SubMenu label="Switch team">
        <Dropdown.Item>
          <DropdownMenuItem icon="team" label="Design team" />
        </Dropdown.Item>
        <Dropdown.Item>
          <DropdownMenuItem icon="team" label="Engineering team" />
        </Dropdown.Item>
        <Dropdown.Item>
          <DropdownMenuItem icon="team" label="Marketing team" />
        </Dropdown.Item>
      </Dropdown.SubMenu>
      <Divider />
      <Dropdown.Item>
        <DropdownMenuItem icon="plus" label="Create workspace" />
      </Dropdown.Item>
    </>
  );
}

function AccountMenu() {
  return (
    <>
      <Dropdown.Item>
        <DropdownMenuItem icon="user" label="Profile" />
      </Dropdown.Item>
      <Dropdown.SubMenu label="Preferences">
        <Dropdown.Item>
          <DropdownMenuItem icon="bell" label="Notifications" />
        </Dropdown.Item>
        <Dropdown.Item>
          <DropdownMenuItem icon="lock" label="Privacy & security" />
        </Dropdown.Item>
        <Dropdown.SubMenu label="Appearance">
          <Dropdown.Item>Light theme</Dropdown.Item>
          <Dropdown.Item>Dark theme</Dropdown.Item>
          <Dropdown.Item>System default</Dropdown.Item>
        </Dropdown.SubMenu>
      </Dropdown.SubMenu>
      <Dropdown.Item>
        <DropdownMenuItem icon="setting" label="Settings" />
      </Dropdown.Item>
      <Divider />
      <Dropdown.Item>
        <DropdownMenuItem icon="logout" label="Sign out" />
      </Dropdown.Item>
    </>
  );
}

function ProjectsMenu() {
  return (
    <>
      <Dropdown.Item>
        <DropdownMenuItem icon="appstore" label="All projects" />
      </Dropdown.Item>
      <Dropdown.SubMenu label="By team">
        <Dropdown.Item>
          <DropdownMenuItem icon="team" label="Design" />
        </Dropdown.Item>
        <Dropdown.Item>
          <DropdownMenuItem icon="team" label="Engineering" />
        </Dropdown.Item>
        <Dropdown.Item>
          <DropdownMenuItem icon="team" label="Marketing" />
        </Dropdown.Item>
      </Dropdown.SubMenu>
      <Dropdown.Item>
        <DropdownMenuItem icon="folder" label="Archived" />
      </Dropdown.Item>
    </>
  );
}

function SettingsMenu() {
  return (
    <>
      <Dropdown.Item>
        <DropdownMenuItem icon="setting" label="General" />
      </Dropdown.Item>
      <Dropdown.SubMenu label="Workspace">
        <Dropdown.Item>
          <DropdownMenuItem icon="team" label="Members" />
        </Dropdown.Item>
        <Dropdown.Item>
          <DropdownMenuItem icon="api" label="Integrations" />
        </Dropdown.Item>
        <Dropdown.SubMenu label="Billing">
          <Dropdown.Item>Current plan</Dropdown.Item>
          <Dropdown.Item>Payment methods</Dropdown.Item>
          <Dropdown.Item>Invoices</Dropdown.Item>
        </Dropdown.SubMenu>
      </Dropdown.SubMenu>
      <Dropdown.Item>
        <DropdownMenuItem icon="bell" label="Notifications" />
      </Dropdown.Item>
    </>
  );
}

function SidebarNavItems() {
  return (
    <>
      <PageLeftSidebar.Item icon="home" selected>
        Dashboard
      </PageLeftSidebar.Item>
      <SidebarNavDropdown label="Projects" icon="appstore">
        <ProjectsMenu />
      </SidebarNavDropdown>
      <PageLeftSidebar.Item icon="team">Team</PageLeftSidebar.Item>
      <SidebarNavDropdown label="Settings" icon="setting">
        <SettingsMenu />
      </SidebarNavDropdown>
    </>
  );
}

function WorkspaceDropdown() {
  return (
    <Dropdown
      label="Workspace"
      variant="inline"
      placement="rightTop"
      className="w-full justify-start"
    >
      <WorkspaceMenu />
    </Dropdown>
  );
}

function AccountDropdown() {
  return (
    <Dropdown
      label="Account"
      variant="basic"
      icon={{ name: 'user' }}
      placement="rightBottom"
      className="w-full justify-between"
    >
      <AccountMenu />
    </Dropdown>
  );
}

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
  render: () => (
    <PageLeftSidebar header={<WorkspaceDropdown />} footer={<AccountDropdown />}>
      <SidebarNavItems />
    </PageLeftSidebar>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <PageLeftSidebar
      header={
        <div className="flex flex-col gap-size-xs">
          <div className="flex items-center gap-size-xs">
            <Button type="primary" size="md" iconOnly aria-label="Home">
              <Icon name="appstore" />
            </Button>
            <H3 className="text-heading-5">Acme</H3>
          </div>
          <WorkspaceDropdown />
        </div>
      }
      footer={<AccountDropdown />}
    >
      <SidebarNavItems />
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
        footer={<AccountDropdown />}
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
