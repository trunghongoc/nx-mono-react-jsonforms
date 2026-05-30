import {
  forwardRef,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import {
  buttonVariantBaseClasses,
  buttonVariantSizeClasses,
  getButtonVariantCheckedClasses,
  getButtonVariantUncheckedClasses,
  type CheckboxButtonType,
} from '../checkbox/checkbox-button-styles';

export type RadioButtonType = CheckboxButtonType;

export type RadioSize = 'sm' | 'md' | 'lg';

export type RadioVariant = 'default' | 'button';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  variant?: RadioVariant;
  size?: RadioSize;
  type?: RadioButtonType;
  danger?: boolean;
  children?: ReactNode;
}

const circleSizeClasses: Record<RadioSize, string> = {
  sm: 'size-[14px] rounded-full',
  md: 'size-size rounded-full',
  lg: 'size-size-md rounded-full',
};

const dotSizeClasses: Record<RadioSize, string> = {
  sm: 'size-[6px]',
  md: 'size-[8px]',
  lg: 'size-[10px]',
};

const labelSizeClasses: Record<RadioSize, string> = {
  sm: 'text-body-sm',
  md: 'text-body-md',
  lg: 'text-body-lg',
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    className,
    variant = 'default',
    size = 'md',
    type: buttonType = 'default',
    danger = false,
    disabled,
    children,
    id: idProp,
    onChange,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const innerRef = useRef<HTMLInputElement>(null);

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  if (variant === 'button') {
    return (
      <label
        className={cn(
          buttonVariantBaseClasses,
          buttonVariantSizeClasses[size],
          getButtonVariantUncheckedClasses(buttonType, danger),
          getButtonVariantCheckedClasses(buttonType, danger),
          className
        )}
      >
        <input
          ref={setRefs}
          id={inputId}
          type="radio"
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
          {...rest}
        />
        {children ? <span className="whitespace-nowrap">{children}</span> : null}
      </label>
    );
  }

  return (
    <label
      className={cn(
        'group/radio inline-flex cursor-pointer items-center gap-size-xs',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <span className="relative inline-flex shrink-0">
        <input
          ref={setRefs}
          id={inputId}
          type="radio"
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
          {...rest}
        />
        <span
          className={cn(
            'inline-flex items-center justify-center border border-solid transition-colors',
            circleSizeClasses[size],
            'border-default-border-color bg-default-bg',
            'group-has-[:enabled]/radio:group-hover/radio:border-primary-hover',
            'group-has-[:focus-visible]/radio:outline-none group-has-[:focus-visible]/radio:ring-2 group-has-[:focus-visible]/radio:ring-control-outline group-has-[:focus-visible]/radio:ring-offset-2',
            'group-has-[:checked]/radio:border-primary',
            'group-has-[:disabled]/radio:border-border group-has-[:disabled]/radio:bg-bg-container-disabled',
            'group-has-[:disabled]/radio:group-hover/radio:border-border',
            'group-has-[:checked]/radio:group-has-[:disabled]/radio:border-border group-has-[:checked]/radio:group-has-[:disabled]/radio:bg-bg-container-disabled'
          )}
          aria-hidden
        >
          <span
            className={cn(
              'rounded-full bg-primary transition-[opacity,transform]',
              dotSizeClasses[size],
              'scale-0 opacity-0',
              'group-has-[:checked]/radio:scale-100 group-has-[:checked]/radio:opacity-100',
              'group-has-[:disabled]/radio:bg-text-disabled'
            )}
          />
        </span>
      </span>
      {children ? (
        <span
          className={cn(
            labelSizeClasses[size],
            'text-text',
            disabled && 'text-text-disabled'
          )}
        >
          {children}
        </span>
      ) : null}
    </label>
  );
});

export default Radio;
