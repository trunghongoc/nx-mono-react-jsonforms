import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';

import { Icon } from '../icon';
import type { DropdownPlacement } from '../dropdown';
import { Select, type SelectSize, type SelectStatus } from './select';

const selectSizes: SelectSize[] = ['sm', 'md', 'lg'];
const selectStatuses: SelectStatus[] = ['error', 'warning', 'success'];

const defaultOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
];

function buildLongLabelOption(index: number) {
  const itemNumber = index + 1;
  const lengthVariant = index % 4;

  if (lengthVariant === 0) {
    return `Item ${itemNumber}`;
  }

  if (lengthVariant === 1) {
    return `Catalog item ${itemNumber} - organic`;
  }

  if (lengthVariant === 2) {
    return `Premium organic catalog item ${itemNumber} with product description and sourcing details`;
  }

  return `Premium organic seasonal export-grade catalog item ${itemNumber} with extended commercial description, supplier notes, compliance metadata, packaging dimensions, cold storage handling instructions, and distributor delivery window`;
}

const manyLongLabelOptions = Array.from({ length: 10 }, (_, index) => ({
  value: `catalog-item-${index + 1}`,
  label: buildLongLabelOption(index),
}));

const selectPlacements: DropdownPlacement[] = [
  'bottomLeft',
  'bottom',
  'bottomRight',
  'topLeft',
  'top',
  'topRight',
];

const selectPlacementLabels: Record<DropdownPlacement, string> = {
  bottomLeft: 'Bottom Left',
  bottom: 'Bottom',
  bottomRight: 'Bottom Right',
  topLeft: 'Top Left',
  top: 'Top',
  topRight: 'Top Right',
};

const meta: Meta<typeof Select> = {
  title: 'Core/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    status: {
      control: 'select',
      options: [undefined, 'error', 'warning', 'success'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    allowClear: { control: 'boolean' },
    allowSearch: { control: 'boolean' },
    multiple: { control: 'boolean' },
    localSearch: { control: 'boolean' },
    searchPlaceholder: { control: 'text' },
    required: { control: 'boolean' },
    emptyPlaceholder: { control: 'text' },
    loadingPlaceholder: { control: 'text' },
    errorPlaceholder: { control: 'text' },
    optionsError: { control: 'boolean' },
    label: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    placeholder: 'Select a fruit',
    size: 'md',
    disabled: false,
    loading: false,
    allowClear: false,
    allowSearch: false,
    localSearch: true,
    options: defaultOptions,
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

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
      <div className="max-w-sm">{children}</div>
    </section>
  );
}

export const Default: Story = {
  render: (args) => <Select {...args} />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Select
        label="Favorite fruit"
        placeholder="Choose a fruit"
        options={defaultOptions}
      />
      <Select
        label="Country"
        placeholder="Select country"
        required
        options={[
          { value: 'vn', label: 'Vietnam' },
          { value: 'us', label: 'United States' },
          { value: 'jp', label: 'Japan' },
        ]}
      />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Select
        placeholder="Select a fruit"
        error="Please select a fruit"
        status="error"
        options={defaultOptions}
      />
      <Select
        label="Favorite fruit"
        placeholder="Choose a fruit"
        error="This field is required"
        status="error"
        options={defaultOptions}
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {selectSizes.map((size) => (
        <Select
          key={size}
          size={size}
          label={`Size: ${size}`}
          placeholder="Select a fruit"
          defaultValue="banana"
          options={defaultOptions}
        />
      ))}
    </div>
  ),
};

export const Statuses: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {selectStatuses.map((status) => (
        <Select
          key={status}
          status={status}
          label={`Status: ${status}`}
          placeholder="Select a fruit"
          defaultValue="apple"
          options={defaultOptions}
        />
      ))}
    </div>
  ),
};

export const WithPrefix: Story = {
  render: () => (
    <Select
      label="Category"
      placeholder="Select category"
      prefix={<Icon name="appstore" size="md" />}
      options={[
        { value: 'food', label: 'Food & Drink' },
        { value: 'tech', label: 'Technology' },
        { value: 'travel', label: 'Travel' },
      ]}
    />
  ),
};

export const AllowClear: Story = {
  render: () => (
    <Select
      label="Favorite fruit"
      placeholder="Choose a fruit"
      allowClear
      defaultValue="apple"
      options={defaultOptions}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Select
        label="Disabled empty"
        placeholder="Select a fruit"
        disabled
        options={defaultOptions}
      />
      <Select
        label="Disabled with value"
        disabled
        defaultValue="banana"
        options={defaultOptions}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Select
        label="Loading on trigger"
        placeholder="Select a fruit"
        loading
        options={defaultOptions}
      />
      <Select
        label="Loading in dropdown"
        placeholder="Select a fruit"
        loading
        defaultOpen
        options={defaultOptions}
      />
      <Select
        label="Custom loading message"
        placeholder="Select a fruit"
        loading
        defaultOpen
        loadingPlaceholder="Fetching fruits..."
        options={defaultOptions}
      />
    </div>
  ),
};

export const WithDisabledOptions: Story = {
  render: () => (
    <Select
      label="Favorite fruit"
      placeholder="Choose a fruit"
      options={[
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana', disabled: true },
        { value: 'orange', label: 'Orange' },
        { value: 'grape', label: 'Grape', disabled: true },
        { value: 'mango', label: 'Mango' },
      ]}
    />
  ),
};

export const WithOptionChildren: Story = {
  render: () => (
    <Select label="Favorite fruit" placeholder="Choose a fruit" defaultValue="banana">
      <Select.Option value="apple">Apple</Select.Option>
      <Select.Option value="banana">Banana</Select.Option>
      <Select.Option value="orange">Orange</Select.Option>
      <Select.Option value="grape" disabled>
        Grape (unavailable)
      </Select.Option>
    </Select>
  ),
};

function ControlledSelectDemo() {
  const [value, setValue] = useState<string | undefined>('apple');

  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Select
        label="Controlled select"
        placeholder="Choose a fruit"
        value={value}
        onChange={setValue}
        allowClear
        options={defaultOptions}
      />
      <p className="text-body-sm text-text-description">
        Selected value: {value ?? 'none'}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledSelectDemo />,
};

function LocalSearchDemo() {
  const [value, setValue] = useState<string | undefined>();
  const [lastSearch, setLastSearch] = useState('');

  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Select
        label="Local search"
        placeholder="Select a fruit"
        allowSearch
        localSearch
        value={value}
        onChange={setValue}
        onSearch={setLastSearch}
        options={defaultOptions}
      />
      <p className="text-body-sm text-text-description">
        Search query: {lastSearch || 'none'}
      </p>
      <p className="text-body-sm text-text-description">
        Selected value: {value ?? 'none'}
      </p>
    </div>
  );
}

export const WithLocalSearch: Story = {
  render: () => <LocalSearchDemo />,
};

const remoteSearchOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'watermelon', label: 'Watermelon' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'strawberry', label: 'Strawberry' },
];

function RemoteSearchDemo() {
  const [value, setValue] = useState<string | undefined>();
  const [options, setOptions] = useState(remoteSearchOptions);
  const [lastSearch, setLastSearch] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Select
        label="Remote search"
        placeholder="Type to search fruits"
        allowSearch
        localSearch={false}
        loading={loading}
        value={value}
        onChange={setValue}
        options={options}
        onSearch={(searchValue) => {
          setLastSearch(searchValue);
          setLoading(true);

          window.setTimeout(() => {
            const query = searchValue.trim().toLowerCase();

            if (!query) {
              setOptions(remoteSearchOptions);
            } else {
              setOptions(
                remoteSearchOptions.filter((option) =>
                  option.label.toLowerCase().includes(query)
                )
              );
            }

            setLoading(false);
          }, 800);
        }}
      />
      <p className="text-body-sm text-text-description">
        Search query: {lastSearch || 'none'}
      </p>
      <p className="text-body-sm text-text-description">
        Options shown:{' '}
        {options.map((option) => option.label).join(', ') || 'none'}
      </p>
    </div>
  );
}

export const WithRemoteSearch: Story = {
  render: () => <RemoteSearchDemo />,
};

export const EmptyOptions: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Select
        label="Empty list"
        placeholder="Select a fruit"
        options={[]}
      />
      <Select
        label="Custom empty message"
        placeholder="Select a fruit"
        options={[]}
        emptyPlaceholder="No fruits available"
      />
    </div>
  ),
};

export const OptionsError: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Select
        label="Options error"
        placeholder="Select a fruit"
        optionsError
        defaultOpen
        options={[]}
      />
      <Select
        label="Custom error message"
        placeholder="Select a fruit"
        optionsError
        defaultOpen
        options={[]}
        errorPlaceholder="Unable to fetch fruits. Please try again."
      />
    </div>
  ),
};

function RemoteSearchErrorDemo() {
  const [value, setValue] = useState<string | undefined>();
  const [options, setOptions] = useState(remoteSearchOptions);
  const [loading, setLoading] = useState(false);
  const [optionsError, setOptionsError] = useState(false);
  const [lastSearch, setLastSearch] = useState('');

  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Select
        label="Remote search with error"
        placeholder="Type to search fruits"
        allowSearch
        localSearch={false}
        loading={loading}
        optionsError={optionsError}
        value={value}
        onChange={setValue}
        options={options}
        onSearch={(searchValue) => {
          setLastSearch(searchValue);
          setOptionsError(false);
          setLoading(true);

          window.setTimeout(() => {
            if (searchValue.trim().toLowerCase() === 'error') {
              setOptions([]);
              setOptionsError(true);
            } else {
              const query = searchValue.trim().toLowerCase();

              if (!query) {
                setOptions(remoteSearchOptions);
              } else {
                setOptions(
                  remoteSearchOptions.filter((option) =>
                    option.label.toLowerCase().includes(query)
                  )
                );
              }
            }

            setLoading(false);
          }, 800);
        }}
      />
      <p className="text-body-sm text-text-description">
        Type &quot;error&quot; to simulate a failed fetch.
      </p>
      <p className="text-body-sm text-text-description">
        Search query: {lastSearch || 'none'}
      </p>
    </div>
  );
}

export const WithRemoteSearchError: Story = {
  render: () => <RemoteSearchErrorDemo />,
};

function MultipleSelectDemo() {
  const [value, setValue] = useState<string[]>(['apple', 'banana']);

  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Select
        label="Favorite fruits"
        placeholder="Select fruits"
        multiple
        allowClear
        value={value}
        onChange={setValue}
        options={defaultOptions}
      />
      <p className="text-body-sm text-text-description">
        Selected: {value.length > 0 ? value.join(', ') : 'none'}
      </p>
    </div>
  );
}

export const Multiple: Story = {
  render: () => <MultipleSelectDemo />,
};

export const MultipleWithSearch: Story = {
  render: () => (
    <Select
      label="Favorite fruits"
      placeholder="Select fruits"
      multiple
      allowSearch
      allowClear
      defaultValue={['orange']}
      options={defaultOptions}
    />
  ),
};

function MaxSelectedDemo() {
  const [value, setValue] = useState<string[]>(['apple']);

  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Select
        label="Pick up to 2 fruits"
        placeholder="Select fruits"
        multiple
        maxSelected={2}
        allowClear
        value={value}
        onChange={setValue}
        options={defaultOptions}
      />
      <p className="text-body-sm text-text-description">
        Selected ({value.length}/2):{' '}
        {value.length > 0 ? value.join(', ') : 'none'}
      </p>
    </div>
  );
}

export const MultipleWithMaxSelected: Story = {
  render: () => <MaxSelectedDemo />,
};

export const ManyLongLabelOptions: Story = {
  render: () => (
    <div className="max-w-md">
      <Select
        label="Product catalog"
        placeholder="Select a product from the catalog"
        allowSearch
        allowClear
        options={manyLongLabelOptions}
      />
    </div>
  ),
};

function MultipleLongContentLiveSearchDemo() {
  const [value, setValue] = useState<string[]>(['catalog-item-1']);
  const [lastSearch, setLastSearch] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex max-w-md flex-col gap-3">
      <Select
        label="Product catalog"
        placeholder="Search and select products"
        multiple
        allowSearch
        localSearch
        allowClear
        maxSelected={4}
        loading={loading}
        value={value}
        onChange={setValue}
        onSearch={(searchValue) => {
          setLastSearch(searchValue);
          setLoading(true);

          window.setTimeout(() => {
            setLoading(false);
          }, 600);
        }}
        options={manyLongLabelOptions}
      />
      <p className="text-body-sm text-text-description">
        Search query: {lastSearch || 'none'}
      </p>
      <p className="text-body-sm text-text-description">
        Loading: {loading ? 'yes' : 'no'}
      </p>
      <p className="text-body-sm text-text-description">
        Selected ({value.length}/4):{' '}
        {value.length > 0 ? value.join(', ') : 'none'}
      </p>
    </div>
  );
}

export const MultipleLongContentLiveSearch: Story = {
  render: () => <MultipleLongContentLiveSearchDemo />,
};

function SelectPlacementDemo({
  label,
  placement,
  defaultOpen = true,
}: {
  label: string;
  placement: DropdownPlacement;
  defaultOpen?: boolean;
}) {
  return (
    <div className="flex items-start gap-6">
      <span className="w-48 shrink-0 pt-2 text-body-sm text-text-description">
        {label}
      </span>
      <div className="w-64">
        <Select
          label="Favorite fruit"
          placeholder="Select a fruit"
          placement={placement}
          defaultOpen={defaultOpen}
          options={defaultOptions}
        />
      </div>
    </div>
  );
}

export const Placements: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="flex flex-col gap-16">
      <StorySection title="Bottom placements">
        <div className="flex flex-col gap-8 py-8">
          {selectPlacements
            .filter((placement) => placement.startsWith('bottom'))
            .map((placement) => (
              <SelectPlacementDemo
                key={placement}
                label={`Placement: ${selectPlacementLabels[placement]}`}
                placement={placement}
              />
            ))}
        </div>
      </StorySection>

      <StorySection title="Top placements">
        <div className="flex flex-col gap-8 py-24">
          {selectPlacements
            .filter((placement) => placement.startsWith('top'))
            .map((placement) => (
              <SelectPlacementDemo
                key={placement}
                label={`Placement: ${selectPlacementLabels[placement]}`}
                placement={placement}
              />
            ))}
        </div>
      </StorySection>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-8">
      <StorySection title="Default">
        <Select placeholder="Select a fruit" options={defaultOptions} />
      </StorySection>

      <StorySection title="With label & value">
        <Select
          label="Favorite fruit"
          defaultValue="orange"
          options={defaultOptions}
        />
      </StorySection>

      <StorySection title="With prefix & clear">
        <Select
          label="Category"
          prefix={<Icon name="tag" size="md" />}
          allowClear
          defaultValue="food"
          options={[
            { value: 'food', label: 'Food & Drink' },
            { value: 'tech', label: 'Technology' },
            { value: 'travel', label: 'Travel' },
          ]}
        />
      </StorySection>

      <StorySection title="Error state">
        <Select
          label="Favorite fruit"
          status="error"
          error="Please select a fruit"
          options={defaultOptions}
        />
      </StorySection>
    </div>
  ),
};
