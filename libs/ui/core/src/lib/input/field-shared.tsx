import type { ReactNode } from 'react';

import { Icon, type IconName } from '../icon';
import { Label, type TextSize } from '../text';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputStatus = 'error' | 'warning' | 'success';

export type BaseFieldProps = {
  size?: InputSize;
  status?: InputStatus;
  label?: string | ReactNode;
  tooltip?: ReactNode;
  error?: string;
  prefix?: string | ReactNode;
};

export const baseClasses = [
  'w-full rounded-border border border-solid bg-bg-container font-normal text-text',
  'text-body-md transition-colors outline-none',
  'placeholder:text-text-placeholder',
  'disabled:cursor-not-allowed disabled:border-border disabled:bg-bg-container-disabled disabled:text-text-disabled',
  'disabled:hover:border-border disabled:focus:border-border',
].join(' ');

export const inputSizeClasses: Record<InputSize, string> = {
  sm: 'h-control-sm',
  md: 'h-control',
  lg: 'h-control-lg',
};

export const textareaSizeClasses: Record<InputSize, string> = {
  sm: 'min-h-14 resize-y py-padding-xxs',
  md: 'min-h-[72px] resize-y py-1.5',
  lg: 'min-h-20 resize-y py-padding-xs',
};

export const labelSizeMap: Record<InputSize, TextSize> = {
  sm: 'md',
  md: 'md',
  lg: 'lg',
};

export const suffixIconPositionClasses =
  'absolute top-1/2 right-[11px] -translate-y-[calc(50%+1px)]';

export const textareaSuffixIconPositionClasses =
  'absolute top-[11px] right-[11px]';

export const paddingClasses = {
  default: 'px-[11px]',
  withSuffix: 'pl-[11px] pr-[35px]',
} as const;

export const prefixFieldPaddingClasses = {
  default: 'gap-size-xs px-[11px]',
  withSuffix: 'gap-size-xs pl-[11px] pr-[35px]',
} as const;

export const textareaPrefixFieldPaddingClasses = {
  default: 'gap-size-xs px-[11px] py-padding-xxs',
  withSuffix: 'gap-size-xs py-padding-xxs pl-[11px] pr-[35px]',
} as const;

export const inputWithPrefixClasses = [
  'min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none outline-none',
  'font-normal text-text text-body-md',
  'placeholder:text-text-placeholder',
  'focus:border-transparent focus:shadow-none',
  'disabled:cursor-not-allowed disabled:bg-transparent disabled:text-text-disabled',
].join(' ');

export const numberInputClasses = [
  '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
].join(' ');

export const textareaWithPrefixClasses = [
  inputWithPrefixClasses,
  'resize-y',
].join(' ');

export const statusBorderClasses: Record<InputStatus, string> = {
  error: [
    'border-error',
    'hover:border-error-border-hover focus:border-error-border-hover',
  ].join(' '),
  warning: [
    'border-warning',
    'hover:border-warning-border-hover focus:border-warning-border-hover',
  ].join(' '),
  success: [
    'border-border',
    'hover:border-primary-hover focus:border-primary-hover',
  ].join(' '),
};

export const defaultBorderClasses = [
  'border-border',
  'hover:border-primary-hover focus:border-primary-hover',
].join(' ');

export const prefixWrapperBorderClasses: Record<InputStatus | 'default', string> = {
  default: [
    'border-border',
    'hover:border-primary-hover focus-within:border-primary-hover',
  ].join(' '),
  error: [
    'border-error',
    'hover:border-error-border-hover focus-within:border-error-border-hover',
  ].join(' '),
  warning: [
    'border-warning',
    'hover:border-warning-border-hover focus-within:border-warning-border-hover',
  ].join(' '),
  success: [
    'border-border',
    'hover:border-primary-hover focus-within:border-primary-hover',
  ].join(' '),
};

export const statusIconConfig: Record<
  InputStatus,
  { name: IconName; colorClass: string; activeColorClass: string }
> = {
  error: {
    name: 'close-circle',
    colorClass: 'text-error',
    activeColorClass:
      'group-hover:text-error-border-hover group-focus-within:text-error-border-hover',
  },
  warning: {
    name: 'exclamation-circle',
    colorClass: 'text-warning',
    activeColorClass:
      'group-hover:text-warning-border-hover group-focus-within:text-warning-border-hover',
  },
  success: {
    name: 'check-circle',
    colorClass: 'text-success',
    activeColorClass:
      'group-hover:text-success group-focus-within:text-success',
  },
};

export function cn(
  ...classes: Array<
    string | undefined | false | Array<string | undefined | false>
  >
) {
  return classes.flat().filter(Boolean).join(' ');
}

export function hasPrefixContent(
  prefix: BaseFieldProps['prefix']
): prefix is string | ReactNode {
  return prefix != null && prefix !== '';
}

export function FieldPrefix({
  prefix,
  disabled,
  align = 'center',
}: {
  prefix: string | ReactNode;
  disabled?: boolean;
  align?: 'center' | 'start';
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center text-icon',
        align === 'start' && 'self-start pt-1.5',
        disabled && 'text-text-disabled'
      )}
      aria-hidden={typeof prefix !== 'string' ? true : undefined}
    >
      {prefix}
    </span>
  );
}

export function FieldLabel({
  htmlFor,
  size,
  label,
  required,
  tooltip,
}: {
  htmlFor: string;
  size: InputSize;
  label: string | ReactNode;
  required?: boolean;
  tooltip?: ReactNode;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      size={labelSizeMap[size]}
      className="inline-flex items-center gap-size-xxs font-normal text-text-label"
    >
      {required ? (
        <span className="text-label-required-mark" aria-hidden>
          *
        </span>
      ) : null}
      {label}
      {tooltip != null ? (
        <span className="inline-flex cursor-pointer align-middle">
          <Icon name="question-circle" size="md" className="!text-icon" />
        </span>
      ) : null}
    </Label>
  );
}

export function FieldErrorMessage({
  id,
  error,
}: {
  id: string;
  error: string;
}) {
  return (
    <div
      id={id}
      role="alert"
      className="absolute top-full left-0 z-10 mt-0.5 w-full select-text text-body-sm text-error"
    >
      {error}
    </div>
  );
}

export function FieldLayout({
  label,
  tooltip,
  required,
  size,
  inputId,
  hasError,
  error,
  errorId,
  children,
}: {
  label?: string | ReactNode;
  tooltip?: ReactNode;
  required?: boolean;
  size: InputSize;
  inputId: string;
  hasError: boolean;
  error?: string;
  errorId: string;
  children: ReactNode;
}) {
  if (label == null && !hasError) {
    return children;
  }

  return (
    <div className="relative inline-flex w-full flex-col gap-size-xxs">
      {label != null ? (
        <FieldLabel
          htmlFor={inputId}
          size={size}
          label={label}
          required={required}
          tooltip={tooltip}
        />
      ) : null}
      {children}
      {hasError && error != null ? (
        <FieldErrorMessage id={errorId} error={error} />
      ) : null}
    </div>
  );
}
