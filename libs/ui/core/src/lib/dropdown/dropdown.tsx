/// <reference lib="dom" />

import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEventHandler,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

import { Icon, type IconProps } from '../icon';
import {
  cn,
  getAnchorRect,
  type OverlayPlace,
  type Rect,
} from '../overlay';
import { DropdownMenuContext } from './dropdown-context';
import { DropdownItem } from './dropdown-item';
import { DropdownSubMenu } from './dropdown-submenu';

export type DropdownVariant = 'inline' | 'basic';

export type DropdownPlacement = Extract<
  OverlayPlace,
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight'
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'right'
  | 'rightTop'
  | 'rightBottom'
>;

export interface DropdownColors {
  text?: string;
  border?: string;
  background?: string;
  itemHoverBg?: string;
  itemColor?: string;
}

export interface DropdownProps {
  label: string;
  icon?: IconProps | null;
  variant?: DropdownVariant;
  placement?: DropdownPlacement;
  children?: ReactNode;
  colors?: DropdownColors;
  disabled?: boolean;
  loading?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onClickItem?: (content: ReactNode, index: number) => void;
  /** Classes applied to the trigger button (e.g. `w-full` for full-width basic triggers). */
  className?: string;
  menuClassName?: string;
}

const DROPDOWN_GAP = 4;
const VIEWPORT_PADDING = 8;

const DROPDOWN_PLACEMENTS: DropdownPlacement[] = [
  'bottomLeft',
  'bottom',
  'bottomRight',
  'topLeft',
  'top',
  'topRight',
  'right',
  'rightTop',
  'rightBottom',
];

const menuContentClasses = [
  '[&_[role=separator]]:mx-0 [&_[role=separator]]:my-margin-xxs [&_[role=separator]]:w-full',
  '[&_label]:block [&_label]:cursor-default [&_label]:px-padding-sm [&_label]:py-padding-xxs [&_label]:text-body-md [&_label]:font-normal [&_label]:text-text-description',
].join(' ');

const triggerBaseClasses =
  'max-w-full cursor-pointer items-center gap-size-xxs border-0 bg-transparent p-0 text-body-md font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-control-outline focus-visible:ring-offset-2 disabled:select-none [&_svg]:!text-current';

const inlineTriggerClasses = [
  'text-primary',
  'hover:text-primary-hover',
  'active:text-primary-active',
  'disabled:pointer-events-none disabled:text-text-disabled',
].join(' ');

const basicTriggerClasses = [
  'rounded-border border border-solid border-default-border-color bg-default-bg text-text',
  'h-control px-padding-content-horizontal-sm',
  'hover:border-primary-hover hover:text-primary-hover',
  'active:border-primary-active active:text-primary-active',
  'disabled:pointer-events-none disabled:border-border disabled:bg-bg-container-disabled disabled:text-text-disabled',
].join(' ');

const basicTriggerOpenClasses =
  'border-primary text-primary hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active';

function computeDropdownPosition(
  anchor: Rect,
  overlayWidth: number,
  overlayHeight: number,
  placement: DropdownPlacement
) {
  const anchorBottom = anchor.top + anchor.height;
  const anchorRight = anchor.left + anchor.width;
  const anchorCenterX = anchor.left + anchor.width / 2;
  const anchorCenterY = anchor.top + anchor.height / 2;

  if (placement === 'right') {
    return {
      top: anchorCenterY - overlayHeight / 2,
      left: anchorRight + DROPDOWN_GAP,
    };
  }

  if (placement === 'rightTop') {
    return {
      top: anchor.top,
      left: anchorRight + DROPDOWN_GAP,
    };
  }

  if (placement === 'rightBottom') {
    return {
      top: anchor.top + anchor.height - overlayHeight,
      left: anchorRight + DROPDOWN_GAP,
    };
  }

  if (placement === 'bottomLeft') {
    return { top: anchorBottom + DROPDOWN_GAP, left: anchor.left };
  }

  if (placement === 'bottom') {
    return {
      top: anchorBottom + DROPDOWN_GAP,
      left: anchorCenterX - overlayWidth / 2,
    };
  }

  if (placement === 'bottomRight') {
    return {
      top: anchorBottom + DROPDOWN_GAP,
      left: anchorRight - overlayWidth,
    };
  }

  if (placement === 'topLeft') {
    return { top: anchor.top - overlayHeight - DROPDOWN_GAP, left: anchor.left };
  }

  if (placement === 'top') {
    return {
      top: anchor.top - overlayHeight - DROPDOWN_GAP,
      left: anchorCenterX - overlayWidth / 2,
    };
  }

  return {
    top: anchor.top - overlayHeight - DROPDOWN_GAP,
    left: anchorRight - overlayWidth,
  };
}

function getDropdownOverflow(
  top: number,
  left: number,
  overlayWidth: number,
  overlayHeight: number
) {
  const right = left + overlayWidth;
  const bottom = top + overlayHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return (
    Math.max(0, VIEWPORT_PADDING - top) +
    Math.max(0, VIEWPORT_PADDING - left) +
    Math.max(0, right - (viewportWidth - VIEWPORT_PADDING)) +
    Math.max(0, bottom - (viewportHeight - VIEWPORT_PADDING))
  );
}

function resolveDropdownPlacement(
  anchor: Rect,
  overlayWidth: number,
  overlayHeight: number,
  preferredPlacement?: DropdownPlacement
) {
  if (preferredPlacement) {
    const computed = computeDropdownPosition(
      anchor,
      overlayWidth,
      overlayHeight,
      preferredPlacement
    );

    return { ...computed, placement: preferredPlacement };
  }

  let bestPlacement: DropdownPlacement = 'bottomLeft';
  let bestPosition = computeDropdownPosition(
    anchor,
    overlayWidth,
    overlayHeight,
    bestPlacement
  );
  let bestScore = Number.POSITIVE_INFINITY;

  for (const placement of DROPDOWN_PLACEMENTS) {
    const computed = computeDropdownPosition(
      anchor,
      overlayWidth,
      overlayHeight,
      placement
    );
    const score = getDropdownOverflow(
      computed.top,
      computed.left,
      overlayWidth,
      overlayHeight
    );

    if (score < bestScore) {
      bestScore = score;
      bestPlacement = placement;
      bestPosition = computed;
    }
  }

  return { ...bestPosition, placement: bestPlacement };
}

function clampDropdownPosition(
  anchor: Rect,
  placement: DropdownPlacement,
  top: number,
  left: number,
  overlayWidth: number,
  overlayHeight: number
) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const minLeft = VIEWPORT_PADDING;
  const maxLeft = viewportWidth - overlayWidth - VIEWPORT_PADDING;
  const minTop = VIEWPORT_PADDING;
  const maxTop = viewportHeight - overlayHeight - VIEWPORT_PADDING;

  let nextLeft = Math.min(Math.max(left, minLeft), maxLeft);
  let nextTop = Math.min(Math.max(top, minTop), maxTop);

  if (placement.startsWith('bottom')) {
    nextTop = Math.max(nextTop, anchor.top + anchor.height + DROPDOWN_GAP);
  } else if (placement.startsWith('top')) {
    nextTop = Math.min(nextTop, anchor.top - overlayHeight - DROPDOWN_GAP);
  } else if (placement.startsWith('right')) {
    nextLeft = Math.max(nextLeft, anchor.left + anchor.width + DROPDOWN_GAP);
  }

  return { top: nextTop, left: nextLeft };
}

export function useDropdownPosition({
  isOpen,
  mounted,
  anchorRef,
  panelRef,
  placement,
  deps = [],
}: {
  isOpen: boolean;
  mounted: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
  placement?: DropdownPlacement;
  deps?: unknown[];
}) {
  const [position, setPosition] = useState({ top: -9999, left: -9999 });

  const updatePosition = useCallback(() => {
    const anchorRect = getAnchorRect(anchorRef.current);
    const panelRect = panelRef.current?.getBoundingClientRect();

    if (!anchorRect || !panelRect) {
      return;
    }

    const resolved = resolveDropdownPlacement(
      anchorRect,
      panelRect.width,
      panelRect.height,
      placement
    );

    const nextPosition = clampDropdownPosition(
      anchorRect,
      resolved.placement,
      resolved.top,
      resolved.left,
      panelRect.width,
      panelRect.height
    );

    setPosition({ top: nextPosition.top, left: nextPosition.left });
  }, [anchorRef, panelRef, placement]);

  useLayoutEffect(() => {
    if (!isOpen || !mounted) {
      return;
    }

    updatePosition();
  }, [isOpen, mounted, updatePosition, ...deps]);

  useEffect(() => {
    if (!isOpen || !mounted) {
      return;
    }

    const handleReposition = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(handleReposition)
        : null;

    if (anchorRef.current) {
      resizeObserver?.observe(anchorRef.current);
    }

    if (panelRef.current) {
      resizeObserver?.observe(panelRef.current);
    }

    requestAnimationFrame(handleReposition);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
      resizeObserver?.disconnect();
    };
  }, [anchorRef, isOpen, mounted, panelRef, updatePosition]);

  return position;
}

function buildTriggerStyle(colors?: DropdownColors): CSSProperties | undefined {
  if (!colors) {
    return undefined;
  }

  return {
    ...(colors.text ? { color: colors.text } : null),
    ...(colors.border ? { borderColor: colors.border } : null),
    ...(colors.background ? { backgroundColor: colors.background } : null),
  };
}

function buildMenuStyle(colors?: DropdownColors): CSSProperties | undefined {
  if (!colors?.itemColor && !colors?.itemHoverBg) {
    return undefined;
  }

  return {
    ...(colors.itemColor
      ? ({ '--dropdown-item-color': colors.itemColor } as CSSProperties)
      : null),
    ...(colors.itemHoverBg
      ? ({ '--dropdown-item-hover-bg': colors.itemHoverBg } as CSSProperties)
      : null),
  };
}

function getNextActiveItemIndex(
  navigableIndexes: number[],
  currentIndex: number | null,
  direction: 1 | -1
) {
  if (navigableIndexes.length === 0) {
    return null;
  }

  if (currentIndex === null) {
    return direction === 1
      ? navigableIndexes[0]
      : navigableIndexes[navigableIndexes.length - 1];
  }

  const currentPosition = navigableIndexes.indexOf(currentIndex);

  if (currentPosition === -1) {
    return navigableIndexes[0];
  }

  const nextPosition =
    (currentPosition + direction + navigableIndexes.length) %
    navigableIndexes.length;

  return navigableIndexes[nextPosition];
}

function hasMenuContent(children: ReactNode) {
  return Children.toArray(children).some(
    (child) => child != null && typeof child !== 'boolean'
  );
}

export const DropdownMenu = forwardRef<
  HTMLDivElement,
  {
    id: string;
    children: ReactNode;
    position: { top: number; left: number };
    className?: string;
    style?: CSSProperties;
    useCustomItemColors: boolean;
    closeMenu: () => void;
    onClickItem?: (content: ReactNode, index: number) => void;
    menuKeyDownRef?: RefObject<
      ((event: ReactKeyboardEvent<HTMLElement>) => void) | null
    >;
    autoFocus?: boolean;
    onMouseEnter?: MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  }
>(function DropdownMenu(
  {
    id,
    children,
    position,
    className,
    style,
    useCustomItemColors,
    closeMenu,
    onClickItem,
    menuKeyDownRef,
    autoFocus = true,
    onMouseEnter,
    onMouseLeave,
  },
  ref
) {
  const itemIndexCounterRef = useRef(0);
  const itemRefs = useRef(new Map<number, HTMLElement>());
  const itemDisabledRef = useRef(new Map<number, boolean>());
  const navigableItemIndexesRef = useRef<number[]>([]);
  const scrollActiveItemIntoViewRef = useRef(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);

  itemIndexCounterRef.current = 0;

  const allocateItemIndex = useCallback(() => {
    const index = itemIndexCounterRef.current;
    itemIndexCounterRef.current += 1;
    return index;
  }, []);

  const syncNavigableItemIndexes = useCallback(() => {
    navigableItemIndexesRef.current = [...itemRefs.current.keys()]
      .filter((index) => !itemDisabledRef.current.get(index))
      .sort((left, right) => left - right);
  }, []);

  const registerItemRef = useCallback(
    (index: number, element: HTMLElement | null, disabled = false) => {
      if (element) {
        itemRefs.current.set(index, element);
        itemDisabledRef.current.set(index, disabled);
      } else {
        itemRefs.current.delete(index);
        itemDisabledRef.current.delete(index);
      }

      syncNavigableItemIndexes();
    },
    [syncNavigableItemIndexes]
  );

  useEffect(() => {
    setActiveItemIndex(null);
    setOpenSubMenuIndex(null);
    itemRefs.current.clear();
    itemDisabledRef.current.clear();
    navigableItemIndexesRef.current = [];
  }, [children]);

  useLayoutEffect(() => {
    if (!autoFocus || typeof ref === 'function') {
      return;
    }

    ref?.current?.focus({ preventScroll: true });
  }, [autoFocus, ref]);

  useEffect(() => {
    if (activeItemIndex === null || !scrollActiveItemIntoViewRef.current) {
      return;
    }

    scrollActiveItemIntoViewRef.current = false;

    itemRefs.current
      .get(activeItemIndex)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeItemIndex]);

  const activateActiveItem = useCallback(() => {
    if (activeItemIndex === null) {
      return;
    }

    itemRefs.current.get(activeItemIndex)?.click();
  }, [activeItemIndex]);

  const handleMenuKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        scrollActiveItemIntoViewRef.current = true;
        setActiveItemIndex((current) =>
          getNextActiveItemIndex(navigableItemIndexesRef.current, current, 1)
        );
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        scrollActiveItemIntoViewRef.current = true;
        setActiveItemIndex((current) =>
          getNextActiveItemIndex(navigableItemIndexesRef.current, current, -1)
        );
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        if (activeItemIndex === null) {
          return;
        }

        event.preventDefault();
        activateActiveItem();
      }
    },
    [activateActiveItem, activeItemIndex]
  );

  useLayoutEffect(() => {
    if (!menuKeyDownRef) {
      return;
    }

    menuKeyDownRef.current = handleMenuKeyDown;

    return () => {
      menuKeyDownRef.current = null;
    };
  }, [handleMenuKeyDown, menuKeyDownRef]);

  const notifyItemClick = useCallback(
    (content: ReactNode, index: number) => {
      onClickItem?.(content, index);
    },
    [onClickItem]
  );

  return (
    <DropdownMenuContext.Provider
      value={{
        useCustomItemColors,
        activeItemIndex,
        setActiveItemIndex,
        openSubMenuIndex,
        setOpenSubMenuIndex,
        allocateItemIndex,
        registerItemRef,
        closeMenu,
        notifyItemClick,
      }}
    >
      <div
        ref={ref}
        id={id}
        role="menu"
        tabIndex={-1}
        onKeyDown={handleMenuKeyDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-dropdown-menu
        className={cn(
          'fixed z-dropdown min-w-[calc(var(--spacing-size-lg)*5)] rounded-border-lg bg-bg-elevated p-padding-xxs shadow-box-secondary',
          menuContentClasses,
          className
        )}
        style={{
          top: position.top,
          left: position.left,
          ...style,
        }}
      >
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
});

function DropdownRoot({
  label,
  icon,
  variant = 'inline',
  placement,
  children,
  colors,
  disabled = false,
  loading = false,
  open,
  defaultOpen = false,
  onOpenChange,
  onClick,
  onClickItem,
  className,
  menuClassName,
}: DropdownProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuKeyDownRef = useRef<
    ((event: ReactKeyboardEvent<HTMLElement>) => void) | null
  >(null);
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpenControlled = open !== undefined;
  const isOpen = isOpenControlled ? open : internalOpen;
  const useCustomItemColors =
    colors?.itemColor != null || colors?.itemHoverBg != null;
  const hasContent = hasMenuContent(children);

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

  const position = useDropdownPosition({
    isOpen,
    mounted,
    anchorRef: triggerRef,
    panelRef: menuRef,
    placement,
    deps: [children, placement],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target) ||
        (target instanceof Element && target.closest('[data-dropdown-menu]'))
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

  useEffect(() => {
    if (loading) {
      setOpen(false);
    }
  }, [loading, setOpen]);

  const triggerStyle = buildTriggerStyle(colors);
  const menuStyle = buildMenuStyle(colors);

  const showIcon = icon !== null;
  const iconProps: IconProps | null = showIcon
    ? { name: 'down', size: 'sm', ...icon }
    : null;

  const menu =
    isOpen && mounted && hasContent && !loading ? (
      <DropdownMenu
        ref={menuRef}
        id={menuId}
        position={position}
        className={menuClassName}
        style={menuStyle}
        useCustomItemColors={useCustomItemColors}
        closeMenu={closeMenu}
        onClickItem={onClickItem}
        menuKeyDownRef={menuKeyDownRef}
      >
        {children}
      </DropdownMenu>
    ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled || loading}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-busy={loading || undefined}
        aria-controls={isOpen ? menuId : undefined}
        onKeyDown={(event: ReactKeyboardEvent<HTMLButtonElement>) => {
          if (!isOpen || disabled || loading) {
            return;
          }

          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            menuRef.current?.focus({ preventScroll: true });
            menuKeyDownRef.current?.(event);
          }
        }}
        onClick={(event) => {
          onClick?.(event);

          if (disabled || loading || event.defaultPrevented) {
            return;
          }

          setOpen(!isOpen);
        }}
        className={cn(
          triggerBaseClasses,
          variant === 'inline' && 'inline-flex',
          variant === 'basic' && 'flex justify-between',
          variant === 'inline' && inlineTriggerClasses,
          variant === 'basic' && basicTriggerClasses,
          variant === 'basic' &&
            isOpen &&
            !disabled &&
            !loading &&
            basicTriggerOpenClasses,
          className
        )}
        style={triggerStyle}
      >
        <span
          className={cn(
            'min-w-0',
            variant === 'basic' && 'flex-1 text-left'
          )}
        >
          {label}
        </span>
        {loading ? (
          <Icon name="loading" size="sm" spin />
        ) : iconProps ? (
          <Icon {...iconProps} />
        ) : null}
      </button>
      {menu && mounted ? createPortal(menu, document.body) : null}
    </>
  );
}

export const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
  SubMenu: DropdownSubMenu,
});

export default Dropdown;
