import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { Icon, type IconName, type IconTheme } from '../icon';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'custom';
export type AvatarShape = 'circle' | 'square';

const AVATAR_SIZE_MAP: Record<Exclude<AvatarSize, 'custom'>, number> = {
  sm: 24,
  md: 32,
  lg: 40,
};

type AvatarCommonProps = {
  size?: AvatarSize;
  customSize?: number;
  shape?: AvatarShape;
  background?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export type AvatarIconProps = AvatarCommonProps & {
  icon: IconName;
  iconTheme?: IconTheme;
  src?: never;
  alt?: never;
  text?: never;
  maxChars?: never;
  textSize?: never;
};

export type AvatarImageProps = AvatarCommonProps & {
  src: string;
  alt?: string;
  icon?: never;
  iconTheme?: never;
  text?: never;
  maxChars?: never;
  textSize?: never;
};

export type AvatarTextProps = AvatarCommonProps & {
  text: string;
  maxChars?: number | null;
  textSize?: number;
  icon?: never;
  iconTheme?: never;
  src?: never;
  alt?: never;
};

export type AvatarProps =
  | AvatarIconProps
  | AvatarImageProps
  | AvatarTextProps;

const shapeClasses: Record<AvatarShape, string> = {
  circle: 'rounded-[999px]',
  square: 'rounded-[6px]',
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function resolveAvatarSize(size: AvatarSize, customSize?: number): number {
  if (size === 'custom') {
    if (customSize == null) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Avatar] customSize is required when size is "custom".');
      }
      return AVATAR_SIZE_MAP.md;
    }
    return customSize;
  }
  return AVATAR_SIZE_MAP[size];
}

function getAvatarInitials(text: string, maxChars: number): string {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxChars)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

const MIN_TEXT_FONT_SIZE = 6;

function AvatarTextContent({
  displayText,
  initialFontSize,
}: {
  displayText: string;
  initialFontSize: number;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(initialFontSize);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) {
      return;
    }

    let nextSize = initialFontSize;
    const minSize = Math.max(
      MIN_TEXT_FONT_SIZE,
      Math.floor(initialFontSize * 0.4)
    );

    el.style.fontSize = `${nextSize}px`;

    while (nextSize > minSize && el.scrollWidth > el.clientWidth) {
      nextSize -= 1;
      el.style.fontSize = `${nextSize}px`;
    }

    setFontSize((current) => (current === nextSize ? current : nextSize));
  }, [displayText, initialFontSize]);

  return (
    <span
      ref={textRef}
      className="block w-full overflow-hidden whitespace-nowrap text-center leading-none font-medium text-current"
      style={{ fontSize }}
    >
      {displayText}
    </span>
  );
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  props,
  ref
) {
  const {
    size = 'md',
    customSize,
    shape = 'circle',
    background,
    color,
    className,
    style,
    icon,
    iconTheme,
    src,
    alt,
    text,
    maxChars = 2,
    textSize,
    onClick,
    ...rest
  } = props as AvatarProps & {
    icon?: IconName;
    iconTheme?: IconTheme;
    src?: string;
    alt?: string;
    text?: string;
    maxChars?: number | null;
    textSize?: number;
  };

  const avatarSize = resolveAvatarSize(size, customSize);
  const iconSize = avatarSize * 0.6;
  const textFontSize = avatarSize * 0.5;

  const avatarStyle: CSSProperties = {
    width: avatarSize,
    height: avatarSize,
    ...(background ? { backgroundColor: background } : null),
    ...(color ? { color } : null),
    ...style,
  };

  let content: ReactNode;

  if (src != null) {
    content = (
      <img
        src={src}
        alt={alt ?? ''}
        className="size-full object-cover"
        draggable={false}
      />
    );
  } else if (text != null) {
    const displayText =
      maxChars == null ? text : getAvatarInitials(text, maxChars);

    content = (
      <AvatarTextContent
        displayText={displayText}
        initialFontSize={textSize ?? textFontSize}
      />
    );
  } else if (icon != null) {
    content = (
      <Icon
        name={icon}
        theme={iconTheme}
        size={iconSize}
        className="!text-current"
      />
    );
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Avatar] Provide icon, src, or text.');
    }
    content = null;
  }

  return (
    <span
      ref={ref}
      className={cn(
        'box-border inline-flex shrink-0 items-center justify-center overflow-hidden select-none',
        shapeClasses[shape],
        text != null && 'p-[2px]',
        onClick != null && 'cursor-pointer',
        background == null && 'bg-text-placeholder',
        color == null && 'text-text-light-solid',
        className
      )}
      style={avatarStyle}
      onClick={onClick}
      {...rest}
    >
      {content}
    </span>
  );
});

export default Avatar;
