import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '../icon';
import { cn } from '../overlay';
import {
  mergeItemRef,
  useDropdownMenuContext,
} from './dropdown-context';
import { DropdownMenu, useDropdownPosition, type DropdownPlacement } from './dropdown';

export interface DropdownSubMenuProps {
  label: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  placement?: DropdownPlacement;
  className?: string;
}

export function DropdownSubMenu({
  label,
  children,
  disabled = false,
  placement = 'rightTop',
  className,
}: DropdownSubMenuProps) {
  const context = useDropdownMenuContext();
  const assignedIndexRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (context && assignedIndexRef.current === null) {
    assignedIndexRef.current = context.allocateItemIndex();
  }

  const itemIndex = assignedIndexRef.current ?? -1;
  const isOpen =
    context != null &&
    !disabled &&
    itemIndex !== -1 &&
    context.openSubMenuIndex === itemIndex;

  const position = useDropdownPosition({
    isOpen,
    mounted,
    anchorRef: triggerRef,
    panelRef: menuRef,
    placement,
    deps: [children, placement],
  });

  if (!context) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Dropdown.SubMenu] must be used inside Dropdown.');
    }
    return null;
  }

  const {
    useCustomItemColors,
    activeItemIndex,
    setActiveItemIndex,
    setOpenSubMenuIndex,
    registerItemRef,
  } = context;

  const isActive =
    !disabled && (activeItemIndex === itemIndex || isOpen);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) {
      return;
    }

    if (isOpen) {
      setOpenSubMenuIndex(null);
      return;
    }

    setOpenSubMenuIndex(itemIndex);
    setActiveItemIndex(itemIndex);
  };

  const submenu =
    isOpen && mounted ? (
      <DropdownMenu
        ref={menuRef}
        id={menuId}
        position={position}
        useCustomItemColors={useCustomItemColors}
        closeMenu={context.closeMenu}
        autoFocus={false}
        className={className}
      >
        {children}
      </DropdownMenu>
    ) : null;

  return (
    <>
      <div
        ref={mergeItemRef(itemIndex, registerItemRef, triggerRef, disabled)}
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={-1}
        onClick={handleClick}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between gap-size-xs rounded-border-sm px-padding-sm py-padding-xxs text-body-md font-normal outline-none',
          disabled
            ? 'cursor-not-allowed select-none text-text-disabled'
            : 'text-text',
          !disabled &&
            !useCustomItemColors &&
            'hover:bg-control-item-bg-hover',
          !disabled &&
            useCustomItemColors &&
            'hover:bg-[var(--dropdown-item-hover-bg)] text-[var(--dropdown-item-color)]',
          isActive &&
            !disabled &&
            (useCustomItemColors
              ? 'bg-[var(--dropdown-item-hover-bg)]'
              : 'bg-control-item-bg-hover')
        )}
      >
        <span className="min-w-0 flex-1">{label}</span>
        <Icon
          name="right"
          size="sm"
          className={cn('shrink-0', disabled && 'text-text-disabled')}
        />
      </div>
      {submenu && mounted ? createPortal(submenu, document.body) : null}
    </>
  );
}

export default DropdownSubMenu;
