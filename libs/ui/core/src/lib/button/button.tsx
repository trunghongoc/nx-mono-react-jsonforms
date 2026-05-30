import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';

export type ButtonType =
  | 'primary'
  | 'default'
  | 'dashed'
  | 'text'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: ButtonType;
  htmlType?: 'button' | 'submit' | 'reset';
  size?: ButtonSize;
  round?: boolean;
  danger?: boolean;
  ghost?: boolean;
  iconOnly?: boolean;
  icon?: ReactNode;
  loading?: boolean;
}

const baseClasses =
  'inline-flex cursor-pointer items-center justify-center gap-2 border font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-control-outline focus-visible:ring-offset-2';

const solidDisabledClasses =
  'disabled:pointer-events-none disabled:border-border disabled:bg-bg-container-disabled disabled:text-text-disabled';

const textDisabledClasses =
  'disabled:pointer-events-none disabled:text-text-disabled';

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-6 px-[7px] text-body-md',
  md: 'h-8 px-[15px] text-body-md',
  lg: 'h-10 px-[15px] text-body-lg',
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: 'size-6 p-0',
  md: 'size-8 p-0',
  lg: 'size-10 p-0',
};

type Appearance = 'default' | 'danger' | 'ghost' | 'ghostDanger';

const appearanceClasses: Record<
  Appearance,
  Record<ButtonType, string>
> = {
  default: {
    primary: [
      'bg-primary text-text-light-solid',
      'hover:bg-primary-hover',
      'active:bg-primary-active active:text-text-light-solid',
      solidDisabledClasses,
    ].join(' '),
    default: [
      'border-default-border-color bg-default-bg text-text',
      'hover:border-solid hover:border-primary-hover hover:text-primary-hover',
      'active:border-primary-active active:text-primary-active',
      solidDisabledClasses,
    ].join(' '),
    dashed: [
      'border-dashed border-default-border-color bg-default-bg text-text',
      'hover:border-dashed hover:border-primary-hover hover:text-primary-hover',
      'active:border-dashed active:border-primary-active active:text-primary-active',
      solidDisabledClasses,
    ].join(' '),
    text: [
      'border-0 text-text',
      'hover:border-0 hover:bg-bg-text-hover',
      'active:border-0 active:bg-bg-text-active active:text-text',
      textDisabledClasses,
    ].join(' '),
    link: [
      'bg-transparent text-primary',
      'hover:text-primary-hover',
      'active:text-primary-active',
      textDisabledClasses,
    ].join(' '),
  },
  danger: {
    primary: [
      'bg-error text-text-light-solid',
      'hover:bg-error-hover hover:text-text-light-solid',
      'active:bg-error-active active:text-text-light-solid',
      solidDisabledClasses,
    ].join(' '),
    default: [
      'border-error bg-bg-container text-error',
      'hover:border-error-border-hover hover:text-error-hover',
      'active:border-error-active active:text-error-active',
      solidDisabledClasses,
    ].join(' '),
    dashed: [
      'border-dashed border-error bg-bg-container text-error',
      'hover:border-dashed hover:border-error-border-hover hover:text-error-hover',
      'active:border-dashed active:border-error-active active:text-error-active',
      solidDisabledClasses,
    ].join(' '),
    text: [
      'bg-transparent text-error',
      'hover:bg-error-bg hover:text-error-hover',
      'active:border-error-border-hover active:bg-error-bg active:text-error-active',
      textDisabledClasses,
    ].join(' '),
    link: [
      'bg-transparent text-error',
      'hover:text-error-hover',
      'active:text-error-active',
      textDisabledClasses,
    ].join(' '),
  },
  ghost: {
    primary: [
      'border-primary bg-transparent text-primary',
      'hover:bg-primary-hover hover:text-text-light-solid',
      'active:bg-primary-active active:text-text-light-solid',
      solidDisabledClasses,
    ].join(' '),
    default: [
      'border-text-light-solid bg-transparent text-text-light-solid',
      'hover:border-primary-hover hover:bg-bg-container hover:text-primary-hover',
      'active:border-primary-active active:text-primary-active',
      solidDisabledClasses,
    ].join(' '),
    dashed: [
      'border-dashed border-text-light-solid bg-transparent text-text-light-solid',
      'hover:border-dashed hover:border-primary-hover hover:bg-bg-container hover:text-primary-hover',
      'active:border-dashed active:border-primary-active active:text-primary-active',
      solidDisabledClasses,
    ].join(' '),
    text: [
      'bg-transparent text-text-light-solid',
      'hover:bg-bg-text-hover hover:text-text',
      'active:bg-bg-text-active active:text-text',
      textDisabledClasses,
    ].join(' '),
    link: [
      'bg-transparent text-text-light-solid',
      'hover:text-primary-hover',
      'active:text-primary-active',
      textDisabledClasses,
    ].join(' '),
  },
  ghostDanger: {
    primary: [
      'border-error bg-transparent text-error',
      'hover:bg-error-hover hover:text-text-light-solid',
      'active:bg-error-active active:text-text-light-solid',
      solidDisabledClasses,
    ].join(' '),
    default: [
      'border-error bg-transparent text-error',
      'hover:border-error-border-hover hover:bg-bg-container hover:text-error-hover',
      'active:border-error-active active:text-error-active',
      solidDisabledClasses,
    ].join(' '),
    dashed: [
      'border-dashed border-error bg-transparent text-error',
      'hover:border-dashed hover:border-error-border-hover hover:bg-bg-container hover:text-error-hover',
      'active:border-dashed active:border-error-active active:text-error-active',
      solidDisabledClasses,
    ].join(' '),
    text: [
      'bg-transparent text-error',
      'hover:bg-error-bg hover:text-error-hover',
      'active:border-error-border-hover active:bg-error-bg active:text-error-active',
      textDisabledClasses,
    ].join(' '),
    link: [
      'bg-transparent text-error',
      'hover:text-error-hover',
      'active:text-error-active',
      textDisabledClasses,
    ].join(' '),
  },
};

function resolveAppearance(danger: boolean, ghost: boolean): Appearance {
  if (ghost && danger) return 'ghostDanger';
  if (ghost) return 'ghost';
  if (danger) return 'danger';
  return 'default';
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      type: buttonType = 'primary',
      htmlType = 'button',
      size = 'md',
      round = false,
      danger = false,
      ghost = false,
      iconOnly = false,
      icon,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) {
    const appearance = resolveAppearance(danger, ghost);
    const isBorderless = buttonType === 'text' || buttonType === 'link';

    return (
      <button
        ref={ref}
        type={htmlType}
        className={cn(
          baseClasses,
          round ? 'rounded-full' : 'rounded-md',
          iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
          isBorderless && 'border-0',
          !isBorderless &&
            (buttonType === 'dashed' ? 'border-dashed' : 'border-solid'),
          appearanceClasses[appearance][buttonType],
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span
            className="inline-block size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : (
          icon
        )}
        {loading ? null : children}
      </button>
    );
  }
);

/** @deprecated Use `ButtonType` */
export type ButtonVariant = ButtonType;

export default Button;
