import tokens from '../../tokens.config';

export type LayoutTokenGroup = 'Map' | 'Alias' | 'Seed';

export type LayoutTokenKind =
  | 'size'
  | 'controlHeight'
  | 'margin'
  | 'padding'
  | 'borderRadius'
  | 'screen';

export interface LayoutTokenRow {
  variable: string;
  group: LayoutTokenGroup;
  value: string;
  aliasOf?: string;
  description: string;
  kind: LayoutTokenKind;
  cssVar: string;
  tailwindClass?: string;
}

function sizeSuffix(name: string) {
  if (name === 'size') return 'size';
  return `size-${name.replace(/^size/, '').toLowerCase()}`;
}

function controlHeightSuffix(name: string) {
  const base = name.replace(/^controlHeight/, '');
  if (!base) return 'control';
  return `control-${base.toLowerCase()}`;
}

function borderRadiusSuffix(name: string) {
  const base = name.replace(/^borderRadius/, '');
  if (!base) return 'border';
  return `border-${base.toLowerCase()}`;
}

function screenSuffix(name: string) {
  return `screen-${name.replace(/^screen/, '').toLowerCase()}`;
}

function paddingSuffix(name: string) {
  if (name === 'padding') return 'padding';
  const rest = name.slice('padding'.length);
  const kebab = rest.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  return `padding-${kebab}`;
}

function marginSuffix(name: string) {
  const base = name.replace(/^margin/, '');
  if (!base) return 'margin';
  return `margin-${base.toLowerCase()}`;
}

function row(
  kind: LayoutTokenKind,
  variable: string,
  group: LayoutTokenGroup,
  value: string,
  description: string,
  options?: { aliasOf?: string; cssVar?: string; tailwindClass?: string }
): LayoutTokenRow {
  const cssVar =
    options?.cssVar ??
    (kind === 'size'
      ? `--spacing-${sizeSuffix(variable)}`
      : kind === 'controlHeight'
        ? `--height-${controlHeightSuffix(variable)}`
        : kind === 'margin'
          ? `--spacing-${marginSuffix(variable)}`
          : kind === 'padding'
            ? `--spacing-${paddingSuffix(variable)}`
            : kind === 'borderRadius'
              ? `--radius-${borderRadiusSuffix(variable)}`
              : `--breakpoint-${screenSuffix(variable)}`);

  const tailwindClass =
    options?.tailwindClass ??
    (kind === 'size'
      ? `w-${sizeSuffix(variable)}`
      : kind === 'controlHeight'
        ? `h-${controlHeightSuffix(variable)}`
        : kind === 'margin'
          ? `m-${marginSuffix(variable)}`
          : kind === 'padding'
            ? `p-${paddingSuffix(variable)}`
            : kind === 'borderRadius'
              ? `rounded-${borderRadiusSuffix(variable)}`
              : `${screenSuffix(variable)}:`);

  return {
    variable,
    group,
    value,
    description,
    kind,
    cssVar,
    tailwindClass,
    aliasOf: options?.aliasOf,
  };
}

export const SIZE_TOKENS: LayoutTokenRow[] = [
  row('size', 'sizeXXS', 'Map', tokens.layout.size.sizeXXS, 'XXS size of an element.'),
  row('size', 'sizeXS', 'Map', tokens.layout.size.sizeXS, 'XS size of an element.'),
  row('size', 'sizeSM', 'Map', tokens.layout.size.sizeSM, 'SM size of an element.'),
  row('size', 'size', 'Map', tokens.layout.size.size, 'Default size of an element.'),
  row('size', 'sizeMS', 'Map', tokens.layout.size.sizeMS, 'MS size of an element.'),
  row('size', 'sizeMD', 'Map', tokens.layout.size.sizeMD, 'MD size of an element.'),
  row('size', 'sizeLG', 'Map', tokens.layout.size.sizeLG, 'LG size of an element.'),
  row('size', 'sizeXL', 'Map', tokens.layout.size.sizeXL, 'XL size of an element.'),
  row('size', 'sizeXXL', 'Map', tokens.layout.size.sizeXXL, 'XXL size of an element.'),
];

export const CONTROL_HEIGHT_TOKENS: LayoutTokenRow[] = [
  row(
    'controlHeight',
    'controlHeightXS',
    'Map',
    tokens.layout.controlHeight.controlHeightXS,
    'The extra small height of the component.'
  ),
  row(
    'controlHeight',
    'controlHeightSM',
    'Map',
    tokens.layout.controlHeight.controlHeightSM,
    'The small height of controls such as buttons and inputs.'
  ),
  row(
    'controlHeight',
    'controlHeight',
    'Map',
    tokens.layout.controlHeight.controlHeight,
    'The basic height of controls such as buttons and inputs.'
  ),
  row(
    'controlHeight',
    'controlHeightLG',
    'Map',
    tokens.layout.controlHeight.controlHeightLG,
    'The large height of controls such as buttons and inputs.'
  ),
];

export const MARGIN_TOKENS: LayoutTokenRow[] = [
  row('margin', 'marginXXS', 'Alias', tokens.layout.margin.marginXXS, 'Control the margin of an element, with the smallest size.', {
    aliasOf: 'sizeXXS',
  }),
  row('margin', 'marginXS', 'Alias', tokens.layout.margin.marginXS, 'Control the margin of an element, with a small size.', {
    aliasOf: 'sizeXS',
  }),
  row('margin', 'marginSM', 'Alias', tokens.layout.margin.marginSM, 'Control the margin of an element, with a medium-small size.', {
    aliasOf: 'sizeSM',
  }),
  row('margin', 'margin', 'Alias', tokens.layout.margin.margin, 'Control the margin of an element, with a medium size.', {
    aliasOf: 'size',
  }),
  row('margin', 'marginMD', 'Alias', tokens.layout.margin.marginMD, 'Control the margin of an element, with a medium-large size.', {
    aliasOf: 'sizeMD',
  }),
  row('margin', 'marginLG', 'Alias', tokens.layout.margin.marginLG, 'Control the margin of an element, with a large size.', {
    aliasOf: 'sizeLG',
  }),
  row('margin', 'marginXL', 'Alias', tokens.layout.margin.marginXL, 'Control the margin of an element, with an extra-large size.', {
    aliasOf: 'sizeXL',
  }),
  row('margin', 'marginXXL', 'Alias', tokens.layout.margin.marginXXL, 'Control the margin of an element, with the largest size.', {
    aliasOf: 'sizeXXL',
  }),
];

export const PADDING_TOKENS: LayoutTokenRow[] = [
  row('padding', 'paddingXXS', 'Alias', tokens.layout.padding.paddingXXS, 'Control the extra extra small padding of the element.', {
    aliasOf: 'sizeXXS',
  }),
  row('padding', 'paddingXS', 'Alias', tokens.layout.padding.paddingXS, 'Control the extra small padding of the element.', {
    aliasOf: 'sizeXS',
  }),
  row('padding', 'paddingSM', 'Alias', tokens.layout.padding.paddingSM, 'Control the small padding of the element.', {
    aliasOf: 'sizeSM',
  }),
  row('padding', 'padding', 'Alias', tokens.layout.padding.padding, 'Control the padding of the element.', {
    aliasOf: 'size',
  }),
  row('padding', 'paddingMD', 'Alias', tokens.layout.padding.paddingMD, 'Control the medium padding of the element.', {
    aliasOf: 'sizeMD',
  }),
  row('padding', 'paddingLG', 'Alias', tokens.layout.padding.paddingLG, 'Control the large padding of the element.', {
    aliasOf: 'sizeLG',
  }),
  row('padding', 'paddingXL', 'Alias', tokens.layout.padding.paddingXL, 'Control the extra large padding of the element.', {
    aliasOf: 'sizeXL',
  }),
  row(
    'padding',
    'paddingContentHorizontalSM',
    'Alias',
    tokens.layout.padding.paddingContentHorizontalSM,
    'Horizontal padding of content, suitable for small screen devices.',
    { aliasOf: 'size' }
  ),
  row(
    'padding',
    'paddingContentVerticalSM',
    'Alias',
    tokens.layout.padding.paddingContentVerticalSM,
    'Vertical padding of content, suitable for small screen devices.',
    { aliasOf: 'sizeXS' }
  ),
  row(
    'padding',
    'paddingContentHorizontal',
    'Alias',
    tokens.layout.padding.paddingContentHorizontal,
    'Horizontal padding of content.',
    { aliasOf: 'sizeMS' }
  ),
  row(
    'padding',
    'paddingContentVertical',
    'Alias',
    tokens.layout.padding.paddingContentVertical,
    'Vertical padding of content.',
    { aliasOf: 'sizeSM' }
  ),
  row(
    'padding',
    'paddingContentHorizontalLG',
    'Alias',
    tokens.layout.padding.paddingContentHorizontalLG,
    'Horizontal padding of content, suitable for large screen devices.',
    { aliasOf: 'sizeLG' }
  ),
  row(
    'padding',
    'paddingContentVerticalLG',
    'Alias',
    tokens.layout.padding.paddingContentVerticalLG,
    'Vertical padding of content, suitable for large screen devices.',
    { aliasOf: 'sizeMS' }
  ),
];

export const BORDER_RADIUS_TOKENS: LayoutTokenRow[] = [
  row(
    'borderRadius',
    'borderRadius',
    'Seed',
    tokens.layout.borderRadius.borderRadius,
    'Border radius of default size components.'
  ),
  row(
    'borderRadius',
    'borderRadiusLG',
    'Map',
    tokens.layout.borderRadius.borderRadiusLG,
    'Used in large border radius components, such as Card, Modal.'
  ),
  row(
    'borderRadius',
    'borderRadiusSM',
    'Map',
    tokens.layout.borderRadius.borderRadiusSM,
    'Used in small size components, such as Button, Input, Select.'
  ),
  row(
    'borderRadius',
    'borderRadiusXS',
    'Map',
    tokens.layout.borderRadius.borderRadiusXS,
    'Used in small border radius components, such as Segmented, Arrow.'
  ),
];

export const SCREEN_TOKENS: LayoutTokenRow[] = [
  row(
    'screen',
    'screenXS',
    'Alias',
    tokens.layout.screen.screenXS,
    'Control the screen width of extra small screens.'
  ),
  row(
    'screen',
    'screenSM',
    'Alias',
    tokens.layout.screen.screenSM,
    'Control the screen width of small screens.'
  ),
  row(
    'screen',
    'screenMD',
    'Alias',
    tokens.layout.screen.screenMD,
    'Control the screen width of medium screens.'
  ),
  row(
    'screen',
    'screenLG',
    'Alias',
    tokens.layout.screen.screenLG,
    'Control the screen width of large screens.'
  ),
  row(
    'screen',
    'screenXL',
    'Alias',
    tokens.layout.screen.screenXL,
    'Control the screen width of extra large screens.'
  ),
  row(
    'screen',
    'screenXXL',
    'Alias',
    tokens.layout.screen.screenXXL,
    'Control the screen width of extra extra large screens.'
  ),
];

export const ALL_LAYOUT_TOKEN_ROWS: LayoutTokenRow[] = [
  ...SIZE_TOKENS,
  ...CONTROL_HEIGHT_TOKENS,
  ...MARGIN_TOKENS,
  ...PADDING_TOKENS,
  ...BORDER_RADIUS_TOKENS,
  ...SCREEN_TOKENS,
];
