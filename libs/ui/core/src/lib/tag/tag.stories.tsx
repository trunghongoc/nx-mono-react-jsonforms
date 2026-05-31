import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { Tag, type TagBorderStyle, type TagType } from './tag';

const tagTypes: TagType[] = [
  'default',
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
];

const borderStyleOptions: TagBorderStyle[] = [
  'solid',
  'dashed',
  'dotted',
  'double',
];

const meta: Meta<typeof Tag> = {
  title: 'Core/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    type: {
      control: 'select',
      options: tagTypes,
    },
    border: { control: 'boolean' },
    borderStyle: {
      control: 'select',
      options: borderStyleOptions,
    },
    content: { control: 'text' },
  },
  args: {
    type: 'default',
    border: true,
    borderStyle: 'solid',
    content: 'Tag',
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

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
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  );
}

export const Default: Story = {
  render: (args) => <Tag {...args} />,
};

export const Basic: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <StorySection title="Default">
        <Tag content="Tag" border />
        <Tag content="Tag" border={false} />
      </StorySection>
      <StorySection title="Add New (dashed border)">
        <Tag
          content="New Tag"
          iconLeft="plus"
          border
          borderStyle="dashed"
        />
      </StorySection>
      <StorySection title="Closeable">
        <Tag content="Tag" iconRight="close" border />
        <Tag content="Tag" iconRight="close" border={false} />
      </StorySection>
    </div>
  ),
};

export const ColorTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {tagTypes.map((type) => (
        <StorySection key={type} title={type}>
          <Tag type={type} content="Tag" border />
          <Tag type={type} content="Tag" border={false} />
        </StorySection>
      ))}
    </div>
  ),
};

export const BorderStyles: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {borderStyleOptions.map((borderStyle) => (
        <Tag
          key={borderStyle}
          content={borderStyle}
          iconLeft="plus"
          borderStyle={borderStyle}
        />
      ))}
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <Tag
      content="Custom"
      colors={{
        text: '#531dab',
        background: '#f9f0ff',
        border: '#d3adf7',
      }}
    />
  ),
};

export const CloseableInteractive: Story = {
  render: () => (
    <Tag
      type="blue"
      content="Tag"
      iconRight={{
        name: 'close',
        onClick: () => {
          // Storybook demo
        },
      }}
    />
  ),
};

export const Clickable: Story = {
  render: () => (
    <Tag
      type="blue"
      content="Click me"
      onClick={() => {
        // Storybook demo
      }}
    />
  ),
};
