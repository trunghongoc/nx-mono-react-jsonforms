import {
  forwardRef,
  useId,
  useRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: SwitchSize;
  children?: ReactNode;
}

const trackSizeClasses: Record<SwitchSize, string> = {
  sm: 'h-control-xs w-[28px] p-[2px]',
  md: 'h-[22px] w-[44px] p-[2px]',
  lg: 'h-control-sm w-[52px] p-[2px]',
};

const thumbSizeClasses: Record<SwitchSize, string> = {
  sm: 'size-size-sm',
  md: 'size-[18px]',
  lg: 'size-size-md',
};

const thumbCheckedTranslateClasses: Record<SwitchSize, string> = {
  sm: 'group-has-[:checked]/switch:translate-x-[12px]',
  md: 'group-has-[:checked]/switch:translate-x-[22px]',
  lg: 'group-has-[:checked]/switch:translate-x-[28px]',
};

const labelSizeClasses: Record<SwitchSize, string> = {
  sm: 'text-body-sm',
  md: 'text-body-md',
  lg: 'text-body-lg',
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    className,
    size = 'md',
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

  return (
    <label
      className={cn(
        'group/switch inline-flex cursor-pointer items-center gap-size-xs',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <span className="relative inline-flex shrink-0">
        <input
          ref={setRefs}
          id={inputId}
          type="checkbox"
          role="switch"
          disabled={disabled}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className="sr-only"
          {...rest}
        />
        <span
          className={cn(
            'inline-flex shrink-0 items-center rounded-full transition-colors',
            trackSizeClasses[size],
            'bg-fill',
            'group-has-[:checked]/switch:bg-primary',
            'group-has-[:focus-visible]/switch:outline-none group-has-[:focus-visible]/switch:ring-2 group-has-[:focus-visible]/switch:ring-control-outline group-has-[:focus-visible]/switch:ring-offset-2',
            'group-has-[:disabled]/switch:bg-bg-container-disabled',
            'group-has-[:checked]/switch:group-has-[:disabled]/switch:bg-control-item-bg-active-disabled'
          )}
          aria-hidden
        >
          <span
            className={cn(
              'block rounded-full bg-default-bg shadow-sm transition-transform',
              thumbSizeClasses[size],
              'translate-x-0',
              thumbCheckedTranslateClasses[size],
              'group-has-[:disabled]/switch:bg-bg-container'
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

export default Switch;
