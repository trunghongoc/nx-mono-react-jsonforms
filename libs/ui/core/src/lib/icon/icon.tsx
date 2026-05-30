import { forwardRef, type SVGAttributes } from 'react';

import {
  getIconDefinition,
  iconNames,
  iconNamesByTheme,
  type IconName,
  type IconTheme,
} from './icon-registry';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'name'> {
  name: IconName;
  theme?: IconTheme;
  size?: IconSize | number;
  spin?: boolean;
}

const sizeClasses: Record<IconSize, string> = {
  xs: 'size-[10px]',
  sm: 'size-size-sm',
  md: 'size-[14px]',
  lg: 'size-size',
  xl: 'size-size-md',
  xxl: 'size-size-lg',
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  {
    name,
    theme = 'outlined',
    size = 'md',
    spin = false,
    className,
    style,
    ...props
  },
  ref
) {
  const definition = getIconDefinition(name, theme);

  if (!definition) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[Icon] Unknown icon "${name}" (theme: ${theme}). Outlined icons: ${iconNames.length} available.`
      );
    }
    return null;
  }

  const sizeStyle =
    typeof size === 'number' ? { width: size, height: size, ...style } : style;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={definition.viewBox}
      fill="currentColor"
      className={cn(
        'inline-block shrink-0 text-icon',
        typeof size === 'string' && sizeClasses[size],
        spin && 'animate-spin',
        className
      )}
      style={sizeStyle}
      aria-hidden={props['aria-label'] == null ? true : undefined}
      {...props}
    >
      {definition.paths.map((path, index) => (
        <path
          key={index}
          d={path.d}
          fill={path.fill ?? 'currentColor'}
        />
      ))}
    </svg>
  );
});

export default Icon;

export { iconNames, iconNamesByTheme, type IconTheme };
