import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumb } from '../breadcrumb';
import { Button } from '../button';
import { Icon } from '../icon';
import { H3, Span } from '../text';
import { PageHeader } from './page-header';

const meta: Meta<typeof PageHeader> = {
  title: 'Core/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['static', 'sticky'],
    },
    bordered: { control: 'boolean' },
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

type Story = StoryObj<typeof PageHeader>;

function BreadcrumbTrail() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="#home" icon="home">
        Home
      </Breadcrumb.Item>
      <Breadcrumb.Item href="#list" icon="appstore">
        Applications
      </Breadcrumb.Item>
      <Breadcrumb.Item icon="file-text" current>
        Detail
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}

function StatusTags() {
  return (
    <>
      <Span
        size="sm"
        className="rounded-border-xs border border-primary-border bg-primary-bg px-padding-xs py-padding-xxs text-primary"
      >
        Running
      </Span>
      <Span
        size="sm"
        className="rounded-border-xs border border-border bg-fill-secondary px-padding-xs py-padding-xxs text-text-secondary"
      >
        v2.4.1
      </Span>
    </>
  );
}

export const Default: Story = {
  args: {
    title: 'Application detail',
    subtitle:
      'Manage settings, deployment history, and environment variables for this application.',
    extra: (
      <>
        <Button type="default">Share</Button>
        <Button type="primary">Deploy</Button>
      </>
    ),
  },
};

export const WithBreadcrumbAndBack: Story = {
  args: {
    breadcrumb: <BreadcrumbTrail />,
    back: true,
    onBack: () => undefined,
    title: 'Application detail',
    subtitle: 'Created on May 30, 2026',
    extra: <Button type="primary">Edit</Button>,
    bordered: true,
  },
};

export const WithAvatarAndTags: Story = {
  args: {
    title: 'Design system',
    subtitle: 'Shared UI primitives for product teams.',
    avatar: (
      <img
        src="https://api.dicebear.com/9.x/shapes/svg?seed=page-header"
        alt=""
        width={80}
        height={80}
      />
    ),
    tags: <StatusTags />,
    extra: (
      <>
        <Button type="default">Settings</Button>
        <Button type="primary">Open docs</Button>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Billing overview',
    subtitle: 'Current plan and usage for this workspace.',
    extra: <Button type="primary">Upgrade plan</Button>,
    footer: (
      <div className="flex flex-wrap gap-margin text-body-sm text-text-description">
        <span>Plan: Pro</span>
        <span aria-hidden>·</span>
        <span>Renews Jun 30, 2026</span>
      </div>
    ),
    bordered: true,
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: {
    breadcrumb: <BreadcrumbTrail />,
    back: true,
    onBack: () => undefined,
    title: 'Long page title that wraps on narrow screens',
    subtitle:
      'Actions stack below the title on mobile so primary buttons stay easy to tap.',
    tags: <StatusTags />,
    extra: (
      <>
        <Button type="default" icon={<Icon name="download" />}>
          Export
        </Button>
        <Button type="primary">Save changes</Button>
      </>
    ),
    bordered: true,
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
  args: {
    ...Mobile.args,
  },
};

export const Sticky: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="h-[480px] w-full overflow-y-auto bg-bg-layout">
      <PageHeader
        position="sticky"
        bordered
        breadcrumb={<BreadcrumbTrail />}
        title="Sticky page header"
        subtitle="Scroll the content below — the header stays pinned at the top."
        extra={<Button type="primary">Action</Button>}
      />
      <div className="space-y-4 p-padding-content-horizontal screen-md:p-padding-content-horizontal-lg">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="text-body-md text-text-description">
            Scrollable section {index + 1}. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua.
          </p>
        ))}
      </div>
    </div>
  ),
};

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' as const },
  { key: 'projects', label: 'Projects', icon: 'appstore' as const },
  { key: 'team', label: 'Team', icon: 'team' as const },
  { key: 'settings', label: 'Settings', icon: 'setting' as const },
];

export const StickyBarLayout: Story = {
  name: 'Sticky bar layout',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="w-full bg-bg-layout">
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

      <div className="space-y-4">
        {Array.from({ length: 50 }, (_, index) => (
          <p key={index} className="text-body-md text-text-description">
            Scrollable section {index + 1}. The app header stays pinned while you scroll
            through page content.
          </p>
        ))}
      </div>
    </div>
  ),
};
