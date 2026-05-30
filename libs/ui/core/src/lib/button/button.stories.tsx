import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps, ReactNode } from 'react';

import { Icon } from '../icon';
import { Button, type ButtonSize, type ButtonType } from './button';

const buttonTypes: ButtonType[] = [
  'primary',
  'default',
  'dashed',
  'text',
  'link',
];

const buttonSizes: ButtonSize[] = ['sm', 'md', 'lg'];

type ButtonState = 'default' | 'disabled' | 'loading';

const buttonStates: { id: ButtonState; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'loading', label: 'Loading' },
];

function MatrixSection({
  title,
  description,
  children,
  dark = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="text-body-md font-medium text-text">{title}</h3>
        {description ? (
          <p className="mt-1 text-body-sm text-text-description">{description}</p>
        ) : null}
      </div>
      <div
        className={
          dark
            ? 'overflow-x-auto rounded-md bg-primary p-4'
            : 'overflow-x-auto rounded-md border border-border p-4'
        }
      >
        {children}
      </div>
    </section>
  );
}

function MatrixTable({
  rowHeader,
  columnHeaders,
  rows,
}: {
  rowHeader: string;
  columnHeaders: string[];
  rows: { label: string; cells: ReactNode[] }[];
}) {
  return (
    <table className="w-full min-w-[640px] border-collapse text-left">
      <thead>
        <tr>
          <th className="border-b border-border px-3 py-2 text-body-sm font-medium text-text-description">
            {rowHeader}
          </th>
          {columnHeaders.map((header) => (
            <th
              key={header}
              className="border-b border-border px-3 py-2 text-center text-body-sm font-medium text-text-description"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-border last:border-b-0">
            <th
              scope="row"
              className="whitespace-nowrap px-3 py-3 text-body-sm font-normal text-text-secondary"
            >
              {row.label}
            </th>
            {row.cells.map((cell, index) => (
              <td key={columnHeaders[index]} className="px-3 py-3 text-center">
                <div className="flex justify-center">{cell}</div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function stateProps(state: ButtonState): Pick<
  ComponentProps<typeof Button>,
  'disabled' | 'loading'
> {
  if (state === 'disabled') return { disabled: true };
  if (state === 'loading') return { loading: true };
  return {};
}

function matrixCell(
  type: ButtonType,
  state: ButtonState,
  extra?: Partial<ComponentProps<typeof Button>>
) {
  return (
    <Button type={type} size="md" {...stateProps(state)} {...extra}>
      Button
    </Button>
  );
}

function buildTypeStateRows(
  extra?: Partial<ComponentProps<typeof Button>>
): { label: string; cells: ReactNode[] }[] {
  return buttonStates.map((state) => ({
    label: state.label,
    cells: buttonTypes.map((type) => matrixCell(type, state.id, extra)),
  }));
}

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: buttonTypes,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    round: { control: 'boolean' },
    danger: { control: 'boolean' },
    ghost: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary',
    type: 'primary',
  },
};

export const Default: Story = {
  args: {
    children: 'Default',
    type: 'default',
  },
};

export const Dashed: Story = {
  args: {
    children: 'Dashed',
    type: 'dashed',
  },
};

export const Text: Story = {
  args: {
    children: 'Text',
    type: 'text',
  },
};

export const Link: Story = {
  args: {
    children: 'Link',
    type: 'link',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading',
    type: 'primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    type: 'primary',
    disabled: true,
  },
};

export const Round: Story = {
  args: {
    children: 'Round',
    type: 'primary',
    round: true,
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger',
    type: 'primary',
    danger: true,
  },
};

export const WithIcon: Story = {
  args: {
    type: 'primary',
    icon: <Icon name="plus" />,
    children: 'Add item',
  },
};

export const IconOnly: Story = {
  args: {
    type: 'primary',
    iconOnly: true,
    'aria-label': 'Add',
    children: <Icon name="plus" />,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {buttonTypes.map((type) => (
        <Button key={type} type={type}>
          {type}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button type="primary" size="sm">
        Small
      </Button>
      <Button type="primary" size="md">
        Medium
      </Button>
      <Button type="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};

export const DangerTypes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {buttonTypes.map((type) => (
        <Button key={type} type={type} danger>
          {type}
        </Button>
      ))}
    </div>
  ),
};

export const GhostOnDark: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 rounded-md bg-primary p-6">
      {buttonTypes.map((type) => (
        <Button key={type} type={type} ghost>
          {type}
        </Button>
      ))}
    </div>
  ),
};

export const GhostDangerOnDark: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 rounded-md bg-primary p-6">
      {buttonTypes.map((type) => (
        <Button key={type} type={type} ghost danger>
          {type}
        </Button>
      ))}
    </div>
  ),
};

export const Matrix: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Ma trận đầy đủ: type × state × modifier. Hover và active — tương tác trực tiếp trên từng nút.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-10">
      <MatrixSection
        title="Standard"
        description="type × state trên nền sáng (size md)."
      >
        <MatrixTable
          rowHeader="State"
          columnHeaders={buttonTypes}
          rows={buildTypeStateRows()}
        />
      </MatrixSection>

      <MatrixSection
        title="Sizes"
        description="type primary, state default."
      >
        <MatrixTable
          rowHeader="Size"
          columnHeaders={['Button', 'Round', 'Icon only']}
          rows={buttonSizes.map((size) => ({
            label: size,
            cells: [
              <Button key="btn" type="primary" size={size}>
                Button
              </Button>,
              <Button key="round" type="primary" size={size} round>
                Button
              </Button>,
              <Button
                key="icon"
                type="primary"
                size={size}
                iconOnly
                aria-label="Add"
              >
                <Icon name="plus" />
              </Button>,
            ],
          }))}
        />
      </MatrixSection>

      <MatrixSection
        title="Danger"
        description="danger=true, type × state."
      >
        <MatrixTable
          rowHeader="State"
          columnHeaders={buttonTypes}
          rows={buildTypeStateRows({ danger: true })}
        />
      </MatrixSection>

      <MatrixSection
        title="Ghost"
        description="ghost=true trên nền primary — type × state."
        dark
      >
        <MatrixTable
          rowHeader="State"
          columnHeaders={buttonTypes}
          rows={buildTypeStateRows({ ghost: true })}
        />
      </MatrixSection>

      <MatrixSection
        title="Ghost + Danger"
        description="ghost và danger trên nền primary."
        dark
      >
        <MatrixTable
          rowHeader="State"
          columnHeaders={buttonTypes}
          rows={buildTypeStateRows({ ghost: true, danger: true })}
        />
      </MatrixSection>

      <MatrixSection
        title="Round × type"
        description="round=true, size md, state default."
      >
        <MatrixTable
          rowHeader="Modifier"
          columnHeaders={buttonTypes}
          rows={[
            {
              label: 'Default',
              cells: buttonTypes.map((type) => (
                <Button key={type} type={type} round>
                  Button
                </Button>
              )),
            },
            {
              label: 'Danger',
              cells: buttonTypes.map((type) => (
                <Button key={type} type={type} round danger>
                  Button
                </Button>
              )),
            },
          ]}
        />
      </MatrixSection>

      <MatrixSection
        title="Icon only × type"
        description="iconOnly=true — căn giữa icon, kích thước theo size."
      >
        <MatrixTable
          rowHeader="Size"
          columnHeaders={buttonTypes}
          rows={buttonSizes.map((size) => ({
            label: size,
            cells: buttonTypes.map((type) => (
              <Button
                key={type}
                type={type}
                size={size}
                iconOnly
                aria-label={`${type} ${size}`}
              >
                <Icon name="plus" />
              </Button>
            )),
          }))}
        />
      </MatrixSection>

      <MatrixSection
        title="Round icon only"
        description="round=true, iconOnly=true — theo size và type."
      >
        <MatrixTable
          rowHeader="Size"
          columnHeaders={buttonTypes}
          rows={buttonSizes.map((size) => ({
            label: size,
            cells: buttonTypes.map((type) => (
              <Button
                key={type}
                type={type}
                size={size}
                round
                iconOnly
                aria-label={`${type} ${size} round icon`}
              >
                <Icon name="plus" />
              </Button>
            )),
          }))}
        />
      </MatrixSection>

      <MatrixSection
        title="Icon only × state (primary)"
        description="type primary, size md."
      >
        <MatrixTable
          rowHeader="State"
          columnHeaders={['Default', 'Danger', 'Ghost (dark)']}
          rows={buttonStates.map((state) => ({
            label: state.label,
            cells: [
              <Button
                key="default"
                type="primary"
                iconOnly
                aria-label="Add"
                {...stateProps(state.id)}
              >
                <Icon name="plus" />
              </Button>,
              <Button
                key="danger"
                type="primary"
                danger
                iconOnly
                aria-label="Add danger"
                {...stateProps(state.id)}
              >
                <Icon name="plus" />
              </Button>,
              <div
                key="ghost"
                className="inline-flex rounded-md bg-primary p-2"
              >
                <Button
                  type="primary"
                  ghost
                  iconOnly
                  aria-label="Add ghost"
                  {...stateProps(state.id)}
                >
                  <Icon name="plus" />
                </Button>
              </div>,
            ],
          }))}
        />
      </MatrixSection>
    </div>
  ),
};
