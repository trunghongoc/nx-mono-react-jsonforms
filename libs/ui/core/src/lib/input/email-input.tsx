import { forwardRef, useId, type InputHTMLAttributes } from 'react';

import { Icon } from '../icon';
import {
  baseClasses,
  cn,
  FieldLayout,
  FieldPrefix,
  hasPrefixContent,
  inputSizeClasses,
  inputWithPrefixClasses,
  paddingClasses,
  prefixFieldPaddingClasses,
  prefixWrapperBorderClasses,
  statusIconConfig,
  suffixIconPositionClasses,
  type BaseFieldProps,
} from './field-shared';

export interface EmailInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type'>,
    BaseFieldProps {}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  function EmailInput(
    {
      className,
      size = 'md',
      status,
      disabled,
      label,
      tooltip,
      error,
      prefix,
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
    const hasStatusIcon = status != null;
    const hasSuffix = hasStatusIcon;
    const hasPrefix = hasPrefixContent(prefix);
    const hasError = error != null && error !== '';
    const describedBy = cn(ariaDescribedBy, hasError && errorId) || undefined;

    const wrapperBorderClasses = status
      ? prefixWrapperBorderClasses[status]
      : prefixWrapperBorderClasses.default;
    const fieldPaddingClasses = hasPrefix
      ? hasSuffix
        ? prefixFieldPaddingClasses.withSuffix
        : prefixFieldPaddingClasses.default
      : hasSuffix
        ? paddingClasses.withSuffix
        : paddingClasses.default;

    const control = (
      <div
        className={cn(
          'group relative inline-flex w-full items-center',
          baseClasses,
          inputSizeClasses[size],
          fieldPaddingClasses,
          wrapperBorderClasses,
          disabled &&
            'cursor-not-allowed border-border bg-bg-container-disabled text-text-disabled hover:border-border focus-within:border-border'
        )}
      >
        {hasPrefix ? <FieldPrefix prefix={prefix} disabled={disabled} /> : null}
        <input
          ref={ref}
          id={inputId}
          type="email"
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(inputWithPrefixClasses, className)}
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
      </div>
    );

    return (
      <FieldLayout
        label={label}
        tooltip={tooltip}
        required={required}
        size={size}
        inputId={inputId}
        hasError={hasError}
        error={error}
        errorId={errorId}
      >
        {control}
      </FieldLayout>
    );
  }
);

export default EmailInput;
