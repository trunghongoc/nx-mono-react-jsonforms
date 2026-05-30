import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';

import { Icon } from '../icon';
import {
  baseClasses,
  cn,
  FieldLayout,
  FieldPrefix,
  hasPrefixContent,
  paddingClasses,
  prefixFieldPaddingClasses,
  prefixWrapperBorderClasses,
  statusIconConfig,
  textareaPrefixFieldPaddingClasses,
  textareaSizeClasses,
  textareaSuffixIconPositionClasses,
  textareaWithPrefixClasses,
  type BaseFieldProps,
} from './field-shared';

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'prefix'>,
    BaseFieldProps {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
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
      rows,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const errorId = useId();
    const fieldId = idProp ?? generatedId;
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
        ? textareaPrefixFieldPaddingClasses.withSuffix
        : textareaPrefixFieldPaddingClasses.default
      : hasSuffix
        ? paddingClasses.withSuffix
        : paddingClasses.default;

    const control = (
      <div
        className={cn(
          'group relative inline-flex w-full items-start',
          baseClasses,
          textareaSizeClasses[size],
          fieldPaddingClasses,
          wrapperBorderClasses,
          disabled &&
            'cursor-not-allowed border-border bg-bg-container-disabled text-text-disabled hover:border-border focus-within:border-border'
        )}
      >
        {hasPrefix ? (
          <FieldPrefix prefix={prefix} disabled={disabled} align="start" />
        ) : null}
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(textareaWithPrefixClasses, className)}
          {...props}
        />

        {hasStatusIcon ? (
          <span
            className={cn(
              'pointer-events-none',
              textareaSuffixIconPositionClasses,
              'transition-colors',
              statusIconConfig[status].colorClass,
              !disabled && statusIconConfig[status].activeColorClass
            )}
            aria-hidden
          >
            <Icon
              name={statusIconConfig[status].name}
              theme="filled"
              size="md"
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
        inputId={fieldId}
        hasError={hasError}
        error={error}
        errorId={errorId}
      >
        {control}
      </FieldLayout>
    );
  }
);

export default TextArea;
