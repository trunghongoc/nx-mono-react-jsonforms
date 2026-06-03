/// <reference lib="dom" />

import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';

import { DropdownItem } from '../dropdown/dropdown-item';
import {
  DropdownMenu,
  useDropdownPosition,
  type DropdownPlacement,
} from '../dropdown/dropdown';
import { Icon } from '../icon';
import { Tag } from '../tag';
import {
  baseClasses,
  cn,
  FieldLayout,
  FieldPrefix,
  hasPrefixContent,
  inputSizeClasses,
  inputWithPrefixClasses,
  prefixFieldPaddingClasses,
  prefixWrapperBorderClasses,
  statusIconConfig,
  type BaseFieldProps,
  type InputSize,
  type InputStatus,
} from '../input/field-shared';
import { SelectOption, type SelectOptionProps } from './select-option';

export type { InputSize as SelectSize, InputStatus as SelectStatus };

export type SelectOptionData = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type SelectSharedProps = BaseFieldProps & {
  placeholder?: string;
  /** Shown in the dropdown when there are no options. */
  emptyPlaceholder?: ReactNode;
  /** Shown in the dropdown while options are loading. */
  loadingPlaceholder?: ReactNode;
  /** Shown in the dropdown when loading options fails. */
  errorPlaceholder?: ReactNode;
  /** When true, the dropdown shows `errorPlaceholder` instead of options. */
  optionsError?: boolean;
  options?: SelectOptionData[];
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  allowSearch?: boolean;
  localSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (searchValue: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: DropdownPlacement;
  className?: string;
  menuClassName?: string;
  id?: string;
  required?: boolean;
  /** When true (default), selected options do not show a check icon in the menu. */
  hideOptionCheckedIcon?: boolean;
  'aria-describedby'?: string;
};

export type SelectSingleProps = SelectSharedProps & {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
};

export type SelectMultipleProps = SelectSharedProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Maximum number of options that can be selected. */
  maxSelected?: number;
};

export type SelectProps = SelectSingleProps | SelectMultipleProps;

function collectSelectOptions(children: ReactNode): SelectOptionData[] {
  const options: SelectOptionData[] = [];

  const walk = (nodes: ReactNode) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === Fragment) {
        walk((child.props as { children?: ReactNode }).children);
        return;
      }

      if (child.type === SelectOption) {
        const optionChild = child as ReactElement<SelectOptionProps>;
        options.push({
          value: optionChild.props.value,
          label: optionChild.props.children,
          disabled: optionChild.props.disabled,
        });
      }
    });
  };

  walk(children);
  return options;
}

function getOptionSearchText(option: SelectOptionData) {
  if (typeof option.label === 'string' || typeof option.label === 'number') {
    return `${option.label} ${option.value}`;
  }

  return option.value;
}

function filterOptionsLocally(
  options: SelectOptionData[],
  searchValue: string
) {
  const query = searchValue.trim().toLowerCase();

  if (!query) {
    return options;
  }

  return options.filter((option) =>
    getOptionSearchText(option).toLowerCase().includes(query)
  );
}

function getSuffixPadding({
  hasStatus,
  hasClear,
}: {
  hasStatus: boolean;
  hasClear: boolean;
}) {
  const iconCount = (hasStatus ? 1 : 0) + (hasClear ? 1 : 0);

  if (iconCount === 0) {
    return '';
  }

  if (iconCount === 1) {
    return 'pr-[35px]';
  }

  return 'pr-[59px]';
}

const suffixIconBaseClasses =
  'absolute top-1/2 -translate-y-[calc(50%+1px)]';

const suffixFirstIconClasses = `${suffixIconBaseClasses} right-[35px]`;
const suffixSecondIconClasses = `${suffixIconBaseClasses} right-[59px]`;

const emptyMultipleValues: string[] = [];

const multipleSizeClasses: Record<InputSize, string> = {
  sm: 'min-h-control-sm py-1',
  md: 'min-h-control py-1',
  lg: 'min-h-control-lg py-1.5',
};

const selectMenuScrollClasses =
  '!min-w-0 overflow-x-hidden overflow-y-auto max-h-80';

const selectMenuShellClasses =
  '!min-w-0 flex max-h-80 flex-col overflow-hidden';

const selectMenuBodyScrollClasses =
  'min-h-0 flex-1 overflow-x-hidden overflow-y-auto';

function getMenuWidthStyle(menuWidth?: number): CSSProperties | undefined {
  if (menuWidth == null) {
    return undefined;
  }

  return {
    width: menuWidth,
    minWidth: menuWidth,
    maxWidth: menuWidth,
  };
}

function getMenuPanelStyle(
  position: { top: number; left: number },
  menuWidth?: number
) {
  return {
    top: position.top,
    left: position.left,
    ...getMenuWidthStyle(menuWidth),
  };
}

function SelectRoot(props: SelectProps) {
  const {
    placeholder = 'Select an option',
    emptyPlaceholder = 'No options',
    loadingPlaceholder = 'Loading...',
    errorPlaceholder = 'Failed to load options',
    value,
    defaultValue,
    onChange,
    options: optionsProp,
    children,
    size = 'md',
    status,
    label,
    tooltip,
    error,
    prefix,
    required,
    hideOptionCheckedIcon = true,
    disabled = false,
    loading = false,
    optionsError = false,
    allowClear = false,
    allowSearch = false,
    localSearch = true,
    searchPlaceholder = 'Search...',
    onSearch,
    open,
    defaultOpen = false,
    onOpenChange,
    placement,
    className,
    menuClassName,
    id: idProp,
    'aria-describedby': ariaDescribedBy,
  } = props;
  const multiple = props.multiple === true;
  const maxSelected = multiple
    ? (props as SelectMultipleProps).maxSelected
    : undefined;
  const generatedId = useId();
  const errorId = useId();
  const menuId = useId();
  const selectId = idProp ?? generatedId;
  const controlRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const optionsScrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuKeyDownRef = useRef<
    ((event: ReactKeyboardEvent<HTMLElement>) => void) | null
  >(null);
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalSingleValue, setInternalSingleValue] = useState<string | undefined>(
    multiple ? undefined : (defaultValue as string | undefined)
  );
  const [internalMultipleValue, setInternalMultipleValue] = useState<string[]>(
    multiple ? ((defaultValue as string[] | undefined) ?? []) : []
  );
  const [menuWidth, setMenuWidth] = useState<number>();
  const [searchValue, setSearchValue] = useState('');

  const isOpenControlled = open !== undefined;
  const isValueControlled = value !== undefined;
  const isOpen = isOpenControlled ? open : internalOpen;
  const selectedSingleValue = isValueControlled
    ? (value as string | undefined)
    : internalSingleValue;
  const selectedMultipleValues = multiple
    ? isValueControlled
      ? ((value as string[] | undefined) ?? emptyMultipleValues)
      : internalMultipleValue
    : emptyMultipleValues;

  const resolvedOptions = useMemo(() => {
    if (optionsProp != null) {
      return optionsProp;
    }

    return collectSelectOptions(children);
  }, [children, optionsProp]);

  const displayOptions = useMemo(() => {
    if (!allowSearch || !localSearch) {
      return resolvedOptions;
    }

    return filterOptionsLocally(resolvedOptions, searchValue);
  }, [allowSearch, localSearch, resolvedOptions, searchValue]);

  const selectedOption = multiple
    ? undefined
    : resolvedOptions.find((option) => option.value === selectedSingleValue);
  const selectedOptions = multiple
    ? selectedMultipleValues
        .map((selectedValue) =>
          resolvedOptions.find((option) => option.value === selectedValue)
        )
        .filter((option): option is SelectOptionData => option != null)
    : [];
  const hasSelection = multiple
    ? selectedMultipleValues.length > 0
    : selectedSingleValue != null && selectedSingleValue !== '';
  const hasReachedMaxSelected =
    multiple &&
    maxSelected != null &&
    selectedMultipleValues.length >= maxSelected;
  const isOptionSelected = useCallback(
    (optionValue: string) =>
      multiple
        ? selectedMultipleValues.includes(optionValue)
        : selectedSingleValue === optionValue,
    [multiple, selectedMultipleValues, selectedSingleValue]
  );
  const isOptionSelectionLocked = useCallback(
    (optionValue: string) =>
      Boolean(
        multiple &&
          hasReachedMaxSelected &&
          !isOptionSelected(optionValue)
      ),
    [hasReachedMaxSelected, isOptionSelected, multiple]
  );
  const hasSourceOptions = resolvedOptions.length > 0;
  const hasDisplayOptions = displayOptions.length > 0;
  const showStandaloneEmptyPanel =
    !allowSearch && !hasSourceOptions && !loading && !optionsError;
  const hasError = error != null && error !== '';
  const hasPrefix = hasPrefixContent(prefix);
  const hasStatus = status != null;
  const hasClear = allowClear && hasSelection;
  const describedBy = cn(ariaDescribedBy, hasError && errorId) || undefined;

  const wrapperBorderClasses = status
    ? prefixWrapperBorderClasses[status]
    : prefixWrapperBorderClasses.default;

  const suffixPadding = getSuffixPadding({ hasStatus, hasClear });
  const fieldPaddingClasses = hasPrefix
    ? cn(prefixFieldPaddingClasses.default, suffixPadding)
    : cn('px-[11px]', suffixPadding);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange]
  );

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleTriggerClick = useCallback(() => {
    if (disabled) {
      return;
    }

    setOpen(!isOpen);
  }, [disabled, isOpen, setOpen]);

  const setSelectedSingleValue = useCallback(
    (nextValue: string) => {
      if (!isValueControlled) {
        setInternalSingleValue(nextValue);
      }

      (onChange as SelectSingleProps['onChange'])?.(nextValue);
    },
    [isValueControlled, onChange]
  );

  const setSelectedMultipleValues = useCallback(
    (nextValues: string[]) => {
      if (!isValueControlled) {
        setInternalMultipleValue(nextValues);
      }

      (onChange as SelectMultipleProps['onChange'])?.(nextValues);
    },
    [isValueControlled, onChange]
  );

  const handleClear: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (multiple) {
      if (!isValueControlled) {
        setInternalMultipleValue([]);
      }

      (onChange as SelectMultipleProps['onChange'])?.([]);
      return;
    }

    if (!isValueControlled) {
      setInternalSingleValue(undefined);
    }

    (onChange as SelectSingleProps['onChange'])?.(undefined);
  };

  const handleRemoveValue = useCallback(
    (optionValue: string) => {
      const nextValues = selectedMultipleValues.filter(
        (currentValue) => currentValue !== optionValue
      );
      setSelectedMultipleValues(nextValues);
    },
    [selectedMultipleValues, setSelectedMultipleValues]
  );

  const handleSearchChange = useCallback(
    (nextSearch: string) => {
      setSearchValue(nextSearch);
      onSearch?.(nextSearch);
    },
    [onSearch]
  );

  const position = useDropdownPosition({
    isOpen,
    mounted,
    anchorRef: controlRef,
    panelRef: menuRef,
    placement,
    deps: [
      displayOptions,
      placement,
      menuWidth,
      allowSearch,
      searchValue,
      loading,
      optionsError,
      multiple,
      selectedMultipleValues,
    ],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !controlRef.current) {
      return;
    }

    setMenuWidth(controlRef.current.offsetWidth);
  }, [isOpen, size, hasPrefix, hasStatus, hasClear, selectedSingleValue, selectedMultipleValues, multiple]);

  useLayoutEffect(() => {
    if (!isOpen || !allowSearch) {
      return;
    }

    searchInputRef.current?.focus({ preventScroll: true });
  }, [allowSearch, isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const scrollContainer = allowSearch
      ? optionsScrollRef.current
      : menuRef.current;

    scrollContainer?.scrollTo({ top: 0 });
  }, [allowSearch, isOpen, searchValue, displayOptions.length]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    setSearchValue('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setOpen]);

  const handleSelect = useCallback(
    (_content: ReactNode, index: number) => {
      const option = displayOptions[index];

      if (!option || option.disabled) {
        return;
      }

      if (multiple) {
        if (isOptionSelected(option.value)) {
          setSelectedMultipleValues(
            selectedMultipleValues.filter(
              (currentValue) => currentValue !== option.value
            )
          );
          return;
        }

        if (hasReachedMaxSelected) {
          return;
        }

        setSelectedMultipleValues([...selectedMultipleValues, option.value]);
        return;
      }

      setSelectedSingleValue(option.value);
    },
    [
      displayOptions,
      hasReachedMaxSelected,
      isOptionSelected,
      multiple,
      selectedMultipleValues,
      setSelectedMultipleValues,
      setSelectedSingleValue,
    ]
  );

  const renderOptionItems = () =>
    displayOptions.map((option) => {
      const selected = isOptionSelected(option.value);
      const selectionLocked = isOptionSelectionLocked(option.value);

      return (
        <DropdownItem
          key={option.value}
          disabled={option.disabled || selectionLocked}
        >
          <span className="flex w-full min-w-0 items-start justify-between gap-size-xs">
            <span
              className={cn(
                'min-w-0 flex-1 break-words whitespace-normal',
                (option.disabled || selectionLocked) && 'text-text-disabled',
                !option.disabled && !selectionLocked && selected && 'text-primary'
              )}
            >
              {option.label}
            </span>
            {selected && !hideOptionCheckedIcon ? (
              <Icon
                name="check"
                size="sm"
                className="mt-0.5 shrink-0 !text-primary"
              />
            ) : null}
          </span>
        </DropdownItem>
      );
    });

  const renderTriggerContent = () => {
    if (multiple) {
      if (selectedOptions.length === 0) {
        return (
          <span className="text-text-placeholder">{placeholder}</span>
        );
      }

      return selectedOptions.map((option) => (
        <Tag
          key={option.value}
          content={option.label}
          iconRight={{
            name: 'close',
            onClick: () => handleRemoveValue(option.value),
          }}
        />
      ));
    }

    return selectedOption?.label ?? placeholder;
  };

  const renderEmptyMessage = () => (
    <div className="px-padding-sm py-padding-md text-center text-body-md font-normal text-text-description">
      {emptyPlaceholder}
    </div>
  );

  const renderLoadingMessage = () => (
    <div className="flex items-center justify-center gap-size-xs px-padding-sm py-padding-md text-body-md font-normal text-text-description">
      <Icon name="loading" size="sm" spin className="!text-icon" aria-hidden />
      {loadingPlaceholder}
    </div>
  );

  const renderErrorMessage = () => (
    <div className="flex items-center justify-center gap-size-xs px-padding-sm py-padding-md text-center text-body-md font-normal text-error">
      <Icon
        name="close-circle"
        theme="filled"
        size="sm"
        className="shrink-0 !text-error"
        aria-hidden
      />
      {errorPlaceholder}
    </div>
  );

  const renderMenuBody = () => {
    if (loading) {
      return renderLoadingMessage();
    }

    if (optionsError) {
      return renderErrorMessage();
    }

    if (hasDisplayOptions) {
      return renderOptionItems();
    }

    return renderEmptyMessage();
  };

  const renderSearchInput = () => (
    <div
      className="flex shrink-0 items-center gap-size-xs border-b border-border px-padding-sm py-padding-xxs"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <Icon name="search" size="sm" className="shrink-0 text-icon" aria-hidden />
      <input
        ref={searchInputRef}
        type="search"
        value={searchValue}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        className={cn(inputWithPrefixClasses, 'w-full')}
        onChange={(event) => handleSearchChange(event.target.value)}
        onKeyDown={(event: ReactKeyboardEvent<HTMLInputElement>) => {
          event.stopPropagation();

          if (event.key === 'ArrowDown' && hasDisplayOptions && !loading && !optionsError) {
            event.preventDefault();
            optionsScrollRef.current?.focus({ preventScroll: true });
            menuKeyDownRef.current?.(event);
            return;
          }

          if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
          }
        }}
      />
    </div>
  );

  const menu =
    isOpen && mounted ? (
      showStandaloneEmptyPanel ? (
        <div
          ref={menuRef}
          id={menuId}
          role="listbox"
          aria-label="Options"
          aria-multiselectable={multiple || undefined}
          className={cn(
            'fixed z-dropdown rounded-border-lg bg-bg-elevated p-padding-xxs shadow-box-secondary',
            selectMenuScrollClasses,
            menuClassName
          )}
          style={getMenuPanelStyle(position, menuWidth)}
        >
          {optionsError ? renderErrorMessage() : renderEmptyMessage()}
        </div>
      ) : (
        <DropdownMenu
          ref={menuRef}
          id={menuId}
          position={position}
          className={cn(
            allowSearch ? selectMenuShellClasses : selectMenuScrollClasses,
            menuClassName
          )}
          style={getMenuWidthStyle(menuWidth)}
          useCustomItemColors={false}
          autoFocus={!allowSearch}
          closeMenu={multiple ? () => undefined : closeMenu}
          onClickItem={handleSelect}
          menuKeyDownRef={menuKeyDownRef}
        >
          {allowSearch ? (
            <>
              {renderSearchInput()}
              <div
                ref={optionsScrollRef}
                className={selectMenuBodyScrollClasses}
                tabIndex={-1}
              >
                {renderMenuBody()}
              </div>
            </>
          ) : (
            renderMenuBody()
          )}
        </DropdownMenu>
      )
    ) : null;

  const control = (
    <div
      ref={controlRef}
      className="group relative inline-flex w-full items-center"
    >
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-busy={loading || undefined}
        aria-controls={isOpen ? menuId : undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        onKeyDown={(event: ReactKeyboardEvent<HTMLButtonElement>) => {
          if (!isOpen || disabled || loading || !hasDisplayOptions) {
            return;
          }

          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            menuRef.current?.focus({ preventScroll: true });
            menuKeyDownRef.current?.(event);
          }
        }}
        onClick={handleTriggerClick}
        className={cn(
          'flex min-w-0 flex-1 items-center gap-size-xs text-left outline-none',
          baseClasses,
          multiple ? multipleSizeClasses[size] : inputSizeClasses[size],
          fieldPaddingClasses,
          wrapperBorderClasses,
          className,
          isOpen &&
            !disabled &&
            'border-primary hover:border-primary-hover focus:border-primary-hover focus-within:border-primary-hover',
          loading && !disabled && 'border-primary',
          disabled
            ? 'cursor-not-allowed border-border bg-bg-container-disabled text-text-disabled hover:border-border focus:border-border focus-within:border-border'
            : 'cursor-pointer',
          loading && !disabled && 'cursor-progress'
        )}
      >
        {hasPrefix ? <FieldPrefix prefix={prefix} disabled={disabled} /> : null}
        <span
          className={cn(
            'min-w-0 flex-1 text-left',
            multiple
              ? 'flex flex-wrap items-center gap-size-xxs'
              : 'truncate',
            !multiple &&
              (selectedOption ? 'text-text' : 'text-text-placeholder')
          )}
        >
          {renderTriggerContent()}
        </span>
        <span
          className={cn(
            'inline-flex shrink-0 items-center text-icon transition-colors',
            !disabled &&
              'group-hover:text-icon-hover group-focus-within:text-icon-hover',
            isOpen && !disabled && !loading && 'text-primary',
            loading && !disabled && 'text-primary',
            disabled && 'text-text-disabled'
          )}
          aria-hidden
        >
          {loading ? (
            <Icon name="loading" size="md" spin />
          ) : (
            <Icon
              name="down"
              size="md"
              className={cn(
                'transition-transform',
                isOpen && !disabled && 'rotate-180'
              )}
            />
          )}
        </span>
      </button>

      {hasStatus ? (
        <span
          className={cn(
            hasClear ? suffixSecondIconClasses : suffixFirstIconClasses,
            'pointer-events-none transition-colors',
            statusIconConfig[status].colorClass,
            !disabled && statusIconConfig[status].activeColorClass
          )}
          aria-hidden
        >
          <Icon
            name={statusIconConfig[status].name}
            theme="filled"
            size="md"
            className="!text-current"
          />
        </span>
      ) : null}

      {hasClear ? (
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label={multiple ? 'Clear all selections' : 'Clear selection'}
          className={cn(
            suffixFirstIconClasses,
            'inline-flex items-center text-icon transition-colors',
            !disabled &&
              'cursor-pointer hover:text-icon-hover group-hover:text-icon-hover group-focus-within:text-icon-hover',
            disabled && 'cursor-not-allowed text-text-disabled'
          )}
          onClick={handleClear}
        >
          <Icon name="close-circle" theme="filled" size="md" />
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      <FieldLayout
        label={label}
        tooltip={tooltip}
        required={required}
        size={size}
        inputId={selectId}
        hasError={hasError}
        error={error}
        errorId={errorId}
      >
        {control}
      </FieldLayout>
      {menu && mounted ? createPortal(menu, document.body) : null}
    </>
  );
}

export const Select = Object.assign(SelectRoot, {
  Option: SelectOption,
});

export default Select;
