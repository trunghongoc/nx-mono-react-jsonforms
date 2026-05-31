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
} from 'react';
import { createPortal } from 'react-dom';

import { DropdownItem } from '../dropdown/dropdown-item';
import {
  DropdownMenu,
  useDropdownPosition,
  type DropdownPlacement,
} from '../dropdown/dropdown';
import { Icon } from '../icon';
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
  suffixIconPositionClasses,
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

export interface SelectProps extends BaseFieldProps {
  placeholder?: string;
  /** Shown in the dropdown when there are no options. */
  emptyPlaceholder?: ReactNode;
  /** Shown in the dropdown while options are loading. */
  loadingPlaceholder?: ReactNode;
  /** Shown in the dropdown when loading options fails. */
  errorPlaceholder?: ReactNode;
  /** When true, the dropdown shows `errorPlaceholder` instead of options. */
  optionsError?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
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
  'aria-describedby'?: string;
}

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
  const iconCount = 1 + (hasStatus ? 1 : 0) + (hasClear ? 1 : 0);

  if (iconCount === 1) {
    return 'pr-[35px]';
  }

  if (iconCount === 2) {
    return 'pr-[59px]';
  }

  return 'pr-[83px]';
}

const suffixIconBaseClasses =
  'absolute top-1/2 -translate-y-[calc(50%+1px)]';

const suffixFirstIconClasses = `${suffixIconBaseClasses} right-[35px]`;
const suffixSecondIconClasses = `${suffixIconBaseClasses} right-[59px]`;

function SelectRoot({
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
}: SelectProps) {
  const generatedId = useId();
  const errorId = useId();
  const menuId = useId();
  const selectId = idProp ?? generatedId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuKeyDownRef = useRef<
    ((event: ReactKeyboardEvent<HTMLElement>) => void) | null
  >(null);
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [menuMinWidth, setMenuMinWidth] = useState<number>();
  const [searchValue, setSearchValue] = useState('');

  const isOpenControlled = open !== undefined;
  const isValueControlled = value !== undefined;
  const isOpen = isOpenControlled ? open : internalOpen;
  const selectedValue = isValueControlled ? value : internalValue;

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

  const selectedOption = resolvedOptions.find(
    (option) => option.value === selectedValue
  );
  const hasSourceOptions = resolvedOptions.length > 0;
  const hasDisplayOptions = displayOptions.length > 0;
  const showStandaloneEmptyPanel =
    !allowSearch && !hasSourceOptions && !loading && !optionsError;
  const hasError = error != null && error !== '';
  const hasPrefix = hasPrefixContent(prefix);
  const hasStatus = status != null;
  const hasClear = allowClear && selectedValue != null && selectedValue !== '';
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

  const setSelectedValue = useCallback(
    (nextValue: string) => {
      if (!isValueControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [isValueControlled, onChange]
  );

  const handleClear: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isValueControlled) {
      setInternalValue(undefined);
    }

    onChange?.(undefined);
  };

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
    anchorRef: triggerRef,
    panelRef: menuRef,
    placement,
    deps: [
      displayOptions,
      placement,
      menuMinWidth,
      allowSearch,
      searchValue,
      loading,
      optionsError,
    ],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }

    setMenuMinWidth(triggerRef.current.offsetWidth);
  }, [isOpen, size, hasPrefix, hasStatus, hasClear, selectedValue]);

  useLayoutEffect(() => {
    if (!isOpen || !allowSearch) {
      return;
    }

    searchInputRef.current?.focus({ preventScroll: true });
  }, [allowSearch, isOpen]);

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

      setSelectedValue(option.value);
    },
    [displayOptions, setSelectedValue]
  );

  const renderOptionItems = () =>
    displayOptions.map((option) => (
      <DropdownItem key={option.value} disabled={option.disabled}>
        <span className="flex w-full items-center justify-between gap-size-xs">
          <span
            className={cn(
              option.disabled && 'text-text-disabled',
              !option.disabled &&
                option.value === selectedValue &&
                'text-primary'
            )}
          >
            {option.label}
          </span>
          {option.value === selectedValue ? (
            <Icon name="check" size="sm" className="shrink-0 !text-primary" />
          ) : null}
        </span>
      </DropdownItem>
    ));

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
      className="flex items-center gap-size-xs border-b border-border px-padding-sm py-padding-xxs"
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
            menuRef.current?.focus({ preventScroll: true });
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
          className={cn(
            'fixed z-dropdown min-w-[calc(var(--spacing-size-lg)*5)] rounded-border-lg bg-bg-elevated p-padding-xxs shadow-box-secondary',
            menuClassName
          )}
          style={{
            top: position.top,
            left: position.left,
            ...(menuMinWidth != null ? { minWidth: menuMinWidth } : null),
          }}
        >
          {optionsError ? renderErrorMessage() : renderEmptyMessage()}
        </div>
      ) : (
        <DropdownMenu
          ref={menuRef}
          id={menuId}
          position={position}
          className={menuClassName}
          style={
            menuMinWidth != null ? { minWidth: menuMinWidth } : undefined
          }
          useCustomItemColors={false}
          closeMenu={closeMenu}
          onClickItem={handleSelect}
          menuKeyDownRef={menuKeyDownRef}
        >
          {allowSearch ? renderSearchInput() : null}
          {renderMenuBody()}
        </DropdownMenu>
      )
    ) : null;

  const control = (
    <div
      className={cn(
        'group relative inline-flex w-full items-center',
        baseClasses,
        inputSizeClasses[size],
        fieldPaddingClasses,
        wrapperBorderClasses,
        className,
        isOpen &&
          !disabled &&
          'border-primary hover:border-primary-hover focus-within:border-primary-hover',
        loading && !disabled && 'border-primary',
        disabled &&
          'cursor-not-allowed border-border bg-bg-container-disabled text-text-disabled hover:border-border focus-within:border-border'
      )}
    >
      {hasPrefix ? <FieldPrefix prefix={prefix} disabled={disabled} /> : null}

      <button
        ref={triggerRef}
        id={selectId}
        type="button"
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
        onClick={() => {
          if (disabled) {
            return;
          }

          setOpen(!isOpen);
        }}
        className={cn(
          'min-w-0 flex-1 truncate border-0 bg-transparent p-0 text-left text-body-md outline-none',
          selectedOption ? 'text-text' : 'text-text-placeholder',
          'focus:border-transparent focus:shadow-none',
          disabled && 'cursor-not-allowed text-text-disabled',
          loading && !disabled && 'cursor-progress'
        )}
      >
        {selectedOption?.label ?? placeholder}
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
          aria-label="Clear selection"
          className={cn(
            suffixFirstIconClasses,
            'text-icon transition-colors',
            !disabled &&
              'cursor-pointer hover:text-icon-hover group-hover:text-icon-hover group-focus-within:text-icon-hover',
            disabled && 'cursor-not-allowed text-text-disabled'
          )}
          onClick={handleClear}
        >
          <Icon name="close-circle" theme="filled" size="md" />
        </button>
      ) : null}

      <span
        className={cn(
          suffixIconPositionClasses,
          'pointer-events-none text-icon transition-colors',
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
