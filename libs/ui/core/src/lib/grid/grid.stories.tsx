import type { Meta, StoryObj } from '@storybook/react';

import { Grid } from './grid';

const { Row, Col } = Grid;

const meta: Meta<typeof Row> = {
  title: 'Core/Grid',
  component: Row,
  tags: ['autodocs'],
  subcomponents: { Col },
};

export default meta;

type Story = StoryObj<typeof Row>;

function DemoBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        'rounded-border-sm bg-primary-bg px-padding-sm py-padding-xs text-center text-body-sm text-primary-text',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <Row gutter={16}>
      <Col span={12}>
        <DemoBox>col-12</DemoBox>
      </Col>
      <Col span={12}>
        <DemoBox>col-12</DemoBox>
      </Col>
      <Col span={8}>
        <DemoBox>col-8</DemoBox>
      </Col>
      <Col span={8}>
        <DemoBox>col-8</DemoBox>
      </Col>
      <Col span={8}>
        <DemoBox>col-8</DemoBox>
      </Col>
    </Row>
  ),
};

export const Gutter: Story = {
  render: () => (
    <div className="space-y-6">
      <Row gutter={16}>
        <Col span={6}>
          <DemoBox>gutter 16</DemoBox>
        </Col>
        <Col span={6}>
          <DemoBox>gutter 16</DemoBox>
        </Col>
        <Col span={6}>
          <DemoBox>gutter 16</DemoBox>
        </Col>
        <Col span={6}>
          <DemoBox>gutter 16</DemoBox>
        </Col>
      </Row>

      <Row gutter={[24, 16]}>
        <Col span={8}>
          <DemoBox>[24, 16]</DemoBox>
        </Col>
        <Col span={8}>
          <DemoBox>[24, 16]</DemoBox>
        </Col>
        <Col span={8}>
          <DemoBox>[24, 16]</DemoBox>
        </Col>
        <Col span={8}>
          <DemoBox>[24, 16]</DemoBox>
        </Col>
        <Col span={8}>
          <DemoBox>[24, 16]</DemoBox>
        </Col>
        <Col span={8}>
          <DemoBox>[24, 16]</DemoBox>
        </Col>
      </Row>
    </div>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <DemoBox>xs=24 sm=12 md=8 lg=6</DemoBox>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <DemoBox>xs=24 sm=12 md=8 lg=6</DemoBox>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <DemoBox>xs=24 sm=12 md=8 lg=6</DemoBox>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <DemoBox>xs=24 sm=12 md=8 lg=6</DemoBox>
      </Col>
    </Row>
  ),
};

export const Offset: Story = {
  render: () => (
    <Row gutter={16}>
      <Col span={8}>
        <DemoBox>col-8</DemoBox>
      </Col>
      <Col span={8} offset={8}>
        <DemoBox>col-8 offset-8</DemoBox>
      </Col>
    </Row>
  ),
};

export const AlignAndJustify: Story = {
  render: () => (
    <div className="space-y-6">
      <Row gutter={16} align="middle" className="h-24 bg-fill-secondary">
        <Col span={4}>
          <DemoBox>align middle</DemoBox>
        </Col>
        <Col span={4}>
          <DemoBox className="py-padding-lg">taller</DemoBox>
        </Col>
        <Col span={4}>
          <DemoBox>align middle</DemoBox>
        </Col>
      </Row>

      <Row gutter={16} justify="space-between">
        <Col span={4}>
          <DemoBox>justify space-between</DemoBox>
        </Col>
        <Col span={4}>
          <DemoBox>justify space-between</DemoBox>
        </Col>
        <Col span={4}>
          <DemoBox>justify space-between</DemoBox>
        </Col>
      </Row>
    </div>
  ),
};

export const Flex: Story = {
  render: () => (
    <Row gutter={16}>
      <Col flex={2}>
        <DemoBox>flex 2</DemoBox>
      </Col>
      <Col flex={3}>
        <DemoBox>flex 3</DemoBox>
      </Col>
      <Col flex="120px">
        <DemoBox>120px</DemoBox>
      </Col>
    </Row>
  ),
};
