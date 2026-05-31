import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import { Link, MemoryRouter } from 'react-router-dom';

import { Divider } from '../divider';
import { Icon, type IconName } from '../icon';
import { Label } from '../text';
import {
  Dropdown,
  type DropdownColors,
  type DropdownPlacement,
  type DropdownVariant,
} from './dropdown';
import type { TagType } from '../tag';

const tagColorTypes = [
  'magenta',
  'blue',
  'cyan',
  'geek-blue',
  'gold',
  'green',
  'lime',
  'purple',
  'red',
  'volcano',
  'primary',
] as const satisfies readonly TagType[];

type TagColorType = (typeof tagColorTypes)[number];

function getDropdownColorsFromTagType(type: TagColorType): DropdownColors {
  if (type === 'primary') {
    return {
      text: 'var(--color-primary)',
      border: 'var(--color-primary)',
      background: 'var(--color-text-light-solid)',
      itemColor: 'var(--color-primary)',
      itemHoverBg: 'var(--color-primary-bg)',
    };
  }

  const prefix = type === 'geek-blue' ? 'geekblue' : type;

  return {
    text: `var(--color-${prefix}-6)`,
    border: `var(--color-${prefix}-6)`,
    background: `var(--color-${prefix}-1)`,
    itemColor: `var(--color-${prefix}-6)`,
    itemHoverBg: `var(--color-${prefix}-2)`,
  };
}

const placements: DropdownPlacement[] = [
  'bottomLeft',
  'bottom',
  'bottomRight',
  'topLeft',
  'top',
  'topRight',
];

const placementLabels: Record<DropdownPlacement, string> = {
  bottomLeft: 'Bottom Left',
  bottom: 'Bottom',
  bottomRight: 'Bottom Right',
  topLeft: 'Top Left',
  top: 'Top',
  topRight: 'Top Right',
};

function SampleMenu() {
  return (
    <>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Divider />
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
    </>
  );
}

function DropdownItemWithIcon({
  icon,
  label,
}: {
  icon: IconName;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-size-xs">
      <Icon name={icon} size="sm" className="shrink-0" />
      {label}
    </span>
  );
}

function MenuWithIcons() {
  return (
    <>
      <Dropdown.Item>
        <DropdownItemWithIcon icon="user" label="Profile" />
      </Dropdown.Item>
      <Dropdown.Item>
        <DropdownItemWithIcon icon="setting" label="Settings" />
      </Dropdown.Item>
      <Dropdown.Item>
        <DropdownItemWithIcon icon="bell" label="Notifications" />
      </Dropdown.Item>
      <Divider />
      <Dropdown.Item>
        <DropdownItemWithIcon icon="logout" label="Sign out" />
      </Dropdown.Item>
    </>
  );
}

function MenuWithLabel() {
  return (
    <>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Divider />
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Divider />
      <Label>Group label</Label>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
    </>
  );
}

const meta: Meta<typeof Dropdown> = {
  title: 'Core/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['inline', 'basic'],
    },
    placement: {
      control: 'select',
      options: [undefined, ...placements],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    label: 'Dropdown',
    variant: 'inline',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

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
      <div>{children}</div>
    </section>
  );
}

function PlacementDemo({
  label,
  placement,
  variant,
  defaultOpen = true,
}: {
  label: string;
  placement: DropdownPlacement;
  variant: DropdownVariant;
  defaultOpen?: boolean;
}) {
  return (
    <div className="flex items-start gap-6">
      <span className="w-40 shrink-0 pt-2 text-body-sm text-text-description">
        {label}
      </span>
      <Dropdown
        label="Dropdown"
        variant={variant}
        placement={placement}
        defaultOpen={defaultOpen}
      >
        <SampleMenu />
      </Dropdown>
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <SampleMenu />
    </Dropdown>
  ),
};

export const Inline: Story = {
  render: (args) => (
    <Dropdown {...args} variant="inline">
      <SampleMenu />
    </Dropdown>
  ),
};

export const Basic: Story = {
  render: (args) => (
    <Dropdown {...args} variant="basic">
      <SampleMenu />
    </Dropdown>
  ),
};

export const WithoutIcon: Story = {
  render: (args) => (
    <Dropdown {...args} icon={null}>
      <SampleMenu />
    </Dropdown>
  ),
};

export const CustomIcon: Story = {
  render: (args) => (
    <Dropdown {...args} icon={{ name: 'ellipsis' }}>
      <SampleMenu />
    </Dropdown>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <Dropdown label="Dropdown" variant="inline" disabled>
        <SampleMenu />
      </Dropdown>
      <Dropdown label="Dropdown" variant="basic" disabled>
        <SampleMenu />
      </Dropdown>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <Dropdown label="Dropdown" variant="inline" loading>
        <SampleMenu />
      </Dropdown>
      <Dropdown label="Dropdown" variant="basic" loading>
        <SampleMenu />
      </Dropdown>
    </div>
  ),
};

export const BottomPlacements: Story = {
  render: () => (
    <div className="flex flex-col gap-10 py-8">
      <StorySection title="Inline">
        {(['bottomLeft', 'bottom', 'bottomRight'] as const).map((placement) => (
          <PlacementDemo
            key={`inline-${placement}`}
            label={`Open Menu: Yes | Placement: ${placementLabels[placement]}`}
            placement={placement}
            variant="inline"
          />
        ))}
      </StorySection>
      <StorySection title="Basic">
        {(['bottomLeft', 'bottom', 'bottomRight'] as const).map((placement) => (
          <PlacementDemo
            key={`basic-${placement}`}
            label={`Open Menu: Yes | Placement: ${placementLabels[placement]}`}
            placement={placement}
            variant="basic"
          />
        ))}
      </StorySection>
    </div>
  ),
};

export const TopPlacements: Story = {
  render: () => (
    <div className="flex flex-col gap-10 py-24">
      <StorySection title="Inline">
        {(['topLeft', 'top', 'topRight'] as const).map((placement) => (
          <PlacementDemo
            key={`inline-${placement}`}
            label={`Open Menu: Yes | Placement: ${placementLabels[placement]}`}
            placement={placement}
            variant="inline"
          />
        ))}
      </StorySection>
      <StorySection title="Basic">
        {(['topLeft', 'top', 'topRight'] as const).map((placement) => (
          <PlacementDemo
            key={`basic-${placement}`}
            label={`Open Menu: Yes | Placement: ${placementLabels[placement]}`}
            placement={placement}
            variant="basic"
          />
        ))}
      </StorySection>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {tagColorTypes.map((type) => (
        <StorySection key={type} title={type}>
          <Dropdown
            label="Dropdown"
            variant="inline"
            colors={getDropdownColorsFromTagType(type)}
          >
            <SampleMenu />
          </Dropdown>
          <Dropdown
            label="Dropdown"
            variant="basic"
            colors={getDropdownColorsFromTagType(type)}
          >
            <SampleMenu />
          </Dropdown>
        </StorySection>
      ))}
    </div>
  ),
};

function ControlledDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Dropdown
        label="Dropdown"
        variant="basic"
        open={open}
        onOpenChange={setOpen}
        onClickItem={(content) => {
          console.log('Selected:', content);
        }}
      >
        <SampleMenu />
      </Dropdown>
      <p className="text-body-sm text-text-description">
        Open: {open ? 'yes' : 'no'}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

export const AutoPlacement: Story = {
  render: () => (
    <div className="flex h-[420px] w-full items-end justify-end p-6">
      <Dropdown label="Dropdown" variant="basic" defaultOpen>
        <SampleMenu />
      </Dropdown>
    </div>
  ),
};

export const WithItemIcons: Story = {
  render: () => (
    <Dropdown label="Dropdown" variant="basic" defaultOpen>
      <MenuWithIcons />
    </Dropdown>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Dropdown label="Dropdown" variant="basic" defaultOpen>
      <MenuWithLabel />
    </Dropdown>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Dropdown label="Dropdown" variant="basic" defaultOpen>
      <Dropdown.Item>Enabled item</Dropdown.Item>
      <Dropdown.Item disabled>Disabled item</Dropdown.Item>
      <Dropdown.Item>Enabled item</Dropdown.Item>
      <Divider />
      <Dropdown.Item disabled>
        <DropdownItemWithIcon icon="logout" label="Disabled action" />
      </Dropdown.Item>
    </Dropdown>
  ),
};

export const CustomItemColor: Story = {
  render: () => (
    <Dropdown label="Dropdown" variant="basic" defaultOpen>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Dropdown.Item
        colors={{
          text: 'var(--color-red-6)',
          hoverBg: 'var(--color-red-2)',
        }}
      >
        <DropdownItemWithIcon icon="delete" label="Delete" />
      </Dropdown.Item>
      <Divider />
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
      <Dropdown.Item>Dropdown List Item</Dropdown.Item>
    </Dropdown>
  ),
};

export const WithAsProp: Story = {
  render: () => (
    <MemoryRouter>
      <Dropdown label="Dropdown" variant="basic" defaultOpen>
        <Dropdown.Item>Default div item</Dropdown.Item>
        <Dropdown.Item as="span">Span item</Dropdown.Item>
        <Dropdown.Item as="label" asProps={{ htmlFor: 'dropdown-demo-input' }}>
          Label item
        </Dropdown.Item>
        <Dropdown.Item as={Link} asProps={{ to: '/settings' }}>
          Link item
        </Dropdown.Item>
      </Dropdown>
    </MemoryRouter>
  ),
};

export const Closed: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <Dropdown label="Dropdown" variant="inline">
        <SampleMenu />
      </Dropdown>
      <Dropdown label="Dropdown" variant="basic">
        <SampleMenu />
      </Dropdown>
    </div>
  ),
};
