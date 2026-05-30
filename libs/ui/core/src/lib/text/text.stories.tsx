import type { Meta, StoryObj } from '@storybook/react';

import { H1, H2, H3, H4, H5, Label, P, Span } from './text';

const meta: Meta<typeof P> = {
  title: 'Core/Text',
  component: P,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'link',
        'success',
        'warning',
        'danger',
        'disabled',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof P>;

export const Default: Story = {
  args: {
    children: 'Default body text',
    type: 'default',
    size: 'md',
  },
};

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <H1>Heading 1 — 38/46</H1>
      <H2>Heading 2 — 30/38</H2>
      <H3>Heading 3 — 24/32</H3>
      <H4>Heading 4 — 20/28</H4>
      <H5>Heading 5 — 16/25</H5>
    </div>
  ),
};

export const BodySizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <P size="sm">Small body text — 12/20</P>
      <P size="md">Medium body text — 14/22</P>
      <P size="lg">Large body text — 16/24</P>
      <P size="xl">Extra large body text — 20/28</P>
    </div>
  ),
};

export const TextTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <P type="default">Default text (colorText)</P>
      <P type="secondary">Secondary text (colorTextDescription)</P>
      <Span type="link">Link text (colorLink)</Span>
      <P type="success">Success text (colorSuccess)</P>
      <P type="warning">Warning text (colorWarning)</P>
      <P type="danger">Danger text (colorError)</P>
      <P type="disabled">Disabled text (colorTextDisabled)</P>
    </div>
  ),
};

export const InlineElements: Story = {
  render: () => (
    <P>
      Paragraph with <Span type="secondary">secondary span</Span> and{' '}
      <Span type="link">link span</Span>.
    </P>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <H4>Headings</H4>
        <H1>Heading 1</H1>
        <H2>Heading 2</H2>
        <H3>Heading 3</H3>
        <H4>Heading 4</H4>
        <H5>Heading 5</H5>
      </section>
      <section className="flex flex-col gap-3">
        <H4>Body sizes</H4>
        <P size="sm">Small</P>
        <P size="md">Medium</P>
        <P size="lg">Large</P>
        <P size="xl">Extra large</P>
      </section>
      <section className="flex flex-col gap-3">
        <H4>Text types</H4>
        <P type="default">Default</P>
        <P type="secondary">Secondary</P>
        <Span type="link">Link</Span>
        <P type="success">Success</P>
        <P type="warning">Warning</P>
        <P type="danger">Danger</P>
        <P type="disabled">Disabled</P>
      </section>
    </div>
  ),
};

export const HtmlAttributes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <H1 id="page-title" className="underline" title="Document title">
        Heading with id, className, title
      </H1>
      <P
        aria-label="Description paragraph"
        data-testid="description"
        className="italic"
        onClick={() => undefined}
      >
        Paragraph with aria-label, data-testid, className
      </P>
      <P>
        Label field:{' '}
        <Label htmlFor="email" className="font-medium">
          Email
        </Label>
      </P>
    </div>
  ),
};
