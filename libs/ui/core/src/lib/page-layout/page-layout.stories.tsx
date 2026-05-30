import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Breadcrumb } from '../breadcrumb';
import { Button } from '../button';
import { Icon } from '../icon';
import { PageHeader } from '../page-header';
import { PageLeftSidebar } from '../page-left-sidebar';
import { H3 } from '../text';
import { PageLayout } from './page-layout';

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
              <Button type="default">Share</Button>
              <Button type="primary">Deploy</Button>
            </>
          }
        />
      </PageLayout.Header>

      <PageLayout.Body>
        <PageLayout.Sidebar>
          <PageLeftSidebar height="parent" items={sidebarItems} fixed />
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
              footer={
                <Button
                  type="text"
                  icon={<Icon name="logout" />}
                  className="w-full justify-start"
                >
                  Sign out
                </Button>
              }
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
        />
      </PageLayout.Header>

      <PageLayout.Body>
        <PageLayout.Sidebar>
          <PageLeftSidebar height="parent" items={sidebarItems} fixed />
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
