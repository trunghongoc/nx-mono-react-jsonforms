import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

export type BadgeVariant = 'dot' | 'md' | 'sm';
export type BadgeType =
  | 'default'
  | 'success'
  | 'error'
  | 'primary'
  | 'warning';

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  variant?: BadgeVariant;
  type?: BadgeType;
  value?: number | string;
  maxNumber?: number;
}

const typeBackgroundClasses: Record<BadgeType, string> = {
  default: 'bg-text-placeholder',
  success: 'bg-success',
  error: 'bg-error',
  primary: 'bg-primary',
  warning: 'bg-warning',
};

const variantClasses: Record<BadgeVariant, string> = {
  dot: 'size-[8px] rounded-[999px]',
  md: 'rounded-[16px] p-padding-xxs text-body-md font-normal leading-none',
  sm: 'rounded-[12px] p-padding-xxs text-body-sm font-normal leading-none',
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function formatBadgeValue(value: number, maxNumber?: number): ReactNode {
  if (maxNumber != null && value > maxNumber) {
    return `${maxNumber}+`;
  }
  return value;
}

function resolveBadgeContent(
  variant: BadgeVariant,
  value?: number | string,
  maxNumber?: number
): ReactNode {
  if (variant === 'dot' || value == null) {
    return null;
  }

  if (typeof value === 'number') {
    return formatBadgeValue(value, maxNumber);
  }

  return value;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = 'md',
    type = 'default',
    value,
    maxNumber,
    className,
    ...rest
  },
  ref
) {
  const content = resolveBadgeContent(variant, value, maxNumber);

  return (
    <span
      ref={ref}
      className={cn(
        'box-border inline-flex shrink-0 items-center justify-center border border-bg-container text-bg-container',
        typeBackgroundClasses[type],
        variantClasses[variant],
        className
      )}
      {...rest}
    >
      {content}
    </span>
  );
});

export default Badge;
