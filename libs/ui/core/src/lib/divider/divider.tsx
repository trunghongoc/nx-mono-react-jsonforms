import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { Span } from '../text';

export type DividerAlign = 'center' | 'left' | 'right';

export interface DividerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  className?: string;
  dashed?: boolean;
  label?: string | ReactNode;
  align?: DividerAlign;
  width?: string | number;
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function toWidthValue(width: string | number): CSSProperties['width'] {
  if (typeof width === 'number') {
    return `${width}px`;
  }

  return width;
}

function hasWidthClass(className?: string) {
  if (!className) {
    return false;
  }

  return /\b!?w(?:-\[|-\S|\b)/.test(className);
}

function lineClasses(dashed?: boolean) {
  return cn(
    'min-w-0 border-0 border-t border-split',
    dashed ? 'border-dashed' : 'border-solid'
  );
}

const labelAlignClasses: Record<DividerAlign, string> = {
  center: 'left-1/2 -translate-x-1/2',
  left: 'left-6',
  right: 'right-6',
};

const labelBoxClasses =
  'absolute top-0 flex -translate-y-1/2 items-center rounded-sm bg-bg-container px-4 py-[2px] text-text-description';

function DividerLabel({
  label,
  align,
}: {
  label: string | ReactNode;
  align: DividerAlign;
}) {
  const content =
    typeof label === 'string' ? (
      <Span type="secondary" size="sm">
        {label}
      </Span>
    ) : (
      label
    );

  return (
    <span className={cn(labelBoxClasses, labelAlignClasses[align])}>
      {content}
    </span>
  );
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  {
    dashed = false,
    label,
    align = 'center',
    width,
    className,
    style,
    ...props
  },
  ref
) {
  const combinedStyle: CSSProperties = {
    ...(width !== undefined ? { width: toWidthValue(width) } : {}),
    ...(!width && !hasWidthClass(className) && style?.width === undefined
      ? { width: '90%' }
      : {}),
    ...style,
  };

  if (!label) {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn('mx-auto', lineClasses(dashed), className)}
        style={combinedStyle}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref}
      role="separator"
      className={cn(
        'relative mx-auto border-0 border-t border-split',
        dashed ? 'border-dashed' : 'border-solid',
        className
      )}
      style={combinedStyle}
      {...props}
    >
      <DividerLabel label={label} align={align} />
    </div>
  );
});

export default Divider;
