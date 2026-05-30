import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useId,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import type { CheckboxButtonType } from '../checkbox/checkbox-button-styles';
import { type RadioProps, type RadioSize } from './radio';

export type RadioGroupDirection = 'horizontal' | 'vertical';

export type RadioGroupType = CheckboxButtonType;

export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  name?: string;
  direction?: RadioGroupDirection;
  size?: RadioSize;
  type?: RadioGroupType;
  danger?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function collectRadioChildren(children: ReactNode): ReactElement<RadioProps>[] {
  const radios: ReactElement<RadioProps>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === Fragment) {
      Children.forEach(
        (child.props as { children?: ReactNode }).children,
        (nested) => {
          if (isValidElement<RadioProps>(nested)) {
            radios.push(nested as ReactElement<RadioProps>);
          }
        }
      );
      return;
    }

    if (isValidElement<RadioProps>(child)) {
      radios.push(child as ReactElement<RadioProps>);
    }
  });

  return radios;
}

function enhanceRadio(
  element: ReactElement<RadioProps>,
  name: string,
  size: RadioSize,
  type: RadioGroupType,
  danger: boolean,
  disabled: boolean
) {
  return cloneElement(element, {
    variant: element.props.variant ?? 'button',
    size: element.props.size ?? size,
    type: element.props.type ?? type,
    danger: element.props.danger ?? danger,
    disabled: element.props.disabled ?? disabled,
    name: element.props.name ?? name,
    className: cn(element.props.className),
  });
}

const horizontalLayoutClasses = [
  'inline-flex',
  '[&>label]:relative [&>label]:!rounded-none',
  '[&>label:not(:first-child)]:-ml-px',
  '[&>label:first-child]:!rounded-l-border',
  '[&>label:last-child]:!rounded-r-border',
  '[&>label:only-child]:!rounded-border',
  '[&>label:hover]:z-[1]',
  '[&>label:focus-within]:z-[1]',
].join(' ');

const verticalLayoutClasses = [
  'inline-flex flex-col',
  '[&>label]:relative [&>label]:!rounded-none',
  '[&>label:not(:first-child)]:-mt-px',
  '[&>label:first-child]:!rounded-t-border',
  '[&>label:last-child]:!rounded-b-border',
  '[&>label:only-child]:!rounded-border',
  '[&>label:hover]:z-[1]',
  '[&>label:focus-within]:z-[1]',
].join(' ');

export function RadioGroup({
  name: nameProp,
  direction = 'horizontal',
  size = 'md',
  type = 'default',
  danger = false,
  disabled = false,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const generatedName = useId();
  const name = nameProp ?? generatedName;
  const layoutClasses =
    direction === 'vertical' ? verticalLayoutClasses : horizontalLayoutClasses;

  const mappedChildren = collectRadioChildren(children).map((element) =>
    enhanceRadio(element, name, size, type, danger, disabled)
  );

  return (
    <div role="radiogroup" className={cn(layoutClasses, className)} {...props}>
      {mappedChildren}
    </div>
  );
}

export default RadioGroup;
