/// <reference lib="dom" />

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';

import { P } from '../text';

import {
  clampPopoverPosition,
  resolvePopoverPlace,
  type PopoverPlace,
  type PopoverPosition,
  type PopoverSide,
} from './position';

export type PopoverTrigger = 'hover' | 'click' | 'rightClick' | 'doubleClick';

export interface PopoverProps {
  anchor: ReactElement;
  title?: ReactNode;
  children: ReactNode;
  place?: PopoverPlace;
  /** When provided, visibility follows this value and trigger handlers are ignored. */
  show?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: PopoverTrigger;
  className?: string;
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function isHoverTrigger(trigger: PopoverTrigger) {
  return trigger === 'hover';
}

function dismissesOnOutsideInteraction(trigger: PopoverTrigger) {
  return trigger === 'click' || trigger === 'rightClick' || trigger === 'doubleClick';
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      if (typeof ref === 'function') {
        ref(value);
      } else {
        ref.current = value;
      }
    }
  };
}

function getAnchorRect(element: HTMLElement | null) {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function getArrowStyle(
  side: PopoverSide,
  offset: number
): CSSProperties {
  const size = 8;

  if (side === 'top') {
    return {
      top: -size / 2,
      left: offset,
      transform: 'translateX(-50%) rotate(45deg)',
    };
  }

  if (side === 'bottom') {
    return {
      bottom: -size / 2,
      left: offset,
      transform: 'translateX(-50%) rotate(45deg)',
    };
  }

  if (side === 'left') {
    return {
      left: -size / 2,
      top: offset,
      transform: 'translateY(-50%) rotate(45deg)',
    };
  }

  return {
    right: -size / 2,
    top: offset,
    transform: 'translateY(-50%) rotate(45deg)',
  };
}

const PopoverPanel = forwardRef<
  HTMLDivElement,
  {
    id: string;
    title?: ReactNode;
    children: ReactNode;
    className?: string;
    position: PopoverPosition;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>(function PopoverPanel(
  {
    id,
    title,
    children,
    className,
    position,
    onMouseEnter,
    onMouseLeave,
  },
  ref
) {
  return (
    <div
      ref={ref}
      id={id}
      role="dialog"
      className={cn(
        'fixed z-tooltip w-max max-w-[min(320px,calc(100vw-16px))] rounded-lg bg-bg-container p-[12px] shadow-lg',
        className
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        aria-hidden
        className="absolute size-2 bg-bg-container"
        style={getArrowStyle(position.arrow.side, position.arrow.offset)}
      />
      {title ? (
        <P className="mb-[16px] text-[14px] leading-[22px] font-semibold text-text">
          {title}
        </P>
      ) : null}
      <div className="text-body-md text-text">{children}</div>
    </div>
  );
});

export function Popover({
  anchor,
  title,
  children,
  place,
  show,
  open,
  defaultOpen = false,
  onOpenChange,
  trigger = 'hover',
  className,
}: PopoverProps) {
  const popoverId = useId();
  const anchorRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverCloseTimerRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const usesTrigger = show === undefined;
  const isOpenControlled = usesTrigger && open !== undefined;
  const isOpen =
    show !== undefined ? show : isOpenControlled ? open : internalOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!usesTrigger) {
        return;
      }

      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange, usesTrigger]
  );

  const updatePosition = useCallback(() => {
    const anchorRect = getAnchorRect(anchorRef.current);
    const panelRect = panelRef.current?.getBoundingClientRect();

    if (!anchorRect || !panelRect) {
      return;
    }

    const nextPosition = clampPopoverPosition(
      resolvePopoverPlace(
        anchorRect,
        panelRect.width,
        panelRect.height,
        place
      ),
      panelRect.width,
      panelRect.height
    );

    setPosition(nextPosition);
  }, [place]);

  const clearHoverCloseTimer = useCallback(() => {
    if (hoverCloseTimerRef.current !== null) {
      window.clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  }, []);

  const scheduleHoverClose = useCallback(() => {
    clearHoverCloseTimer();
    hoverCloseTimerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 120);
  }, [clearHoverCloseTimer, setOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !mounted) {
      return;
    }

    updatePosition();
  }, [isOpen, mounted, updatePosition, title, children]);

  useEffect(() => {
    if (!isOpen || !mounted) {
      return;
    }

    const handleReposition = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen, mounted, updatePosition]);

  useEffect(() => {
    if (!isOpen || !usesTrigger || !dismissesOnOutsideInteraction(trigger)) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        anchorRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setOpen, trigger, usesTrigger]);

  useEffect(() => {
    return () => {
      clearHoverCloseTimer();
    };
  }, [clearHoverCloseTimer]);

  if (!isValidElement(anchor)) {
    return anchor;
  }

  const anchorProps = anchor.props as {
    ref?: Ref<HTMLElement>;
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
    onDoubleClick?: (event: ReactMouseEvent<HTMLElement>) => void;
    onContextMenu?: (event: ReactMouseEvent<HTMLElement>) => void;
    onMouseEnter?: (event: ReactMouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: ReactMouseEvent<HTMLElement>) => void;
    'aria-describedby'?: string;
  };

  const triggerElement = cloneElement(anchor, {
    ref: mergeRefs(anchorProps.ref, anchorRef),
    'aria-describedby': isOpen ? popoverId : anchorProps['aria-describedby'],
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      anchorProps.onClick?.(event);

      if (usesTrigger && trigger === 'click') {
        setOpen(!isOpen);
      }
    },
    onDoubleClick: (event: ReactMouseEvent<HTMLElement>) => {
      anchorProps.onDoubleClick?.(event);

      if (usesTrigger && trigger === 'doubleClick') {
        setOpen(!isOpen);
      }
    },
    onContextMenu: (event: ReactMouseEvent<HTMLElement>) => {
      anchorProps.onContextMenu?.(event);

      if (usesTrigger && trigger === 'rightClick') {
        event.preventDefault();
        setOpen(!isOpen);
      }
    },
    onMouseEnter: (event: ReactMouseEvent<HTMLElement>) => {
      anchorProps.onMouseEnter?.(event);

      if (usesTrigger && isHoverTrigger(trigger)) {
        clearHoverCloseTimer();
        setOpen(true);
      }
    },
    onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => {
      anchorProps.onMouseLeave?.(event);

      if (usesTrigger && isHoverTrigger(trigger)) {
        scheduleHoverClose();
      }
    },
  } as Partial<typeof anchorProps>);

  const panel =
    isOpen && mounted ? (
      <PopoverPanel
        ref={panelRef}
        id={popoverId}
        title={title}
        className={className}
        position={
          position ?? {
            top: -9999,
            left: -9999,
            place: place ?? 'top',
            arrow: { side: 'bottom', offset: 16 },
          }
        }
        onMouseEnter={
          usesTrigger && isHoverTrigger(trigger)
            ? () => {
                clearHoverCloseTimer();
                setOpen(true);
              }
            : undefined
        }
        onMouseLeave={
          usesTrigger && isHoverTrigger(trigger) ? scheduleHoverClose : undefined
        }
      >
        {children}
      </PopoverPanel>
    ) : null;

  return (
    <>
      {triggerElement}
      {panel && mounted ? createPortal(panel, document.body) : null}
    </>
  );
}

export default Popover;
