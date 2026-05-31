import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import type { ReactNode } from 'react';

import { Avatar, type AvatarShape, type AvatarSize } from './avatar';

const avatarSizes: AvatarSize[] = ['sm', 'md', 'lg', 'custom'];
const avatarShapes: AvatarShape[] = ['circle', 'square'];

const meta: Meta<typeof Avatar> = {
  title: 'Core/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'custom'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
    customSize: { control: 'number' },
    background: { control: 'text' },
    color: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  args: {
    size: 'md',
    shape: 'circle',
    icon: 'user',
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

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

export const IconAvatar: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {avatarSizes.map((size) => (
        <StorySection key={size} title={`Size: ${size}`}>
          <Avatar
            icon="user"
            size={size}
            customSize={size === 'custom' ? 48 : undefined}
          />
          <Avatar icon="team" size={size} customSize={size === 'custom' ? 48 : undefined} />
        </StorySection>
      ))}
    </div>
  ),
};

export const ImageAvatar: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        alt="Felix"
        size="lg"
      />
      <Avatar
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
        alt="Aneka"
        size="md"
      />
      <Avatar
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey"
        alt="Bailey"
        size="sm"
      />
    </div>
  ),
};

export const TextAvatar: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <StorySection title="Initials (maxChars=2)">
        <Avatar text="Nguyen Van A" maxChars={2} />
        <Avatar text="Nguyen" maxChars={2} />
        <Avatar text="John Doe Smith" maxChars={2} />
      </StorySection>
      <StorySection title="Initials (maxChars=3)">
        <Avatar text="Nguyen Van A" maxChars={3} />
      </StorySection>
      <StorySection title="Full text (maxChars=null)">
        <Avatar text="Admin" maxChars={null} size="lg" />
        <Avatar text="LongName" maxChars={null} size="sm" />
      </StorySection>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {avatarShapes.map((shape) => (
        <StorySection key={shape} title={`Shape: ${shape}`}>
          <Avatar icon="user" shape={shape} />
          <Avatar text="Nguyen Van A" shape={shape} />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shape"
            alt="Avatar"
            shape={shape}
          />
        </StorySection>
      ))}
    </div>
  ),
};

export const CustomColorIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <StorySection title="Outlined icon">
        <Avatar icon="user" background="#1677FF" color="#ffffff" />
        <Avatar icon="team" background="#52C41A" color="#ffffff" size="lg" />
        <Avatar icon="setting" background="#722ED1" color="#E6F4FF" size="sm" />
      </StorySection>
      <StorySection title="Filled icon">
        <Avatar
          icon="star"
          iconTheme="filled"
          background="#FAAD14"
          color="#ffffff"
        />
        <Avatar
          icon="heart"
          iconTheme="filled"
          background="#FF4D4F"
          color="#ffffff"
          size="lg"
        />
        <Avatar
          icon="check-circle"
          iconTheme="filled"
          background="#13C2C2"
          color="#002329"
          shape="square"
        />
      </StorySection>
      <StorySection title="Dark background">
        <Avatar icon="user" background="#141414" color="#FAAD14" />
        <Avatar icon="mail" background="#1D1D1D" color="#69B1FF" size="lg" />
      </StorySection>
    </div>
  ),
};

export const CustomColorText: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <StorySection title="Initials">
        <Avatar text="Nguyen Van A" background="#1677FF" color="#ffffff" />
        <Avatar
          text="Nguyen Van A"
          maxChars={3}
          background="#52C41A"
          color="#ffffff"
          size="lg"
        />
        <Avatar text="John Doe" background="#722ED1" color="#EFDBFF" size="sm" />
      </StorySection>
      <StorySection title="Full text">
        <Avatar text="Admin" maxChars={null} background="#FAAD14" color="#613400" />
        <Avatar
          text="LongName"
          maxChars={null}
          background="#FF4D4F"
          color="#ffffff"
          size="sm"
        />
      </StorySection>
      <StorySection title="Square shape">
        <Avatar
          text="Nguyen Van A"
          background="#13C2C2"
          color="#002329"
          shape="square"
        />
        <Avatar
          text="AB"
          background="#EB2F96"
          color="#ffffff"
          shape="square"
          size="lg"
        />
      </StorySection>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <StorySection title="Icon">
        <Avatar icon="user" background="#1677FF" color="#ffffff" />
        <Avatar
          icon="star"
          iconTheme="filled"
          background="#FAAD14"
          color="#ffffff"
          size="lg"
        />
      </StorySection>
      <StorySection title="Text">
        <Avatar text="Nguyen Van A" background="#52C41A" color="#ffffff" />
        <Avatar text="Admin" maxChars={null} background="#722ED1" color="#EFDBFF" />
      </StorySection>
    </div>
  ),
};

export const CustomSize: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar icon="user" size="custom" customSize={56} />
      <Avatar text="AB" size="custom" customSize={72} />
      <Avatar
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Custom"
        alt="Custom"
        size="custom"
        customSize={96}
      />
    </div>
  ),
};

export const Clickable: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar icon="user" onClick={fn()} aria-label="Open profile" />
      <Avatar text="Nguyen Van A" onClick={fn()} />
      <Avatar
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Click"
        alt="Clickable avatar"
        onClick={fn()}
      />
    </div>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <StorySection title="Dot badge">
        <Avatar
          icon="user"
          badge={{ variant: 'dot', type: 'error', 'aria-label': 'Online' }}
        />
        <Avatar
          text="Nguyen Van A"
          badge={{ variant: 'dot', type: 'success', 'aria-label': 'Online' }}
        />
        <Avatar
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Badge"
          alt="Badge avatar"
          badge={{ variant: 'dot', type: 'primary', 'aria-label': 'New' }}
        />
      </StorySection>
      <StorySection title="Count badge">
        <Avatar
          icon="user"
          size="lg"
          badge={{ variant: 'md', type: 'error', value: 3 }}
        />
        <Avatar
          text="Nguyen Van A"
          badge={{ variant: 'md', type: 'error', value: 101, maxNumber: 99 }}
        />
        <Avatar
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Count"
          alt="Count badge avatar"
          badge={{ variant: 'sm', type: 'primary', value: 'New' }}
        />
      </StorySection>
    </div>
  ),
};

export const Default: Story = {
  render: (args) => <Avatar {...args} />,
};
