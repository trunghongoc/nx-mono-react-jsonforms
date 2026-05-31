import {
  createElement,
  forwardRef,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { Link, type LinkProps } from 'react-router-dom';

import { cn } from '../overlay';
import {
  mergeItemRef,
  useDropdownMenuContext,
} from './dropdown-context';

export interface DropdownItemColors {
  text?: string;
  hoverBg?: string;
}

export type DropdownItemAs = typeof Link | 'span' | 'label' | 'a';

export type DropdownItemAsProps =
  | LinkProps
  | ComponentPropsWithoutRef<'span'>
  | ComponentPropsWithoutRef<'label'>
  | ComponentPropsWithoutRef<'a'>;

export interface DropdownItemProps {
  children: ReactNode;
  disabled?: boolean;
  colors?: DropdownItemColors;
  className?: string;
  as?: DropdownItemAs;
  asProps?: DropdownItemAsProps;
  onClick?: MouseEventHandler<HTMLElement>;
}

function getActiveItemClasses({
  disabled,
  hasItemColors,
  useCustomItemColors,
  isActive,
  hoverBg,
}: {
  disabled: boolean;
  hasItemColors: boolean;
  useCustomItemColors: boolean;
  isActive: boolean;
  hoverBg?: string;
}) {
  if (disabled) {
    return undefined;
  }

  const hoverClass = hasItemColors
    ? hoverBg
      ? 'hover:bg-[var(--dropdown-item-hover-bg)]'
      : 'hover:bg-control-item-bg-hover'
    : useCustomItemColors
      ? 'hover:bg-[var(--dropdown-item-hover-bg)]'
      : 'hover:bg-control-item-bg-hover';

  const activeClass = hasItemColors
    ? hoverBg
      ? 'bg-[var(--dropdown-item-hover-bg)]'
      : 'bg-control-item-bg-hover'
    : useCustomItemColors
      ? 'bg-[var(--dropdown-item-hover-bg)]'
      : 'bg-control-item-bg-hover';

  return cn(hoverClass, isActive && activeClass);
}

function getAsElementClasses(as?: DropdownItemAs) {
  if (!as) {
    return undefined;
  }

  if (as === Link || as === 'a') {
    return 'block w-full no-underline';
  }

  return 'block w-full';
}

function getItemClassName({
  disabled,
  hasItemColors,
  useCustomItemColors,
  isActive,
  hoverBg,
  as,
  className,
  asClassName,
}: {
  disabled: boolean;
  hasItemColors: boolean;
  useCustomItemColors: boolean;
  isActive: boolean;
  hoverBg?: string;
  as?: DropdownItemAs;
  className?: string;
  asClassName?: string;
}) {
  return cn(
    'w-full rounded-border-sm px-padding-sm py-padding-xxs text-body-md font-normal outline-none',
    getAsElementClasses(as),
    disabled
      ? 'cursor-not-allowed select-none text-text-disabled'
      : 'cursor-pointer',
    !disabled && !hasItemColors && !useCustomItemColors && 'text-text',
    !disabled &&
      !hasItemColors &&
      useCustomItemColors &&
      'text-[var(--dropdown-item-color)]',
    getActiveItemClasses({
      disabled,
      hasItemColors,
      useCustomItemColors,
      isActive,
      hoverBg,
    }),
    asClassName,
    className
  );
}

export const DropdownItem = forwardRef<HTMLElement, DropdownItemProps>(
  function DropdownItem(
    {
      children,
      disabled = false,
      colors,
      className,
      as,
      asProps,
      onClick,
    },
    ref
  ) {
    const context = useDropdownMenuContext();
    const assignedIndexRef = useRef<number | null>(null);

    if (!context) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Dropdown.Item] must be used inside Dropdown.');
      }
      return null;
    }

    const {
      useCustomItemColors,
      activeItemIndex,
      setActiveItemIndex,
      allocateItemIndex,
      registerItemRef,
      closeMenu,
      notifyItemClick,
    } = context;

    if (assignedIndexRef.current === null) {
      assignedIndexRef.current = allocateItemIndex();
    }

    const itemIndex = assignedIndexRef.current;
    const hasItemColors = colors?.text != null || colors?.hoverBg != null;
    const isActive = !disabled && activeItemIndex === itemIndex;
    const Component: ElementType = as ?? 'div';

    const {
      className: asClassName,
      onClick: asOnClick,
      style: asStyle,
      ...restAsProps
    } = (asProps ?? {}) as {
      className?: string;
      onClick?: MouseEventHandler<HTMLElement>;
      style?: CSSProperties;
    };

    const itemStyle: CSSProperties | undefined = hasItemColors
      ? {
          ...(colors?.text ? { color: colors.text } : null),
          ...(colors?.hoverBg
            ? ({ '--dropdown-item-hover-bg': colors.hoverBg } as CSSProperties)
            : null),
          ...asStyle,
        }
      : asStyle;

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      asOnClick?.(event);
      onClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      notifyItemClick(children, itemIndex);
      closeMenu();
    };

    return createElement(
      Component,
      {
        ...restAsProps,
        ref: mergeItemRef(itemIndex, registerItemRef, ref, disabled),
        role: 'menuitem',
        tabIndex: -1,
        'aria-disabled': disabled || undefined,
        onMouseEnter: () => {
          if (!disabled) {
            setActiveItemIndex(itemIndex);
          }
        },
        onClick: handleClick,
        style: itemStyle,
        className: getItemClassName({
          disabled,
          hasItemColors,
          useCustomItemColors,
          isActive,
          hoverBg: colors?.hoverBg,
          as,
          className,
          asClassName,
        }),
      },
      children
    );
  }
);

export default DropdownItem;
