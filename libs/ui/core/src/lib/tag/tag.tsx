import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEventHandler,
  type ReactNode,
} from 'react';

import { Icon, iconNames, type IconName } from '../icon';

export type TagBorderStyle =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset'
  | 'none';

export type TagType =
  | 'default'
  | 'magenta'
  | 'blue'
  | 'cyan'
  | 'geek-blue'
  | 'gold'
  | 'green'
  | 'lime'
  | 'purple'
  | 'red'
  | 'volcano'
  | 'primary';

export type TagIconConfig = IconName | { name: IconName; onClick?: MouseEventHandler };

export interface TagColors {
  border?: string;
  text?: string;
  background?: string;
}

export interface TagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'content'> {
  type?: TagType;
  border?: boolean;
  borderStyle?: TagBorderStyle;
  content?: string | number | ReactNode;
  iconLeft?: TagIconConfig;
  iconRight?: TagIconConfig;
  colors?: TagColors;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}

type TagColorClasses = {
  text: string;
  bg: string;
  border: string;
};

const typeColorClasses: Record<TagType, TagColorClasses> = {
  default: {
    text: 'text-text',
    bg: 'bg-default-bg',
    border: 'border-border',
  },
  magenta: {
    text: 'text-magenta-6',
    bg: 'bg-magenta-1',
    border: 'border-magenta-3',
  },
  blue: {
    text: 'text-blue-6',
    bg: 'bg-blue-1',
    border: 'border-blue-3',
  },
  cyan: {
    text: 'text-cyan-6',
    bg: 'bg-cyan-1',
    border: 'border-cyan-3',
  },
  'geek-blue': {
    text: 'text-geekblue-6',
    bg: 'bg-geekblue-1',
    border: 'border-geekblue-3',
  },
  gold: {
    text: 'text-gold-6',
    bg: 'bg-gold-1',
    border: 'border-gold-3',
  },
  green: {
    text: 'text-green-6',
    bg: 'bg-green-1',
    border: 'border-green-3',
  },
  lime: {
    text: 'text-lime-6',
    bg: 'bg-lime-1',
    border: 'border-lime-3',
  },
  purple: {
    text: 'text-purple-6',
    bg: 'bg-purple-1',
    border: 'border-purple-3',
  },
  red: {
    text: 'text-red-6',
    bg: 'bg-red-1',
    border: 'border-red-3',
  },
  volcano: {
    text: 'text-volcano-6',
    bg: 'bg-volcano-1',
    border: 'border-volcano-3',
  },
  primary: {
    text: 'text-primary',
    bg: 'bg-text-light-solid',
    border: 'border-primary',
  },
};

const borderStyleClasses: Record<TagBorderStyle, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
  double: 'border-double',
  groove: 'border-groove',
  ridge: 'border-ridge',
  inset: 'border-inset',
  outset: 'border-outset',
  none: 'border-none',
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function isIconName(value: string): value is IconName {
  return (iconNames as readonly string[]).includes(value);
}

function resolveIconConfig(
  config: TagIconConfig | undefined
): { name: IconName; onClick?: MouseEventHandler } | null {
  if (!config) {
    return null;
  }

  if (typeof config === 'string') {
    return { name: config };
  }

  if (isIconName(config.name)) {
    return { name: config.name, onClick: config.onClick };
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[Tag] Unknown icon "${config.name}".`);
  }
  return null;
}

function TagIconSlot({
  config,
}: {
  config: TagIconConfig | undefined;
}) {
  const resolved = resolveIconConfig(config);
  if (!resolved) {
    return null;
  }

  const icon = (
    <Icon
      name={resolved.name}
      size="sm"
      className="shrink-0"
      aria-hidden={resolved.onClick == null}
    />
  );

  if (resolved.onClick) {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          resolved.onClick?.(event);
        }}
        className="inline-flex shrink-0 cursor-pointer border-0 bg-transparent p-0 text-current [&_svg]:!text-current"
      >
        {icon}
      </button>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{icon}</span>;
}

function buildCustomStyle(colors?: TagColors): CSSProperties | undefined {
  if (!colors) {
    return undefined;
  }

  return {
    ...(colors.text ? { color: colors.text } : null),
    ...(colors.background ? { backgroundColor: colors.background } : null),
    ...(colors.border ? { borderColor: colors.border } : null),
  };
}

function handleTagKeyDown(
  event: KeyboardEvent<HTMLSpanElement>,
  onClick?: MouseEventHandler<HTMLSpanElement>
) {
  if (!onClick || event.defaultPrevented) {
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    type = 'default',
    border = true,
    borderStyle = 'solid',
    content,
    iconLeft,
    iconRight,
    colors,
    onClick,
    className,
    style,
    onKeyDown,
    role,
    tabIndex,
    ...rest
  },
  ref
) {
  const palette = typeColorClasses[type];
  const customStyle = buildCustomStyle(colors);
  const useCustomColors = colors != null;
  const isClickable = onClick != null;

  return (
    <span
      ref={ref}
      role={role ?? (isClickable ? 'button' : undefined)}
      tabIndex={tabIndex ?? (isClickable ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        handleTagKeyDown(event, onClick);
      }}
      className={cn(
        'box-border inline-flex max-w-full items-center gap-[2px] rounded-border-sm py-[2px] px-[8px] text-body-sm font-normal leading-none [&_svg]:!text-current',
        !useCustomColors && palette.text,
        !useCustomColors && palette.bg,
        border && 'border',
        border && borderStyleClasses[borderStyle],
        border && !useCustomColors && palette.border,
        isClickable && 'cursor-pointer',
        isClickable &&
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-control-outline focus-visible:ring-offset-2',
        className
      )}
      style={{ ...customStyle, ...style }}
      {...rest}
    >
      <TagIconSlot config={iconLeft} />
      {content != null ? (
        <span className="inline-flex min-w-0 items-center">{content}</span>
      ) : null}
      <TagIconSlot config={iconRight} />
    </span>
  );
});

export default Tag;
