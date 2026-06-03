import {
  useCallback,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';

import { Icon } from '../icon';
import { Select, type SelectSize } from '../select';
import {
  getPaginationPageItems,
  getTotalPages,
  type PaginationPageItem,
} from './pagination-utils';

export type PaginationSize = 'md' | 'sm';

export type PaginationProps = {
  className?: string;
  size?: PaginationSize;
  disabled?: boolean;
  /** Current page (1-based). */
  current?: number;
  defaultCurrent?: number;
  /** Total number of pages. Ignored when `totalItems` is set. */
  total?: number;
  /** Total item count; pages are derived from `pageSize`. */
  totalItems?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize: number) => void;
  /** Custom previous control content. When set, uses primary text styling. */
  prevIcon?: ReactNode;
  /** Custom next control content. When set, uses primary text styling. */
  nextIcon?: ReactNode;
  showSizeChanger?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  hideOnSinglePage?: boolean;
  /** Number of pages to jump when clicking the ellipsis control. Default: 5. */
  jumpSize?: number;
  /**
   * Max page-number buttons shown (excludes prev, next, and ellipsis).
   * Default: 7.
   */
  pageItemCount?: number;
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

const rootGapClasses: Record<PaginationSize, string> = {
  md: 'gap-[4px]',
  sm: 'gap-[2px]',
};

const itemSizeClasses: Record<PaginationSize, string> = {
  md: 'h-control min-w-control px-[6px]',
  sm: 'h-control-sm min-w-control-sm px-[1px]',
};

const iconSizeByPaginationSize: Record<PaginationSize, number> = {
  md: 14,
  sm: 12,
};

const selectSizeByPaginationSize: Record<PaginationSize, SelectSize> = {
  md: 'md',
  sm: 'sm',
};

function getEllipsisAriaLabel(
  variant: 'ellipsis-start' | 'ellipsis-end',
  jumpSize: number
) {
  return variant === 'ellipsis-start'
    ? `Show previous ${jumpSize} pages`
    : `Show next ${jumpSize} pages`;
}

const itemBaseClasses =
  'box-border inline-flex cursor-pointer select-none items-center justify-center rounded-border text-body-md font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-control-outline';

function PaginationItem({
  active,
  disabled,
  size,
  children,
  onClick,
  'aria-label': ariaLabel,
  'aria-current': ariaCurrent,
}: {
  active?: boolean;
  disabled?: boolean;
  size: PaginationSize;
  children: ReactNode;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  'aria-label'?: string;
  'aria-current'?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        itemBaseClasses,
        itemSizeClasses[size],
        active && !disabled
          ? 'border border-solid border-primary font-semibold text-primary hover:border-primary-hover hover:text-primary-hover [&_svg]:!text-current'
          : active && disabled
            ? 'bg-control-item-bg-active-disabled font-semibold text-text-disabled'
            : 'text-text hover:bg-bg-text-hover',
        disabled && !active && 'pointer-events-none text-text-disabled hover:bg-transparent',
        disabled && active && 'pointer-events-none hover:bg-control-item-bg-active-disabled'
      )}
    >
      {children}
    </button>
  );
}

function PaginationEllipsis({
  size,
  disabled,
  variant,
  jumpSize,
  onClick,
}: {
  size: PaginationSize;
  disabled?: boolean;
  variant: 'ellipsis-start' | 'ellipsis-end';
  jumpSize: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const iconColorClass = disabled ? 'text-text-disabled' : 'text-text';
  const jumpIconName =
    variant === 'ellipsis-start' ? 'double-left' : 'double-right';

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        itemBaseClasses,
        itemSizeClasses[size],
        'text-text',
        disabled
          ? 'cursor-default text-text-disabled'
          : 'cursor-pointer hover:bg-bg-text-hover',
        disabled && 'pointer-events-none'
      )}
      aria-label={getEllipsisAriaLabel(variant, jumpSize)}
      onClick={onClick}
      onMouseEnter={() => {
        if (!disabled) {
          setHovered(true);
        }
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <Icon
        name={hovered && !disabled ? jumpIconName : 'ellipsis'}
        size={iconSizeByPaginationSize[size]}
        className={cn('shrink-0', iconColorClass)}
      />
    </button>
  );
}

function PaginationNavButton({
  size,
  disabled,
  useTextStyle,
  onClick,
  children,
  'aria-label': ariaLabel,
}: {
  size: PaginationSize;
  disabled?: boolean;
  useTextStyle: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  children: ReactNode;
  'aria-label': string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        itemBaseClasses,
        itemSizeClasses[size],
        useTextStyle
          ? disabled
            ? 'text-text-disabled'
            : 'text-primary hover:text-primary'
          : disabled
            ? 'text-text-disabled'
            : 'text-text hover:bg-bg-text-hover',
        disabled && 'pointer-events-none hover:bg-transparent'
      )}
    >
      {children}
    </button>
  );
}

function renderPageItem(
  item: PaginationPageItem,
  current: number,
  totalPages: number,
  size: PaginationSize,
  disabled: boolean | undefined,
  jumpSize: number,
  onPageChange: (page: number) => void
) {
  if (item === 'ellipsis-start' || item === 'ellipsis-end') {
    const targetPage =
      item === 'ellipsis-start'
        ? Math.max(1, current - jumpSize)
        : Math.min(totalPages, current + jumpSize);

    return (
      <PaginationEllipsis
        key={item}
        size={size}
        disabled={disabled}
        variant={item}
        jumpSize={jumpSize}
        onClick={() => onPageChange(targetPage)}
      />
    );
  }

  return (
    <PaginationItem
      key={item}
      size={size}
      active={item === current}
      disabled={disabled}
      aria-label={`Page ${item}`}
      aria-current={item === current}
      onClick={() => onPageChange(item)}
    >
      {item}
    </PaginationItem>
  );
}

export function Pagination({
  className,
  size = 'md',
  disabled = false,
  current: currentProp,
  defaultCurrent = 1,
  total: totalProp,
  totalItems,
  pageSize: pageSizeProp,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onChange,
  prevIcon,
  nextIcon,
  showSizeChanger = false,
  showTotal,
  hideOnSinglePage = false,
  jumpSize = 5,
  pageItemCount = 7,
}: PaginationProps) {
  const resolvedJumpSize = Math.max(1, jumpSize);
  const resolvedPageItemCount = Math.max(1, pageItemCount);
  const [uncontrolledPage, setUncontrolledPage] = useState(defaultCurrent);
  const [uncontrolledPageSize, setUncontrolledPageSize] =
    useState(defaultPageSize);

  const pageSize = pageSizeProp ?? uncontrolledPageSize;
  const current = currentProp ?? uncontrolledPage;

  const totalPages = useMemo(() => {
    if (totalItems != null) {
      return getTotalPages(totalItems, pageSize);
    }

    return Math.max(0, totalProp ?? 0);
  }, [totalItems, pageSize, totalProp]);

  const emitChange = useCallback(
    (page: number, nextPageSize: number) => {
      if (currentProp == null) {
        setUncontrolledPage(page);
      }
      if (pageSizeProp == null) {
        setUncontrolledPageSize(nextPageSize);
      }
      onChange?.(page, nextPageSize);
    },
    [currentProp, onChange, pageSizeProp]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const nextPage = Math.min(Math.max(1, page), Math.max(1, totalPages));
      emitChange(nextPage, pageSize);
    },
    [emitChange, pageSize, totalPages]
  );

  const handlePageSizeChange = useCallback(
    (value: string | undefined) => {
      const nextPageSize = Number(value);
      if (!value || Number.isNaN(nextPageSize) || nextPageSize <= 0) {
        return;
      }

      const nextTotalPages =
        totalItems != null
          ? getTotalPages(totalItems, nextPageSize)
          : totalPages;
      const nextPage = Math.min(current, Math.max(1, nextTotalPages));
      emitChange(nextPage, nextPageSize);
    },
    [current, emitChange, totalItems, totalPages]
  );

  const pageItems = useMemo(
    () => getPaginationPageItems(current, totalPages, resolvedPageItemCount),
    [current, totalPages, resolvedPageItemCount]
  );

  const pageSizeSelectOptions = useMemo(
    () =>
      pageSizeOptions.map((option) => ({
        value: String(option),
        label: `${option} / page`,
      })),
    [pageSizeOptions]
  );

  if (hideOnSinglePage && totalPages <= 1) {
    return null;
  }

  const prevDisabled = disabled || current <= 1;
  const nextDisabled = disabled || current >= totalPages || totalPages === 0;
  const useTextNav = prevIcon != null || nextIcon != null;

  const rangeStart =
    totalItems != null && totalPages > 0
      ? (current - 1) * pageSize + 1
      : 0;
  const rangeEnd =
    totalItems != null && totalPages > 0
      ? Math.min(current * pageSize, totalItems)
      : 0;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'inline-flex flex-wrap items-center text-body-md font-normal',
        rootGapClasses[size],
        className
      )}
    >
      {showTotal && totalItems != null ? (
        <span className="mr-size-xs text-text">
          {showTotal(totalItems, [rangeStart, rangeEnd])}
        </span>
      ) : null}

      <PaginationNavButton
        size={size}
        disabled={prevDisabled}
        useTextStyle={useTextNav}
        aria-label="Previous page"
        onClick={() => handlePageChange(current - 1)}
      >
        {prevIcon ?? (
          <Icon
            name="left"
            size={iconSizeByPaginationSize[size]}
            className={prevDisabled ? 'text-text-disabled' : undefined}
          />
        )}
      </PaginationNavButton>

      {pageItems.map((item) =>
        renderPageItem(
          item,
          current,
          totalPages,
          size,
          disabled,
          resolvedJumpSize,
          handlePageChange
        )
      )}

      <PaginationNavButton
        size={size}
        disabled={nextDisabled}
        useTextStyle={useTextNav}
        aria-label="Next page"
        onClick={() => handlePageChange(current + 1)}
      >
        {nextIcon ?? (
          <Icon
            name="right"
            size={iconSizeByPaginationSize[size]}
            className={nextDisabled ? 'text-text-disabled' : undefined}
          />
        )}
      </PaginationNavButton>

      {showSizeChanger ? (
        <span className="inline-flex shrink-0 items-center">
          <Select
            size={selectSizeByPaginationSize[size]}
            value={String(pageSize)}
            options={pageSizeSelectOptions}
            disabled={disabled}
            onChange={handlePageSizeChange}
            className="!w-auto min-w-[96px] shrink-0"
            aria-label="Items per page"
          />
        </span>
      ) : null}
    </nav>
  );
}

export default Pagination;
