import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { Icon, type IconName } from '../icon';
import { Label, type TextSize } from '../text';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputStatus = 'error' | 'warning' | 'success';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  status?: InputStatus;
  label?: string | ReactNode;
  tooltip?: ReactNode;
  error?: string;
}

const baseClasses = [
  'w-full rounded-md border border-solid bg-bg-container font-normal text-text',
  'text-body-md transition-colors outline-none',
  'placeholder:text-text-placeholder',
  'disabled:cursor-not-allowed disabled:border-border disabled:bg-bg-container-disabled disabled:text-text-disabled',
  'disabled:hover:border-border disabled:focus:border-border',
].join(' ');

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
};

const labelSizeMap: Record<InputSize, TextSize> = {
  sm: 'md',
  md: 'md',
  lg: 'lg',
};

const suffixIconPositionClasses =
  'absolute top-1/2 right-[11px] -translate-y-[calc(50%+1px)]';

const paddingClasses = {
  default: 'px-[11px]',
  withSuffix: 'pl-[11px] pr-[35px]',
} as const;

const statusBorderClasses: Record<InputStatus, string> = {
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

const defaultBorderClasses = [
  'border-border',
  'hover:border-primary-hover focus:border-primary-hover',
].join(' ');

const statusIconConfig: Record<
  InputStatus,
  { name: IconName; colorClass: string; activeColorClass: string }
> = {
  error: {
    name: 'close-circle',
    colorClass: 'text-error',
    activeColorClass: 'peer-hover:text-error-border-hover peer-focus:text-error-border-hover',
  },
  warning: {
    name: 'exclamation-circle',
    colorClass: 'text-warning',
    activeColorClass:
      'peer-hover:text-warning-border-hover peer-focus:text-warning-border-hover',
  },
  success: {
    name: 'check-circle',
    colorClass: 'text-success',
    activeColorClass: 'peer-hover:text-success peer-focus:text-success',
  },
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function InputLabel({
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
      className="inline-flex items-center gap-1 font-normal text-text-label"
    >
      {required ? (
        <span className="text-label-required-mark" aria-hidden>
          *
        </span>
      ) : null}
      {label}
      {tooltip != null ? (
        <span className="inline-flex cursor-pointer align-middle">
          <Icon name="question-circle" size={16} className="!text-icon" />
        </span>
      ) : null}
    </Label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    size = 'md',
    status,
    type = 'text',
    disabled,
    label,
    tooltip,
    error,
    required,
    id: idProp,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const errorId = useId();
  const inputId = idProp ?? generatedId;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const hasStatusIcon = status != null && !isPassword;
  const hasSuffix = hasStatusIcon || isPassword;
  const resolvedType = isPassword && passwordVisible ? 'text' : type;
  const hasError = error != null && error !== '';
  const describedBy = cn(ariaDescribedBy, hasError && errorId) || undefined;

  const inputElement = (
    <div className="relative inline-flex w-full">
      <input
        ref={ref}
        id={inputId}
        type={resolvedType}
        disabled={disabled}
        required={required}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={cn(
          'peer',
          baseClasses,
          sizeClasses[size],
          hasSuffix ? paddingClasses.withSuffix : paddingClasses.default,
          status ? statusBorderClasses[status] : defaultBorderClasses,
          className
        )}
        {...props}
      />

      {hasStatusIcon ? (
        <span
          className={cn(
            'pointer-events-none',
            suffixIconPositionClasses,
            'transition-colors',
            statusIconConfig[status].colorClass,
            !disabled && statusIconConfig[status].activeColorClass
          )}
          aria-hidden
        >
          <Icon
            name={statusIconConfig[status].name}
            theme="filled"
            size={16}
            className="!text-current"
          />
        </span>
      ) : null}

      {isPassword ? (
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          className={cn(
            suffixIconPositionClasses,
            'text-icon transition-colors',
            !disabled &&
              'cursor-pointer hover:text-icon-hover peer-hover:text-icon-hover peer-focus:text-icon-hover',
            disabled && 'cursor-not-allowed text-text-disabled'
          )}
          onClick={() => setPasswordVisible((visible) => !visible)}
        >
          <Icon
            name={passwordVisible ? 'eye' : 'eye-invisible'}
            size={16}
          />
        </button>
      ) : null}
    </div>
  );

  if (label == null && !hasError) {
    return inputElement;
  }

  return (
    <div className="relative inline-flex w-full flex-col gap-1">
      {label != null ? (
        <InputLabel
          htmlFor={inputId}
          size={size}
          label={label}
          required={required}
          tooltip={tooltip}
        />
      ) : null}
      {inputElement}
      {hasError ? (
        <div
          id={errorId}
          role="alert"
          className="pointer-events-none absolute top-full left-0 z-10 mt-0.5 w-full text-body-sm text-error"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
});

export default Input;
