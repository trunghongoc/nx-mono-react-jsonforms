import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ComponentProps } from 'react';

import { Pagination } from './pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Core/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['md', 'sm'],
    },
    disabled: { control: 'boolean' },
    showSizeChanger: { control: 'boolean' },
    hideOnSinglePage: { control: 'boolean' },
    pageItemCount: { control: { type: 'number', min: 1 } },
    jumpSize: { control: { type: 'number', min: 1 } },
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

function PaginationDemo(props: ComponentProps<typeof Pagination>) {
  const [current, setCurrent] = useState(props.current ?? props.defaultCurrent ?? 1);
  const [pageSize, setPageSize] = useState(
    props.pageSize ?? props.defaultPageSize ?? 10
  );

  return (
    <Pagination
      {...props}
      current={current}
      pageSize={pageSize}
      onChange={(page, nextPageSize) => {
        setCurrent(page);
        setPageSize(nextPageSize);
        props.onChange?.(page, nextPageSize);
      }}
    />
  );
}

export const Basic: Story = {
  render: () => <PaginationDemo total={6} defaultCurrent={1} />,
};

export const ManyPages: Story = {
  render: () => <PaginationDemo total={50} defaultCurrent={1} />,
};

export const PageItemCount: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="space-y-2">
        <h3 className="text-body-md font-medium text-text">
          Few pages (total 6) — shows all page numbers
        </h3>
        <PaginationDemo total={6} defaultCurrent={1} pageItemCount={7} />
      </section>
      <section className="space-y-2">
        <h3 className="text-body-md font-medium text-text">
          Many pages — pageItemCount: 5 (default collapsed)
        </h3>
        <PaginationDemo total={50} defaultCurrent={1} pageItemCount={5} />
      </section>
      <section className="space-y-2">
        <h3 className="text-body-md font-medium text-text">
          Many pages — pageItemCount: 7 (default)
        </h3>
        <PaginationDemo total={50} defaultCurrent={25} pageItemCount={7} />
      </section>
      <section className="space-y-2">
        <h3 className="text-body-md font-medium text-text">
          Many pages — pageItemCount: 9 (more page numbers visible)
        </h3>
        <PaginationDemo total={50} defaultCurrent={25} pageItemCount={9} />
      </section>
    </div>
  ),
};

export const MiddlePage: Story = {
  render: () => <PaginationDemo total={50} defaultCurrent={25} />,
};

export const PageItemCountPlayground: Story = {
  args: {
    total: 50,
    defaultCurrent: 25,
    pageItemCount: 7,
    jumpSize: 5,
  },
  render: (args) => <PaginationDemo {...args} />,
};

export const Small: Story = {
  render: () => (
    <PaginationDemo total={50} defaultCurrent={1} size="sm" />
  ),
};

export const PrevAndNextText: Story = {
  render: () => (
    <PaginationDemo
      total={50}
      defaultCurrent={1}
      prevIcon={<span>Previous</span>}
      nextIcon={<span>Next</span>}
    />
  ),
};

export const WithTotalAndSizeChanger: Story = {
  render: () => (
    <PaginationDemo
      totalItems={500}
      defaultCurrent={1}
      defaultPageSize={10}
      showSizeChanger
      showTotal={(total) => <>Total {total} items</>}
    />
  ),
};

export const Disabled: Story = {
  args: {
    total: 10,
    current: 3,
    disabled: true,
  },
};

export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="space-y-2">
        <h3 className="text-body-md font-medium text-text">Basic</h3>
        <PaginationDemo total={6} defaultCurrent={1} />
      </section>
      <section className="space-y-2">
        <h3 className="text-body-md font-medium text-text">Jumper (many pages)</h3>
        <PaginationDemo total={50} defaultCurrent={1} />
      </section>
      <section className="space-y-2">
        <h3 className="text-body-md font-medium text-text">Mini</h3>
        <PaginationDemo total={6} defaultCurrent={1} size="sm" />
      </section>
      <section className="space-y-2">
        <h3 className="text-body-md font-medium text-text">Mini Jumper</h3>
        <PaginationDemo total={50} defaultCurrent={1} size="sm" />
      </section>
      <section className="space-y-2">
        <h3 className="text-body-md font-medium text-text">More</h3>
        <PaginationDemo
          totalItems={500}
          defaultCurrent={1}
          showSizeChanger
          showTotal={(total) => <>Total {total} items</>}
        />
      </section>
      <section className="space-y-2">
        <h3 className="text-body-md font-medium text-text">Prev and next</h3>
        <PaginationDemo
          total={50}
          defaultCurrent={1}
          prevIcon={<span>Previous</span>}
          nextIcon={<span>Next</span>}
        />
      </section>
    </div>
  ),
};
