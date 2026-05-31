import {
  createElement,
  forwardRef,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementType,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { Link, type LinkProps } from 'react-router-dom';

import { Icon, type IconSize } from '../icon';

export type ButtonType =
  | 'primary'
  | 'default'
  | 'dashed'
  | 'text'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonAs = typeof Link | 'a' | 'span';

export type ButtonAsProps =
  | LinkProps
  | ComponentPropsWithoutRef<'a'>
  | ComponentPropsWithoutRef<'span'>;

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
  as?: ButtonAs;
  asProps?: ButtonAsProps;
}

const baseClasses =
  'inline-flex cursor-pointer items-center justify-center gap-size-xs border font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-control-outline focus-visible:ring-offset-2 [&_svg]:!text-current';

const solidDisabledClasses =
  'disabled:pointer-events-none disabled:border-border disabled:bg-bg-container-disabled disabled:text-text-disabled';

const textDisabledClasses =
  'disabled:pointer-events-none disabled:text-text-disabled';

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-control-sm px-[7px] text-body-md',
  md: 'h-control px-[15px] text-body-md',
  lg: 'h-control-lg px-[15px] text-body-lg',
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: 'size-control-sm p-0',
  md: 'size-control p-0',
  lg: 'size-control-lg p-0',
};

const loadingIconSize: Record<ButtonSize, IconSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
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

function getAsElementClasses(as?: ButtonAs) {
  if (!as) {
    return undefined;
  }

  const layoutClasses = 'w-fit self-start';

  if (as === Link || as === 'a') {
    return cn(layoutClasses, 'no-underline');
  }

  return layoutClasses;
}

export const Button = forwardRef<HTMLElement, ButtonProps>(
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
      as,
      asProps,
      onClick,
      ...props
    },
    ref
  ) {
    const appearance = resolveAppearance(danger, ghost);
    const isBorderless = buttonType === 'text' || buttonType === 'link';
    const isDisabled = disabled || loading;
    const Component: ElementType = as ?? 'button';
    const isNativeButton = Component === 'button';

    const {
      className: asClassName,
      onClick: asOnClick,
      ...restAsProps
    } = (asProps ?? {}) as {
      className?: string;
      onClick?: MouseEventHandler<HTMLElement>;
    };

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      asOnClick?.(event);
      (onClick as MouseEventHandler<HTMLElement> | undefined)?.(event);
    };

    const content = (
      <>
        {loading ? (
          <Icon name="loading" size={loadingIconSize[size]} spin />
        ) : (
          icon
        )}
        {loading ? null : children}
      </>
    );

    return createElement(
      Component,
      {
        ...restAsProps,
        ...props,
        ref,
        ...(isNativeButton ? { type: htmlType } : null),
        className: cn(
          baseClasses,
          round ? 'rounded-full' : 'rounded-border',
          iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
          isBorderless && 'border-0',
          !isBorderless &&
            (buttonType === 'dashed' ? 'border-dashed' : 'border-solid'),
          appearanceClasses[appearance][buttonType],
          getAsElementClasses(as),
          asClassName,
          className
        ),
        ...(isNativeButton
          ? { disabled: isDisabled }
          : { 'aria-disabled': isDisabled || undefined }),
        'aria-busy': loading || undefined,
        onClick: isNativeButton ? onClick : handleClick,
      },
      content
    );
  }
);

/** @deprecated Use `ButtonType` */
export type ButtonVariant = ButtonType;

export default Button;
