import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';

const sampleAvatars = (
  <>
    <Avatar
      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Group1"
      alt="User 1"
    />
    <Avatar text="K" maxChars={null} background="#FAAD14" color="#ffffff" />
    <Avatar icon="user" background="#52C41A" color="#ffffff" />
    <Avatar text="Avatar" maxChars={null} background="#FAAD14" color="#ffffff" />
    <Avatar
      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Group2"
      alt="User 2"
    />
  </>
);

const meta: Meta<typeof AvatarGroup> = {
  title: 'Core/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'custom'],
    },
    max: { control: 'number' },
    customSize: { control: 'number' },
  },
  args: {
    size: 'md',
    max: 4,
  },
};

export default meta;

type Story = StoryObj<typeof AvatarGroup>;

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
  render: () => (
    <div className="flex flex-col gap-8">
      <StorySection title="Custom">
        <AvatarGroup size="custom" customSize={56}>
          {sampleAvatars}
        </AvatarGroup>
      </StorySection>
      <StorySection title="Default">
        <AvatarGroup max={4}>{sampleAvatars}</AvatarGroup>
      </StorySection>
      <StorySection title="Large">
        <AvatarGroup size="lg">{sampleAvatars}</AvatarGroup>
      </StorySection>
      <StorySection title="Small">
        <AvatarGroup size="sm">{sampleAvatars}</AvatarGroup>
      </StorySection>
    </div>
  ),
};

export const WithMax: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <StorySection title="max=4 (5 avatars → 3 + +2)">
        <AvatarGroup max={4}>{sampleAvatars}</AvatarGroup>
      </StorySection>
      <StorySection title="max=3 (5 avatars → 2 + +3)">
        <AvatarGroup max={3}>{sampleAvatars}</AvatarGroup>
      </StorySection>
      <StorySection title="max=5 (show all)">
        <AvatarGroup max={5}>{sampleAvatars}</AvatarGroup>
      </StorySection>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <StorySection title="Small">
        <AvatarGroup size="sm" max={4}>
          {sampleAvatars}
        </AvatarGroup>
      </StorySection>
      <StorySection title="Default">
        <AvatarGroup size="md" max={4}>
          {sampleAvatars}
        </AvatarGroup>
      </StorySection>
      <StorySection title="Large">
        <AvatarGroup size="lg" max={4}>
          {sampleAvatars}
        </AvatarGroup>
      </StorySection>
      <StorySection title="Custom (48px)">
        <AvatarGroup size="custom" customSize={48} max={4}>
          {sampleAvatars}
        </AvatarGroup>
      </StorySection>
    </div>
  ),
};

export const Playground: Story = {
  render: (args) => <AvatarGroup {...args}>{sampleAvatars}</AvatarGroup>,
};
