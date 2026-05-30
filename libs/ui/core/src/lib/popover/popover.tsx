/// <reference lib="dom" />

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';

import {
  cn,
  getArrowStyle,
  mergeRefs,
  useOverlayPosition,
  type OverlayPlace,
  type OverlayPosition,
} from '../overlay';
import { P } from '../text';

export type PopoverPlace = OverlayPlace;
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

function isHoverTrigger(trigger: PopoverTrigger) {
  return trigger === 'hover';
}

function dismissesOnOutsideInteraction(trigger: PopoverTrigger) {
  return trigger === 'click' || trigger === 'rightClick' || trigger === 'doubleClick';
}

const PopoverPanel = forwardRef<
  HTMLDivElement,
  {
    id: string;
    title?: ReactNode;
    children: ReactNode;
    className?: string;
    position: OverlayPosition;
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
        'fixed z-tooltip w-max max-w-[min(320px,calc(100vw-var(--spacing-size)))] rounded-border-lg bg-bg-container p-padding-sm shadow-box-secondary',
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
        className="absolute size-size-xs bg-bg-container"
        style={getArrowStyle(position.arrow.side, position.arrow.offset)}
      />
      {title ? (
        <P className="mb-size text-body-md leading-[22px] font-semibold text-text">
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

  const position = useOverlayPosition({
    isOpen,
    mounted,
    anchorRef,
    panelRef,
    place,
    deps: [title, children],
  });

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
        position={position}
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
