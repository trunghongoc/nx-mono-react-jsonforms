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
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';

import {
  cn,
  getBorderArrowStyle,
  mergeRefs,
  useOverlayPosition,
  type OverlayPlace,
  type OverlayPosition,
} from '../overlay';

export type TooltipPlace = OverlayPlace;
export type TooltipTrigger = 'hover' | 'click' | 'focus';

export interface TooltipProps {
  anchor: ReactElement;
  children: ReactNode;
  place?: TooltipPlace;
  /** When provided, visibility follows this value and trigger handlers are ignored. */
  show?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: TooltipTrigger;
  className?: string;
}

const TooltipPanel = forwardRef<
  HTMLDivElement,
  {
    id: string;
    children: ReactNode;
    className?: string;
    position: OverlayPosition;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>(function TooltipPanel(
  { id, children, className, position, onMouseEnter, onMouseLeave },
  ref
) {
  return (
    <div
      ref={ref}
      id={id}
      role="tooltip"
      className={cn(
        'fixed z-tooltip w-max max-w-[min(320px,calc(100vw-var(--spacing-size)))] rounded-border bg-bg-spotlight px-padding-xs py-padding-xxs text-body-sm text-text-light-solid shadow-box-secondary',
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
        className="absolute"
        style={getBorderArrowStyle(
          position.arrow.side,
          position.arrow.offset
        )}
      />
      {children}
    </div>
  );
});

export function Tooltip({
  anchor,
  children,
  place,
  show,
  open,
  defaultOpen = false,
  onOpenChange,
  trigger = 'hover',
  className,
}: TooltipProps) {
  const tooltipId = useId();
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
    deps: [children],
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
    if (!isOpen || !usesTrigger || trigger !== 'click') {
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
    onMouseEnter?: (event: ReactMouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: ReactMouseEvent<HTMLElement>) => void;
    onFocus?: (event: ReactFocusEvent<HTMLElement>) => void;
    onBlur?: (event: ReactFocusEvent<HTMLElement>) => void;
    'aria-describedby'?: string;
  };

  const triggerElement = cloneElement(anchor, {
    ref: mergeRefs(anchorProps.ref, anchorRef),
    'aria-describedby': isOpen ? tooltipId : anchorProps['aria-describedby'],
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      anchorProps.onClick?.(event);

      if (usesTrigger && trigger === 'click') {
        setOpen(!isOpen);
      }
    },
    onMouseEnter: (event: ReactMouseEvent<HTMLElement>) => {
      anchorProps.onMouseEnter?.(event);

      if (usesTrigger && trigger === 'hover') {
        clearHoverCloseTimer();
        setOpen(true);
      }
    },
    onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => {
      anchorProps.onMouseLeave?.(event);

      if (usesTrigger && trigger === 'hover') {
        scheduleHoverClose();
      }
    },
    onFocus: (event: ReactFocusEvent<HTMLElement>) => {
      anchorProps.onFocus?.(event);

      if (usesTrigger && trigger === 'focus') {
        setOpen(true);
      }
    },
    onBlur: (event: ReactFocusEvent<HTMLElement>) => {
      anchorProps.onBlur?.(event);

      if (usesTrigger && trigger === 'focus') {
        setOpen(false);
      }
    },
  } as Partial<typeof anchorProps>);

  const panel =
    isOpen && mounted ? (
      <TooltipPanel
        ref={panelRef}
        id={tooltipId}
        className={className}
        position={position}
        onMouseEnter={
          usesTrigger && trigger === 'hover'
            ? () => {
                clearHoverCloseTimer();
                setOpen(true);
              }
            : undefined
        }
        onMouseLeave={
          usesTrigger && trigger === 'hover' ? scheduleHoverClose : undefined
        }
      >
        {children}
      </TooltipPanel>
    ) : null;

  return (
    <>
      {triggerElement}
      {panel && mounted ? createPortal(panel, document.body) : null}
    </>
  );
}

export default Tooltip;
