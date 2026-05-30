import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Icon, iconNames, iconNamesByTheme, type IconTheme } from './icon';

const playgroundIconNames = [
  'plus',
  'search',
  'close',
  'check',
  'edit',
  'delete',
  'heart',
  'loading',
  'user',
  'setting',
  'home',
  'menu',
  'ellipsis',
] as const;

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

function useCopyFeedback() {
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const copyName = useCallback(async (name: string) => {
    if (!(await copyToClipboard(name))) return;

    window.clearTimeout(timeoutRef.current);
    setCopiedName(name);
    timeoutRef.current = window.setTimeout(() => {
      setCopiedName((current) => (current === name ? null : current));
    }, 1500);
  }, []);

  return { copiedName, copyName };
}

function IconNameTile({
  name,
  theme = 'outlined',
  copiedName,
  onCopy,
  className,
  labelClassName,
}: {
  name: (typeof iconNames)[number];
  theme?: IconTheme;
  copiedName: string | null;
  onCopy: (name: string) => void;
  className?: string;
  labelClassName?: string;
}) {
  const copied = copiedName === name;

  return (
    <button
      type="button"
      title={copied ? 'Copied!' : `Copy "${name}"`}
      onClick={() => onCopy(name)}
      className={
        className ??
        'flex cursor-pointer flex-col items-center gap-1 rounded-md border border-border-secondary p-2 text-center transition-colors hover:border-primary hover:bg-bg-text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-control-outline'
      }
      data-copied={copied || undefined}
    >
      <Icon
        name={name}
        theme={theme}
        size={32}
        spin={name === 'loading'}
      />
      <span
        className={
          labelClassName ??
          'w-full truncate text-body-sm leading-tight text-text-secondary'
        }
      >
        {copied ? 'Copied!' : name}
      </span>
    </button>
  );
}

const meta: Meta<typeof Icon> = {
  title: 'Core/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Ant Design icon set (outlined / filled / twotone). SVG sources in `svg/`. Use `name` in kebab-case.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: [...playgroundIconNames],
      description: `${iconNames.length} outlined icons — xem story **Gallery** để duyệt đầy đủ.`,
    },
    theme: {
      control: 'select',
      options: ['outlined', 'filled', 'twotone'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
    spin: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'plus',
    theme: 'outlined',
    size: 32,
    spin: false,
  },
};

export const Themes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-10">
      {(['outlined', 'filled', 'twotone'] as const).map((theme) => (
        <div
          key={theme}
          className="flex flex-col items-center gap-2 text-body-md text-text-secondary"
        >
          <Icon name="heart" theme={theme} size={32} />
          <span>{theme}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      {(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map((size) => (
        <div
          key={size}
          className="flex flex-col items-center gap-2 text-body-md text-text-secondary"
        >
          <Icon name="search" size={size} />
          <span>{size}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-2 text-body-md text-text-secondary">
        <Icon name="search" size={32} />
        <span>32px</span>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-6">
      <Icon name="plus" size={32} className="text-icon" />
      <Icon name="plus" size={32} className="text-primary" />
      <Icon name="plus" size={32} className="text-error" />
      <Icon name="plus" size={32} className="text-success" />
      <Icon name="plus" size={32} className="text-warning" />
      <div className="rounded-md bg-primary p-2">
        <Icon name="plus" size={32} className="text-text-light-solid" />
      </div>
    </div>
  ),
};

export const Spin: Story = {
  args: {
    name: 'loading',
    theme: 'outlined',
    spin: true,
    size: 32,
  },
};

export const Overview: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <ul className="list-disc space-y-1 pl-5 text-body-md text-text">
      <li>Outlined: {iconNamesByTheme.outlined.length}</li>
      <li>Filled: {iconNamesByTheme.filled.length}</li>
      <li>Twotone: {iconNamesByTheme.twotone.length}</li>
      <li>
        Total:{' '}
        {iconNamesByTheme.outlined.length +
          iconNamesByTheme.filled.length +
          iconNamesByTheme.twotone.length}{' '}
        SVG files
      </li>
    </ul>
  ),
};

function IconGallery({ theme }: { theme: IconTheme }) {
  const [query, setQuery] = useState('');
  const { copiedName, copyName } = useCopyFeedback();
  const names = iconNamesByTheme[theme];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return names;
    return names.filter((name) => name.includes(q));
  }, [names, query]);

  return (
    <div className="flex w-full max-w-5xl flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${theme} icons…`}
          className="h-8 min-w-[240px] rounded-md border border-border bg-bg-container px-3 text-body-md text-text outline-none focus-visible:ring-2 focus-visible:ring-control-outline"
        />
        <span className="text-body-sm text-text-secondary">
          {filtered.length} / {names.length}
          <span className="text-text-description"> · Click icon to copy name</span>
        </span>
      </div>
      <div className="grid max-h-[560px] grid-cols-4 gap-3 overflow-y-auto sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {filtered.map((name) => (
          <IconNameTile
            key={name}
            name={name as (typeof iconNames)[number]}
            theme={theme}
            copiedName={copiedName}
            onCopy={copyName}
          />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-body-sm text-text-description">No icons match.</p>
      ) : null}
    </div>
  );
}

export const GalleryOutlined: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Toàn bộ outlined icons — có ô tìm kiếm.',
      },
    },
  },
  render: () => <IconGallery theme="outlined" />,
};

export const GalleryFilled: Story = {
  parameters: { layout: 'padded' },
  render: () => <IconGallery theme="filled" />,
};

export const GalleryTwotone: Story = {
  parameters: { layout: 'padded' },
  render: () => <IconGallery theme="twotone" />,
};

export const CommonIcons: Story = {
  parameters: { layout: 'padded' },
  render: function CommonIconsStory() {
    const { copiedName, copyName } = useCopyFeedback();

    return (
      <div className="grid grid-cols-4 gap-6 sm:grid-cols-6 md:grid-cols-7">
        {playgroundIconNames.map((name) => (
          <IconNameTile
            key={name}
            name={name}
            copiedName={copiedName}
            onCopy={copyName}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-md border border-transparent p-2 text-center transition-colors hover:border-border-secondary hover:bg-bg-text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-control-outline"
            labelClassName="text-body-md text-text-secondary"
          />
        ))}
      </div>
    );
  },
};
