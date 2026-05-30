import {
  createContext,
  forwardRef,
  useContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import styles from './grid.module.scss';

export const GRID_COLUMNS = 24;

export type GridGutter = number | [number, number];

export type GridAlign = 'top' | 'middle' | 'bottom' | 'stretch';

export type GridJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

export type GridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type GridColSize = number;

export interface GridColSizeConfig {
  span?: GridColSize;
  offset?: GridColSize;
  order?: number;
  push?: GridColSize;
  pull?: GridColSize;
  flex?: string | number;
}

export interface GridRowProps extends HTMLAttributes<HTMLDivElement> {
  gutter?: GridGutter;
  wrap?: boolean;
  align?: GridAlign;
  justify?: GridJustify;
  children?: ReactNode;
}

export interface GridColProps extends HTMLAttributes<HTMLDivElement> {
  span?: GridColSize;
  offset?: GridColSize;
  order?: number;
  push?: GridColSize;
  pull?: GridColSize;
  flex?: string | number;
  xs?: GridColSize | GridColSizeConfig;
  sm?: GridColSize | GridColSizeConfig;
  md?: GridColSize | GridColSizeConfig;
  lg?: GridColSize | GridColSizeConfig;
  xl?: GridColSize | GridColSizeConfig;
  xxl?: GridColSize | GridColSizeConfig;
  children?: ReactNode;
}

interface GridRowContextValue {
  gutter: [number, number];
}

const GridRowContext = createContext<GridRowContextValue>({
  gutter: [0, 0],
});

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

function normalizeGutter(gutter: GridGutter = 0): [number, number] {
  if (Array.isArray(gutter)) {
    return gutter;
  }

  return [gutter, gutter];
}

const alignClasses: Record<GridAlign, string> = {
  top: 'items-start',
  middle: 'items-center',
  bottom: 'items-end',
  stretch: 'items-stretch',
};

const justifyClasses: Record<GridJustify, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  'space-around': 'justify-around',
  'space-between': 'justify-between',
  'space-evenly': 'justify-evenly',
};

function normalizeColSize(value?: GridColSize | GridColSizeConfig): GridColSizeConfig {
  if (value === undefined) {
    return {};
  }

  if (typeof value === 'number') {
    return { span: value };
  }

  return value;
}

function toFlexValue(flex: string | number): string {
  if (typeof flex === 'number') {
    return `0 0 ${(flex / GRID_COLUMNS) * 100}%`;
  }

  return flex;
}

function applyColConfig(
  target: Record<string, string | number>,
  prefix: string,
  config: GridColSizeConfig
) {
  const key = (name: string) =>
    prefix ? `--grid-col-${name}-${prefix}` : `--grid-col-${name}`;

  if (config.span !== undefined) {
    target[key('span')] = config.span;
  }

  if (config.offset !== undefined) {
    target[key('offset')] = config.offset;
  }

  if (config.order !== undefined) {
    target[key('order')] = config.order;
  }

  if (config.push !== undefined) {
    target[key('push')] = config.push;
  }

  if (config.pull !== undefined) {
    target[key('pull')] = config.pull;
  }

  if (config.flex !== undefined) {
    target[key('flex')] = toFlexValue(config.flex);
    target[key('max-width')] = '100%';
  }
}

function buildColStyle(props: GridColProps): CSSProperties {
  const style: Record<string, string | number> = {};
  const baseConfig = normalizeColSize({
    span: props.span,
    offset: props.offset,
    order: props.order,
    push: props.push,
    pull: props.pull,
    flex: props.flex,
  });

  applyColConfig(style, '', baseConfig);

  (
    [
      ['xs', props.xs],
      ['sm', props.sm],
      ['md', props.md],
      ['lg', props.lg],
      ['xl', props.xl],
      ['xxl', props.xxl],
    ] as const
  ).forEach(([prefix, value]) => {
    if (value !== undefined) {
      applyColConfig(style, prefix, normalizeColSize(value));
    }
  });

  return style as CSSProperties;
}

function hasFlexConfig(props: GridColProps) {
  const configs = [
    props.flex,
    props.xs,
    props.sm,
    props.md,
    props.lg,
    props.xl,
    props.xxl,
  ];

  return configs.some((value) => {
    if (value === undefined) {
      return false;
    }

    if (typeof value === 'number') {
      return false;
    }

    if (typeof value === 'string') {
      return true;
    }

    return value.flex !== undefined;
  });
}

export const GridRow = forwardRef<HTMLDivElement, GridRowProps>(function GridRow(
  {
    gutter = 0,
    wrap = true,
    align = 'top',
    justify = 'start',
    className,
    style,
    children,
    ...props
  },
  ref
) {
  const normalizedGutter = normalizeGutter(gutter);

  return (
    <GridRowContext.Provider value={{ gutter: normalizedGutter }}>
      <div
        ref={ref}
        className={cn(
          styles.row,
          !wrap && styles.rowNoWrap,
          alignClasses[align],
          justifyClasses[justify],
          className
        )}
        style={
          {
            ...style,
            '--grid-gutter-x': `${normalizedGutter[0]}px`,
            '--grid-gutter-y': `${normalizedGutter[1]}px`,
          } as CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </GridRowContext.Provider>
  );
});

export const GridCol = forwardRef<HTMLDivElement, GridColProps>(function GridCol(
  { className, style, children, ...props },
  ref
) {
  const { gutter } = useContext(GridRowContext);
  const colStyle = buildColStyle(props);
  const useFlexLayout = hasFlexConfig(props);

  return (
    <div
      ref={ref}
      className={cn(styles.col, useFlexLayout && styles.colFlex, className)}
      style={
        {
          ...colStyle,
          ...style,
          '--grid-gutter-x': `${gutter[0]}px`,
          '--grid-gutter-y': `${gutter[1]}px`,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
});

export type GridComponent = {
  Row: typeof GridRow;
  Col: typeof GridCol;
};

export const Grid: GridComponent = {
  Row: GridRow,
  Col: GridCol,
};

export default Grid;
