import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import { type ButtonProps, type ButtonSize } from './button';

export type ButtonGroupDirection = 'horizontal' | 'vertical';

export type ButtonGroupType = 'primary' | 'default' | 'dashed';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  direction?: ButtonGroupDirection;
  size?: ButtonSize;
  type?: ButtonGroupType;
  danger?: boolean;
  children: ReactNode;
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function collectButtonChildren(children: ReactNode): ReactElement<ButtonProps>[] {
  const buttons: ReactElement<ButtonProps>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === Fragment) {
      Children.forEach(
        (child.props as { children?: ReactNode }).children,
        (nested) => {
          if (isValidElement<ButtonProps>(nested)) {
            buttons.push(nested as ReactElement<ButtonProps>);
          }
        }
      );
      return;
    }

    if (isValidElement<ButtonProps>(child)) {
      buttons.push(child as ReactElement<ButtonProps>);
    }
  });

  return buttons;
}

function enhanceButton(
  element: ReactElement<ButtonProps>,
  size: ButtonSize,
  type: ButtonGroupType,
  danger: boolean
) {
  return cloneElement(element, {
    size: element.props.size ?? size,
    type: element.props.type ?? type,
    danger: element.props.danger ?? danger,
    className: cn(element.props.className),
  });
}

const horizontalLayoutClasses = [
  'inline-flex',
  '[&>button]:relative [&>button]:!rounded-none',
  '[&>button:not(:first-child)]:-ml-px',
  '[&>button:first-child]:!rounded-l-md',
  '[&>button:last-child]:!rounded-r-md',
  '[&>button:only-child]:!rounded-md',
  '[&>button:hover]:z-[1]',
  '[&>button:focus-visible]:z-[1]',
  '[&>button:active]:z-[1]',
].join(' ');

const verticalLayoutClasses = [
  'inline-flex flex-col',
  '[&>button]:relative [&>button]:!rounded-none',
  '[&>button:not(:first-child)]:-mt-px',
  '[&>button:first-child]:!rounded-t-md',
  '[&>button:last-child]:!rounded-b-md',
  '[&>button:only-child]:!rounded-md',
  '[&>button:hover]:z-[1]',
  '[&>button:focus-visible]:z-[1]',
  '[&>button:active]:z-[1]',
].join(' ');

export function ButtonGroup({
  direction = 'horizontal',
  size = 'md',
  type = 'default',
  danger = false,
  className,
  children,
  ...props
}: ButtonGroupProps) {
  const layoutClasses =
    direction === 'vertical' ? verticalLayoutClasses : horizontalLayoutClasses;

  const mappedChildren = collectButtonChildren(children).map((element) =>
    enhanceButton(element, size, type, danger)
  );

  return (
    <div role="group" className={cn(layoutClasses, className)} {...props}>
      {mappedChildren}
    </div>
  );
}

export default ButtonGroup;
