import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';

import { Icon } from '../icon';
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
