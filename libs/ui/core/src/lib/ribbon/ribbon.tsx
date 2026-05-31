import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

export type RibbonType =
  | 'blue'
  | 'volcano'
  | 'magenta'
  | 'dust-red'
  | 'cyan'
  | 'green'
  | 'purple';

export type RibbonPlacement =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface RibbonProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  type?: RibbonType;
  placement?: RibbonPlacement;
  value?: string | number | ReactNode;
  background?: string;
  color?: string;
}

type RibbonColorClasses = {
  bg: string;
  fold: string;
};

const typeColorClasses: Record<RibbonType, RibbonColorClasses> = {
  blue: { bg: 'bg-primary', fold: 'bg-primary-active' },
  volcano: { bg: 'bg-volcano-6', fold: 'bg-volcano-7' },
  magenta: { bg: 'bg-magenta-6', fold: 'bg-magenta-7' },
  'dust-red': { bg: 'bg-red-6', fold: 'bg-red-7' },
  cyan: { bg: 'bg-cyan-6', fold: 'bg-cyan-7' },
  green: { bg: 'bg-green-6', fold: 'bg-green-7' },
  purple: { bg: 'bg-purple-6', fold: 'bg-purple-7' },
};

type RibbonPlacementConfig = {
  bodyRounded: string;
  foldPosition: string;
  foldClipPath: string;
  foldFirst: boolean;
};

const placementConfig: Record<RibbonPlacement, RibbonPlacementConfig> = {
  'bottom-right': {
    bodyRounded:
      'rounded-tl-border rounded-tr-border rounded-bl-border',
    foldPosition: 'absolute top-full right-0',
    foldClipPath: 'polygon(100% 0, 100% 100%, 0 0)',
    foldFirst: false,
  },
  'bottom-left': {
    bodyRounded:
      'rounded-tl-border rounded-tr-border rounded-br-border',
    foldPosition: 'absolute top-full left-0',
    foldClipPath: 'polygon(0 0, 100% 0, 0 100%)',
    foldFirst: false,
  },
  'top-right': {
    bodyRounded:
      'rounded-tl-border rounded-bl-border rounded-br-border',
    foldPosition: 'absolute bottom-full right-0',
    foldClipPath: 'polygon(100% 100%, 100% 0, 0 100%)',
    foldFirst: true,
  },
  'top-left': {
    bodyRounded:
      'rounded-tr-border rounded-bl-border rounded-br-border',
    foldPosition: 'absolute bottom-full left-0',
    foldClipPath: 'polygon(0 100%, 0 0, 100% 100%)',
    foldFirst: true,
  },
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Ribbon = forwardRef<HTMLSpanElement, RibbonProps>(function Ribbon(
  {
    type = 'blue',
    placement = 'bottom-right',
    value,
    background,
    color,
    className,
    style,
    ...rest
  },
  ref
) {
  const { bg, fold } = typeColorClasses[type];
  const useCustomBackground = background != null;
  const {
    bodyRounded,
    foldPosition,
    foldClipPath,
    foldFirst,
  } = placementConfig[placement];

  const bodyStyle: CSSProperties = {
    ...(background ? { background } : null),
    ...(color ? { color } : null),
    ...style,
  };

  const foldStyle: CSSProperties = {
    clipPath: foldClipPath,
    ...(useCustomBackground
      ? { background, filter: 'brightness(0.85)' }
      : null),
  };

  const foldElement = (
    <span
      className={cn(
        'block size-padding-xs',
        foldPosition,
        !useCustomBackground && fold
      )}
      style={foldStyle}
      aria-hidden
    />
  );

  const bodyElement = (
    <span
      className={cn(
        'relative z-[1] inline-block p-padding-xs text-body-md font-normal leading-none',
        bodyRounded,
        !useCustomBackground && bg,
        color == null && 'text-text-light-solid'
      )}
      style={bodyStyle}
    >
      {value}
    </span>
  );

  return (
    <span
      ref={ref}
      className={cn('relative inline-block', className)}
      {...rest}
    >
      {foldFirst ? (
        <>
          {foldElement}
          {bodyElement}
        </>
      ) : (
        <>
          {bodyElement}
          {foldElement}
        </>
      )}
    </span>
  );
});

export default Ribbon;
