import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
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
  numberInputClasses,
  paddingClasses,
  prefixFieldPaddingClasses,
  prefixWrapperBorderClasses,
  statusIconConfig,
  suffixIconPositionClasses,
  type BaseFieldProps,
} from './field-shared';

export type NumberFormatRound = 'ceil' | 'floor' | 'none';

export type NumberFormat = {
  decimal?: number;
  round?: NumberFormatRound;
};

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type'>,
    BaseFieldProps {
  format?: NumberFormat;
}

function toNumericValue(
  value: string | number | readonly string[] | undefined
): number | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }

  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : value;
  }

  const cleaned = String(value).replace(/,/g, '').trim();
  if (cleaned === '' || cleaned === '-') {
    return undefined;
  }

  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function roundNumber(
  value: number,
  decimal: number,
  mode: NumberFormatRound = 'ceil'
): number {
  const factor = 10 ** decimal;

  if (mode === 'none') {
    return Math.trunc(value * factor) / factor;
  }

  if (mode === 'floor') {
    return Math.floor(value * factor) / factor;
  }

  return Math.round(value * factor) / factor;
}

export function formatNumberValue(value: number, format: NumberFormat): string {
  const decimal = format.decimal ?? 0;
  const round = format.round ?? 'ceil';
  const processed = roundNumber(value, decimal, round);
  const [intPart, decPart] = processed.toFixed(decimal).split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

function toEditingValue(value: number | undefined): string {
  if (value === undefined) {
    return '';
  }

  return String(value);
}

type InputElementWithValue = {
  value: string;
};

function getInputElementValue(element: EventTarget): string {
  return (element as unknown as InputElementWithValue).value;
}

function setInputElementValue(element: EventTarget, value: string): void {
  (element as unknown as InputElementWithValue).value = value;
}

function createChangeEvent(
  event: ChangeEvent<HTMLInputElement>,
  value: string
): ChangeEvent<HTMLInputElement> {
  setInputElementValue(event.currentTarget, value);
  return event;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
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
      format,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
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
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<number | undefined>(() =>
      toNumericValue(defaultValue)
    );
    const [focused, setFocused] = useState(false);
    const [editingValue, setEditingValue] = useState('');

    const numericValue = isControlled ? toNumericValue(value) : internalValue;
    const displayValue = focused
      ? editingValue
      : numericValue !== undefined && format
        ? formatNumberValue(numericValue, format)
        : numericValue !== undefined
          ? String(numericValue)
          : '';

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

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      setEditingValue(toEditingValue(numericValue));
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setEditingValue('');

      const parsed = toNumericValue(getInputElementValue(event.currentTarget));
      if (!isControlled && parsed !== internalValue) {
        setInternalValue(parsed);
      }

      onBlur?.(event);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const raw = getInputElementValue(event.currentTarget);

      if (format) {
        setEditingValue(raw);
        const parsed = toNumericValue(raw);

        if (!isControlled) {
          setInternalValue(parsed);
        }

        const nextValue =
          parsed !== undefined ? String(parsed) : raw.replace(/,/g, '');
        onChange?.(createChangeEvent(event, nextValue));
        return;
      }

      if (!isControlled) {
        setInternalValue(toNumericValue(raw));
      }

      onChange?.(event);
    };

    const inputProps = format
      ? {
          type: 'text' as const,
          inputMode: 'decimal' as const,
          value: displayValue,
          onChange: handleChange,
          onFocus: handleFocus,
          onBlur: handleBlur,
        }
      : {
          type: 'number' as const,
          value,
          defaultValue,
          onChange,
          onFocus,
          onBlur,
        };

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
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(inputWithPrefixClasses, numberInputClasses, className)}
          {...props}
          {...inputProps}
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

export default NumberInput;
