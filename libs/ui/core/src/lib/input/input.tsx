import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type Ref,
} from 'react';

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
  type InputSize,
  type InputStatus,
} from './field-shared';
import { EmailInput, type EmailInputProps } from './email-input';
import {
  NumberInput,
  type NumberFormat,
  type NumberInputProps,
} from './number-input';
import { TextArea, type TextAreaProps } from './textarea';

export type { InputSize, InputStatus };

type InputControlProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'prefix'
>;

export type InputProps = BaseFieldProps &
  InputControlProps & {
    type?: InputControlProps['type'] | 'textarea' | 'number' | 'email';
    format?: NumberFormat;
  };

const InputControl = forwardRef<HTMLInputElement, InputProps>(
  function InputControl(
    {
      className,
      size = 'md',
      status,
      type = 'text',
      disabled,
      label,
      tooltip,
      error,
      prefix,
      required,
      id: idProp,
      'aria-describedby': ariaDescribedBy,
      ...rest
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
    const hasPrefix = hasPrefixContent(prefix);
    const resolvedType = isPassword && passwordVisible ? 'text' : type;
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
          type={resolvedType}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(inputWithPrefixClasses, className)}
          {...rest}
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
              size="md"
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
                'cursor-pointer hover:text-icon-hover group-hover:text-icon-hover group-focus-within:text-icon-hover',
              disabled && 'cursor-not-allowed text-text-disabled'
            )}
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            <Icon
              name={passwordVisible ? 'eye' : 'eye-invisible'}
              size="md"
            />
          </button>
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

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(function Input(props, ref) {
  if (props.type === 'textarea') {
    const { type: _type, ...textareaProps } = props;
    return (
      <TextArea
        ref={ref as Ref<HTMLTextAreaElement>}
        {...(textareaProps as TextAreaProps)}
      />
    );
  }

  if (props.type === 'number') {
    const { type: _type, ...numberInputProps } = props;
    return (
      <NumberInput
        ref={ref as Ref<HTMLInputElement>}
        {...(numberInputProps as NumberInputProps)}
      />
    );
  }

  if (props.type === 'email') {
    const { type: _type, ...emailInputProps } = props;
    return (
      <EmailInput
        ref={ref as Ref<HTMLInputElement>}
        {...(emailInputProps as EmailInputProps)}
      />
    );
  }

  return <InputControl ref={ref as Ref<HTMLInputElement>} {...props} />;
});

export default Input;
