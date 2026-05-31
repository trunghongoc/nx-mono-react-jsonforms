import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';

import { Breadcrumb } from '../breadcrumb';
import { Button } from '../button';
import { Divider } from '../divider';
import { Dropdown } from '../dropdown';
import { Icon, type IconName } from '../icon';
import { PageHeader } from '../page-header';
import { PageLeftSidebar } from '../page-left-sidebar';
import { H3 } from '../text';
import { PageLayout } from './page-layout';

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

function MoreActionsMenu() {
  return (
    <>
      <Dropdown.Item>Share</Dropdown.Item>
      <Dropdown.Item>Export</Dropdown.Item>
      <Divider />
      <Dropdown.Item>
        <DropdownMenuItem icon="delete" label="Delete" />
      </Dropdown.Item>
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

function MoreActionsDropdown() {
  return (
    <Dropdown
      label="More"
      variant="basic"
      icon={{ name: 'ellipsis' }}
      placement="bottomRight"
    >
      <MoreActionsMenu />
    </Dropdown>
  );
}

const meta: Meta<typeof PageLayout> = {
  title: 'Core/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PageLayout>;

function BreadcrumbTrail() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="#home" icon="home">
        Home
      </Breadcrumb.Item>
      <Breadcrumb.Item href="#projects" icon="appstore">
        Projects
      </Breadcrumb.Item>
      <Breadcrumb.Item icon="file-text" current>
        Detail
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}

const sidebarItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'home' as const,
    selected: true,
  },
  { key: 'projects', label: 'Projects', icon: 'appstore' as const },
  { key: 'team', label: 'Team', icon: 'team' as const },
  { key: 'settings', label: 'Settings', icon: 'setting' as const },
];

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' as const },
  { key: 'projects', label: 'Projects', icon: 'appstore' as const },
  { key: 'team', label: 'Team', icon: 'team' as const },
  { key: 'settings', label: 'Settings', icon: 'setting' as const },
];

export const Default: Story = {
  render: () => (
    <PageLayout className="h-[640px]">
      <PageLayout.Header>
        <PageHeader
          bordered
          breadcrumb={<BreadcrumbTrail />}
          title="Project detail"
          subtitle="Manage settings, members, and deployment history."
          extra={
            <>
              <MoreActionsDropdown />
              <AccountDropdown />
              <Button type="default">Share</Button>
              <Button type="primary">Deploy</Button>
            </>
          }
        />
      </PageLayout.Header>

      <PageLayout.Body>
        <PageLayout.Sidebar>
          <PageLeftSidebar
            height="parent"
            fixed
            header={<WorkspaceDropdown />}
            footer={<AccountDropdown />}
          >
            <SidebarNavItems />
          </PageLeftSidebar>
        </PageLayout.Sidebar>

        <PageLayout.Content>
          <div className="space-y-4">
            {Array.from({ length: 8 }, (_, index) => (
              <p key={index} className="text-body-md text-text-description">
                Main content section {index + 1}. PageLayout combines
                PageHeader, PageLeftSidebar, and scrollable page content.
              </p>
            ))}
          </div>
        </PageLayout.Content>
      </PageLayout.Body>
    </PageLayout>
  ),
};

export const CollapsibleSidebar: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <PageLayout className="h-[640px]">
        <PageLayout.Header>
          <PageHeader
            position="sticky"
            bordered
            logo={
              <a
                href="#home"
                className="flex items-center gap-size-xs text-text-heading no-underline"
              >
                <Button type="primary" size="md" iconOnly aria-label="Home">
                  <Icon name="appstore" />
                </Button>
                <H3 className="text-heading-5">trunghongoc</H3>
              </a>
            }
            extra={
              <>
                <Button type="text" iconOnly aria-label="Notifications">
                  <Icon name="bell" />
                </Button>
                <AccountDropdown />
                <Button type="default" size="sm">
                  Sign in
                </Button>
              </>
            }
          >
            <nav aria-label="Main" className="flex items-center gap-size-xxs">
              {navItems.map((item, index) => (
                <Button
                  key={item.key}
                  type="text"
                  icon={<Icon name={item.icon} />}
                  className={index === 0 ? 'text-primary' : undefined}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </PageHeader>
        </PageLayout.Header>

        <PageLayout.Body>
          <PageLayout.Sidebar>
            <PageLeftSidebar
              height="parent"
              collapsible
              collapsed={collapsed}
              onCollapse={setCollapsed}
              items={sidebarItems}
              fixed
              header={<WorkspaceDropdown />}
              footer={<AccountDropdown />}
            />
          </PageLayout.Sidebar>

          <PageLayout.Content>
            <div className="rounded-border border border-split bg-bg-container p-padding-content-horizontal">
              <p className="text-body-md text-text">
                Collapse the sidebar to switch to an icon-only navigation rail.
              </p>
            </div>

            <div className="min-w-0 flex-1 space-y-4 px-padding-content-horizontal py-padding-content-vertical">
              {Array.from({ length: 50 }, (_, index) => (
                <p key={index} className="text-body-md text-text-description">
                  Scrollable content {index + 1}. The sidebar stays pinned while
                  this area scrolls.
                </p>
              ))}
            </div>
          </PageLayout.Content>
        </PageLayout.Body>
      </PageLayout>
    );
  },
};

export const FullHeightScroll: Story = {
  render: () => (
    <PageLayout className="h-svh">
      <PageLayout.Header>
        <PageHeader
          position="sticky"
          bordered
          title="Long page"
          subtitle="Header stays sticky; sidebar and content scroll independently."
          extra={
            <>
              <MoreActionsDropdown />
              <AccountDropdown />
            </>
          }
        />
      </PageLayout.Header>

      <PageLayout.Body>
        <PageLayout.Sidebar>
          <PageLeftSidebar
            height="parent"
            fixed
            header={<WorkspaceDropdown />}
            footer={<AccountDropdown />}
          >
            <SidebarNavItems />
          </PageLeftSidebar>
        </PageLayout.Sidebar>

        <PageLayout.Content>
          {Array.from({ length: 24 }, (_, index) => (
            <p key={index} className="mb-4 text-body-md text-text-description">
              Scrollable section {index + 1}. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
          ))}
        </PageLayout.Content>
      </PageLayout.Body>
    </PageLayout>
  ),
};
