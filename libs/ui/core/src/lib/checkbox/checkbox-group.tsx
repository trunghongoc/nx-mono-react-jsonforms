import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import type { CheckboxButtonType } from './checkbox-button-styles';
import { type CheckboxProps, type CheckboxSize } from './checkbox';

export type CheckboxGroupDirection = 'horizontal' | 'vertical';

export type CheckboxGroupType = CheckboxButtonType;

export interface CheckboxGroupProps extends HTMLAttributes<HTMLDivElement> {
  direction?: CheckboxGroupDirection;
  size?: CheckboxSize;
  type?: CheckboxGroupType;
  danger?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function collectCheckboxChildren(
  children: ReactNode
): ReactElement<CheckboxProps>[] {
  const checkboxes: ReactElement<CheckboxProps>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === Fragment) {
      Children.forEach(
        (child.props as { children?: ReactNode }).children,
        (nested) => {
          if (isValidElement<CheckboxProps>(nested)) {
            checkboxes.push(nested as ReactElement<CheckboxProps>);
          }
        }
      );
      return;
    }

    if (isValidElement<CheckboxProps>(child)) {
      checkboxes.push(child as ReactElement<CheckboxProps>);
    }
  });

  return checkboxes;
}

function enhanceCheckbox(
  element: ReactElement<CheckboxProps>,
  size: CheckboxSize,
  type: CheckboxGroupType,
  danger: boolean,
  disabled: boolean
) {
  return cloneElement(element, {
    variant: element.props.variant ?? 'button',
    size: element.props.size ?? size,
    type: element.props.type ?? type,
    danger: element.props.danger ?? danger,
    disabled: element.props.disabled ?? disabled,
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

export function CheckboxGroup({
  direction = 'horizontal',
  size = 'md',
  type = 'default',
  danger = false,
  disabled = false,
  className,
  children,
  ...props
}: CheckboxGroupProps) {
  const layoutClasses =
    direction === 'vertical' ? verticalLayoutClasses : horizontalLayoutClasses;

  const mappedChildren = collectCheckboxChildren(children).map((element) =>
    enhanceCheckbox(element, size, type, danger, disabled)
  );

  return (
    <div role="group" className={cn(layoutClasses, className)} {...props}>
      {mappedChildren}
    </div>
  );
}

export default CheckboxGroup;
