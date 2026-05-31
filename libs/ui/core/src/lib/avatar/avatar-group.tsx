import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import { Avatar, resolveAvatarSize, type AvatarProps, type AvatarSize } from './avatar';

export interface AvatarGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  max?: number;
  size?: AvatarSize;
  customSize?: number;
  children: ReactNode;
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function collectAvatarChildren(children: ReactNode): ReactElement<AvatarProps>[] {
  const avatars: ReactElement<AvatarProps>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === Fragment) {
      Children.forEach(
        (child.props as { children?: ReactNode }).children,
        (nested) => {
          if (isValidElement<AvatarProps>(nested)) {
            avatars.push(nested as ReactElement<AvatarProps>);
          }
        }
      );
      return;
    }

    if (isValidElement<AvatarProps>(child)) {
      avatars.push(child as ReactElement<AvatarProps>);
    }
  });

  return avatars;
}

function resolveOverlap(size: AvatarSize, customSize?: number): number {
  const avatarSize = resolveAvatarSize(size, customSize);
  return Math.round(avatarSize * 0.25);
}

function enhanceAvatar(
  element: ReactElement<AvatarProps>,
  index: number,
  overlap: number,
  size: AvatarSize,
  customSize?: number
) {
  return cloneElement(element, {
    size: element.props.size ?? size,
    customSize: element.props.customSize ?? customSize,
    className: cn('border-2 border-bg-container', element.props.className),
    style: {
      ...element.props.style,
      position: 'relative',
      ...(index > 0 ? { marginInlineStart: -overlap } : null),
      zIndex: index + 1,
    },
  });
}

export function AvatarGroup({
  max,
  size = 'md',
  customSize,
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const avatars = collectAvatarChildren(children);
  const total = avatars.length;
  const overlap = resolveOverlap(size, customSize);

  const hasOverflow = max != null && total > max;
  const visibleCount = hasOverflow ? Math.max(max - 1, 0) : total;
  const overflowCount = hasOverflow ? total - visibleCount : 0;

  const visibleAvatars = avatars.slice(0, visibleCount).map((avatar, index) =>
    enhanceAvatar(avatar, index, overlap, size, customSize)
  );

  return (
    <div className={cn('inline-flex items-center', className)} {...props}>
      {visibleAvatars}
      {hasOverflow ? (
        <Avatar
          text={`+${overflowCount}`}
          maxChars={null}
          size={size}
          customSize={customSize}
          background="var(--color-warning-bg)"
          color="var(--color-warning)"
          className="border-2 border-bg-container"
          style={{
            position: 'relative',
            marginInlineStart: visibleCount > 0 ? -overlap : undefined,
            zIndex: visibleCount + 1,
          }}
        />
      ) : null}
    </div>
  );
}

export default AvatarGroup;
