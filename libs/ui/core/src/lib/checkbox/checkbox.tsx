import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { Icon } from '../icon';
import {
  buttonVariantBaseClasses,
  buttonVariantSizeClasses,
  getButtonVariantCheckedClasses,
  getButtonVariantUncheckedClasses,
  type CheckboxButtonType,
} from './checkbox-button-styles';

export type { CheckboxButtonType };

export type CheckboxSize = 'sm' | 'md' | 'lg';

export type CheckboxVariant = 'default' | 'button';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  type?: CheckboxButtonType;
  danger?: boolean;
  indeterminate?: boolean;
  children?: ReactNode;
}

const boxSizeClasses: Record<CheckboxSize, string> = {
  sm: 'size-[14px] rounded-border-xs',
  md: 'size-size rounded-border-xs',
  lg: 'size-size-md rounded-border-xs',
};

const checkIconSize: Record<CheckboxSize, 'xs' | 'sm' | 'md'> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

const labelSizeClasses: Record<CheckboxSize, string> = {
  sm: 'text-body-sm',
  md: 'text-body-md',
  lg: 'text-body-lg',
};

const nativeInputOverlayClasses =
  'peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed';

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      className,
      variant = 'default',
      size = 'md',
      type: buttonType = 'default',
      danger = false,
      indeterminate = false,
      disabled,
      children,
      id: idProp,
      onChange,
      onKeyDown,
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

    useEffect(() => {
      const input = innerRef.current;
      if (input) {
        input.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled || event.currentTarget.readOnly) {
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        event.currentTarget.click();
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
            type="checkbox"
            disabled={disabled}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className={nativeInputOverlayClasses}
            {...rest}
          />
          {children ? (
            <span className="pointer-events-none relative z-0 whitespace-nowrap">
              {children}
            </span>
          ) : null}
        </label>
      );
    }

    return (
      <label
        className={cn(
          'group/checkbox relative inline-flex cursor-pointer items-center gap-size-xs',
          disabled && 'cursor-not-allowed',
          className
        )}
      >
        <input
          ref={setRefs}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className={nativeInputOverlayClasses}
          {...rest}
        />
        <span className="pointer-events-none relative z-0 inline-flex shrink-0">
          <span
            className={cn(
              'inline-flex items-center justify-center border border-solid transition-colors',
              boxSizeClasses[size],
              'border-default-border-color bg-default-bg',
              'group-has-[:enabled]/checkbox:group-hover/checkbox:border-primary-hover',
              'group-has-[:focus-visible]/checkbox:outline-none group-has-[:focus-visible]/checkbox:ring-2 group-has-[:focus-visible]/checkbox:ring-control-outline group-has-[:focus-visible]/checkbox:ring-offset-2',
              'group-has-[:checked]/checkbox:border-primary group-has-[:checked]/checkbox:bg-primary group-has-[:checked]/checkbox:text-text-light-solid',
              'group-has-[:indeterminate]/checkbox:border-primary group-has-[:indeterminate]/checkbox:bg-primary group-has-[:indeterminate]/checkbox:text-text-light-solid',
              'group-has-[:disabled]/checkbox:border-border group-has-[:disabled]/checkbox:bg-bg-container-disabled',
              'group-has-[:disabled]/checkbox:group-hover/checkbox:border-border',
              'group-has-[:checked]/checkbox:group-has-[:disabled]/checkbox:border-border group-has-[:checked]/checkbox:group-has-[:disabled]/checkbox:bg-control-item-bg-active-disabled group-has-[:checked]/checkbox:group-has-[:disabled]/checkbox:text-text-disabled',
              'group-has-[:indeterminate]/checkbox:group-has-[:disabled]/checkbox:border-border group-has-[:indeterminate]/checkbox:group-has-[:disabled]/checkbox:bg-control-item-bg-active-disabled group-has-[:indeterminate]/checkbox:group-has-[:disabled]/checkbox:text-text-disabled'
            )}
            aria-hidden
          >
            <Icon
              name="check"
              size={checkIconSize[size]}
              className={cn(
                'pointer-events-none shrink-0 !text-current',
                'scale-0 opacity-0 transition-[opacity,transform]',
                'group-has-[:checked]/checkbox:scale-100 group-has-[:checked]/checkbox:opacity-100',
                'group-has-[:indeterminate]/checkbox:scale-0 group-has-[:indeterminate]/checkbox:opacity-0',
                'group-has-[:disabled]/checkbox:!text-text-disabled'
              )}
            />
            <Icon
              name="minus"
              size={checkIconSize[size]}
              className={cn(
                'pointer-events-none absolute shrink-0 !text-current',
                'scale-0 opacity-0 transition-[opacity,transform]',
                'group-has-[:indeterminate]/checkbox:scale-100 group-has-[:indeterminate]/checkbox:opacity-100',
                'group-has-[:disabled]/checkbox:!text-text-disabled'
              )}
            />
          </span>
        </span>
        {children ? (
          <span
            className={cn(
              labelSizeClasses[size],
              'pointer-events-none relative z-0 text-text',
              disabled && 'text-text-disabled'
            )}
          >
            {children}
          </span>
        ) : null}
      </label>
    );
  }
);

export default Checkbox;
