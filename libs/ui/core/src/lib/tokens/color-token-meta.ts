export type TokenGroup = 'Colors' | 'Map' | 'Alias' | 'Seed';

export interface ThemeColorValue {
  light: string;
  dark: string;
}

export interface ColorTokenRow {
  variable: string;
  group: TokenGroup;
  value: ThemeColorValue;
  aliasOf?: string;
  description: string;
}

export interface PaletteMeta {
  name: string;
  title: string;
}

export const BASE_PALETTE_NAMES = [
  'blue',
  'cyan',
  'geekblue',
  'gold',
  'green',
  'lime',
  'magenta',
  'orange',
  'purple',
  'red',
  'volcano',
  'yellow',
] as const;

export const BASE_PALETTE_TITLES: Record<(typeof BASE_PALETTE_NAMES)[number], string> = {
  blue: 'Blue',
  cyan: 'Cyan',
  geekblue: 'Geek Blue',
  gold: 'Gold',
  green: 'Green',
  lime: 'Lime',
  magenta: 'Magenta',
  orange: 'Orange',
  purple: 'Purple',
  red: 'Red',
  volcano: 'Volcano',
  yellow: 'Yellow',
};

export const NEUTRAL_TEXT_TOKENS: ColorTokenRow[] = [
  {
    variable: 'colorText',
    group: 'Map',
    value: { light: 'rgb(0 0 0 / 88%)', dark: 'rgb(255 255 255 / 85%)' },
    description:
      'Default text color which complies with W3C standards, and the darkest neutral color.',
  },
  {
    variable: 'colorTextSecondary',
    group: 'Map',
    value: { light: 'rgb(0 0 0 / 65%)', dark: 'rgb(255 255 255 / 65%)' },
    description:
      'Used for non-emphasized text, such as labels and menu selection states.',
  },
  {
    variable: 'colorTextTertiary',
    group: 'Map',
    value: { light: 'rgb(0 0 0 / 45%)', dark: 'rgb(255 255 255 / 45%)' },
    description:
      'Used for descriptive text, such as form explanations or list descriptions.',
  },
  {
    variable: 'colorTextQuaternary',
    group: 'Map',
    value: { light: 'rgb(0 0 0 / 25%)', dark: 'rgb(255 255 255 / 25%)' },
    description:
      'Lightest text color, used for form input prompts, disabled text, etc.',
  },
  {
    variable: 'colorTextLightSolid',
    group: 'Map',
    value: { light: '#FFFFFF', dark: '#FFFFFF' },
    description:
      'Highlight color for text on dark backgrounds, such as text inside Primary Buttons.',
  },
  {
    variable: 'colorTextHeading',
    group: 'Alias',
    value: { light: 'colorText', dark: 'colorText' },
    aliasOf: 'colorText',
    description: 'Controls the font color of headings.',
  },
  {
    variable: 'colorTextLabel',
    group: 'Alias',
    value: { light: 'colorTextSecondary', dark: 'colorTextSecondary' },
    aliasOf: 'colorTextSecondary',
    description: 'Controls the font color of text labels.',
  },
  {
    variable: 'colorTextDescription',
    group: 'Alias',
    value: { light: 'colorTextTertiary', dark: 'colorTextTertiary' },
    aliasOf: 'colorTextTertiary',
    description: 'Controls the font color of text descriptions.',
  },
  {
    variable: 'colorTextDisabled',
    group: 'Alias',
    value: { light: 'colorTextQuaternary', dark: 'colorTextQuaternary' },
    aliasOf: 'colorTextQuaternary',
    description: 'Controls the color of text in a disabled state.',
  },
  {
    variable: 'colorTextPlaceholder',
    group: 'Alias',
    value: { light: 'colorTextQuaternary', dark: 'colorTextQuaternary' },
    aliasOf: 'colorTextQuaternary',
    description: 'Controls the color of placeholder text.',
  },
];

export const NEUTRAL_ICON_TOKENS: ColorTokenRow[] = [
  {
    variable: 'colorIcon',
    group: 'Alias',
    value: { light: 'colorTextTertiary', dark: 'colorTextTertiary' },
    aliasOf: 'colorTextTertiary',
    description: 'Control the color of the icons.',
  },
  {
    variable: 'colorIconHover',
    group: 'Alias',
    value: { light: 'colorText', dark: 'colorText' },
    aliasOf: 'colorText',
    description: 'Control the color of the icons when hovering.',
  },
];

export const NEUTRAL_BG_TOKENS: ColorTokenRow[] = [
  {
    variable: 'colorBgBase',
    group: 'Map',
    value: { light: '#FFFFFF', dark: '#000000' },
    description: 'Base background color referenced by container tokens.',
  },
  {
    variable: 'colorBgContainer',
    group: 'Map',
    value: { light: 'colorBgBase', dark: '#141414' },
    aliasOf: 'colorBgBase',
    description:
      'Container background color, e.g. Section, Default Button, Input, etc.',
  },
  {
    variable: 'colorBgElevated',
    group: 'Map',
    value: { light: 'colorBgBase', dark: '#1F1F1F' },
    aliasOf: 'colorBgBase',
    description:
      'Container background color of the popup layer, e.g. Modal, Popup, Menu, etc.',
  },
  {
    variable: 'colorBgLayout',
    group: 'Map',
    value: { light: '#F5F5F5', dark: 'colorBgBase' },
    aliasOf: 'colorBgBase',
    description:
      'Low level background color of the overall layout of the page.',
  },
  {
    variable: 'colorBgMask',
    group: 'Map',
    value: { light: 'rgb(0 0 0 / 45%)', dark: 'rgb(0 0 0 / 45%)' },
    description:
      'Used to cover the content below the mask in Modal and Drawer components.',
  },
  {
    variable: 'colorBgSpotlight',
    group: 'Map',
    value: { light: 'rgb(0 0 0 / 85%)', dark: '#424242' },
    description:
      'Draws strong attention to the background color, currently used in Tooltip.',
  },
  {
    variable: 'colorBgContainerDisabled',
    group: 'Alias',
    value: { light: 'colorFillTertiary', dark: 'colorFillTertiary' },
    aliasOf: 'colorFillTertiary',
    description: 'Control the background color of container in disabled state.',
  },
  {
    variable: 'colorBgTextActive',
    group: 'Alias',
    value: { light: 'colorFill', dark: 'colorFill' },
    aliasOf: 'colorFill',
    description: 'Control the background color of text in active state.',
  },
  {
    variable: 'colorBgTextHover',
    group: 'Alias',
    value: { light: 'colorFillSecondary', dark: 'colorFillSecondary' },
    aliasOf: 'colorFillSecondary',
    description: 'Control the background color of text in hover state.',
  },
  {
    variable: 'colorBorderBg',
    group: 'Alias',
    value: { light: 'colorBgContainer', dark: 'colorBgContainer' },
    aliasOf: 'colorBgContainer',
    description: 'Control the color of background border of element.',
  },
];

export const NEUTRAL_BORDER_TOKENS: ColorTokenRow[] = [
  {
    variable: 'colorBorder',
    group: 'Map',
    value: { light: '#D9D9D9', dark: '#424242' },
    description:
      'Default border color, used to separate different elements such as form or card separators.',
  },
  {
    variable: 'colorBorderSecondary',
    group: 'Map',
    value: { light: '#F0F0F0', dark: '#303030' },
    description:
      'Slightly lighter than the default border color; same as colorSplit but solid.',
  },
  {
    variable: 'colorSplit',
    group: 'Alias',
    value: { light: 'rgb(0 0 0 / 6%)', dark: 'rgb(255 255 255 / 6%)' },
    description:
      'Used as the color of separator; same as colorBorderSecondary but with transparency.',
  },
];

export const NEUTRAL_FILL_TOKENS: ColorTokenRow[] = [
  {
    variable: 'colorFill',
    group: 'Map',
    value: { light: 'rgb(0 0 0 / 15%)', dark: 'rgb(255 255 255 / 18%)' },
    description: 'Control the alternative background color of element.',
  },
  {
    variable: 'colorFillSecondary',
    group: 'Map',
    value: { light: 'rgb(0 0 0 / 6%)', dark: 'rgb(255 255 255 / 12%)' },
    description:
      'Second level fill color; can outline shapes more clearly, e.g. Rate, Skeleton, Table hover.',
  },
  {
    variable: 'colorFillTertiary',
    group: 'Map',
    value: { light: 'rgb(0 0 0 / 4%)', dark: 'rgb(255 255 255 / 8%)' },
    description:
      'Third level fill color for elements like Slider, Segmented; recommended default fill.',
  },
  {
    variable: 'colorFillQuaternary',
    group: 'Map',
    value: { light: 'rgb(0 0 0 / 2%)', dark: 'rgb(255 255 255 / 4%)' },
    description:
      'Weakest fill color for unobtrusive blocks such as zebra stripes or boundary blocks.',
  },
  {
    variable: 'colorFillContent',
    group: 'Alias',
    value: { light: 'colorFillSecondary', dark: 'colorFillSecondary' },
    aliasOf: 'colorFillSecondary',
    description: 'Control the background color of content area.',
  },
  {
    variable: 'colorFillContentHover',
    group: 'Alias',
    value: { light: 'colorFill', dark: 'colorFill' },
    aliasOf: 'colorFill',
    description:
      'Control the background color of content area when mouse hovers over it.',
  },
  {
    variable: 'colorFillAlter',
    group: 'Alias',
    value: { light: 'colorFillQuaternary', dark: 'colorFillQuaternary' },
    aliasOf: 'colorFillQuaternary',
    description: 'Control the alternative background color of element.',
  },
];

function brandTokens(
  prefix: string,
  paletteName: string,
  seedDescription: string,
  mapDescriptions: Partial<Record<string, string>> = {}
): ColorTokenRow[] {
  const defaults: Record<string, { step: number; description: string; group: TokenGroup }> = {
    [`${prefix}Bg`]: {
      step: 1,
      group: 'Map',
      description: mapDescriptions.bg ?? `Light background color of ${prefix} color.`,
    },
    [`${prefix}BgHover`]: {
      step: 2,
      group: 'Map',
      description:
        mapDescriptions.bgHover ??
        `Hover state of the light background color of ${prefix} color.`,
    },
    [`${prefix}Border`]: {
      step: 3,
      group: 'Map',
      description:
        mapDescriptions.border ??
        `Border color under the ${prefix} gradient, e.g. Slider stroke.`,
    },
    [`${prefix}BorderHover`]: {
      step: 4,
      group: 'Map',
      description:
        mapDescriptions.borderHover ??
        `Hover state of the border color under the ${prefix} gradient.`,
    },
    [`${prefix}Hover`]: {
      step: 4,
      group: 'Map',
      description:
        mapDescriptions.hover ?? `Hover state under the ${prefix} color gradient.`,
    },
    [prefix]: {
      step: 6,
      group: 'Seed',
      description: seedDescription,
    },
    [`${prefix}Active`]: {
      step: 7,
      group: 'Map',
      description:
        mapDescriptions.active ?? `Active state under the ${prefix} color gradient.`,
    },
    [`${prefix}TextHover`]: {
      step: 8,
      group: 'Map',
      description:
        mapDescriptions.textHover ?? `Hover state of text color under the ${prefix} gradient.`,
    },
    [`${prefix}Text`]: {
      step: 9,
      group: 'Map',
      description:
        mapDescriptions.text ?? `Text color under the ${prefix} color gradient.`,
    },
    [`${prefix}TextActive`]: {
      step: 10,
      group: 'Map',
      description:
        mapDescriptions.textActive ??
        `Active state of text color under the ${prefix} gradient.`,
    },
  };

  return Object.entries(defaults).map(([variable, meta]) => ({
    variable,
    group: meta.group,
    value: {
      light: `${paletteName}/${meta.step}`,
      dark: `${paletteName}/${meta.step}`,
    },
    description: meta.description,
  }));
}

export const BRAND_PRIMARY_TOKENS = brandTokens(
  'colorPrimary',
  'blue',
  'Brand color is one of the most direct visual elements to reflect product characteristics. Selected brand color generates a complete palette with effective design semantics.',
  {
    bg: 'Light background color of primary color, usually used for weak visual level selection state.',
    bgHover:
      'The hover state color corresponding to the light background color of the primary color.',
    border:
      'The stroke color under the main color gradient, used on the stroke of components such as Slider.',
    borderHover:
      'The hover state of the stroke color under the main color gradient, used when Slider or Button stroke hovers.',
    hover: 'Hover state under the main color gradient.',
    active: 'Dark active state under the main color gradient.',
    textHover: 'Hover state of text color under the main color gradient.',
    text: 'Text color under the main color gradient.',
    textActive: 'Active state of text color under the main color gradient.',
  }
);

export const BRAND_SUCCESS_TOKENS = brandTokens(
  'colorSuccess',
  'green',
  'Used to represent operation success; Result, Progress and other components use these map tokens.',
  {
    bg: 'Light background color of success color, used for Tag and Alert success state background.',
    bgHover:
      'Light background color of success color hover state (reserved, not used currently).',
    border: 'Border color of success color, used for Tag and Alert success state border.',
    borderHover: 'Hover state color of success color border.',
    hover: 'Hover state color of dark success color.',
    active: 'Active state color of dark success color.',
    textHover: 'Hover state color of success color text.',
    text: 'Default state color of success color text.',
    textActive: 'Active state color of success color text.',
  }
);

export const BRAND_WARNING_TOKENS = brandTokens(
  'colorWarning',
  'gold',
  'The main color for warning state.',
  {
    bg: 'The background color of the warning state.',
    bgHover: 'The hover state background color of the warning state.',
    border: 'The border color of the warning state.',
    borderHover: 'The hover state border color of the warning state.',
    hover: 'The hover state of the warning color.',
    active: 'The active state of the warning color.',
    textHover: 'The hover state of the text in the warning color.',
    text: 'The default state of the text in the warning color.',
    textActive: 'The active state of the text in the warning color.',
  }
);

export const BRAND_INFO_TOKENS = brandTokens(
  'colorInfo',
  'blue',
  'Used to represent operation information; Alert, Tag, Progress and other components use these map tokens.',
  {
    bg: 'Light background color of information color.',
    bgHover: 'Hover state of light background color of information color.',
    border: 'Border color of information color.',
    borderHover: 'Hover state of border color of information color.',
    hover: 'Hover state of dark color of information color.',
    active: 'Active state of dark color of information color.',
    textHover: 'Hover state of text color of information color.',
    text: 'Default state of text color of information color.',
    textActive: 'Active state of text color of information color.',
  }
);

export const BRAND_ERROR_TOKENS: ColorTokenRow[] = [
  {
    variable: 'colorErrorBg',
    group: 'Map',
    value: { light: '#FFF2F0', dark: '#2C1618' },
    description: 'The background color of the error state.',
  },
  {
    variable: 'colorErrorBgHover',
    group: 'Map',
    value: { light: '#FFF1F0', dark: '#451D1F' },
    description: 'The hover state background color of the error state.',
  },
  {
    variable: 'colorErrorBorder',
    group: 'Map',
    value: { light: '#FFCCC7', dark: '#5B2526' },
    description: 'The border color of the error state.',
  },
  {
    variable: 'colorErrorBorderHover',
    group: 'Map',
    value: { light: '#FFA39E', dark: '#7E2E2F' },
    description: 'The hover state border color of the error state.',
  },
  {
    variable: 'colorErrorHover',
    group: 'Map',
    value: { light: '#FF7875', dark: '#E86E6B' },
    description: 'The hover state of the error color.',
  },
  {
    variable: 'colorError',
    group: 'Seed',
    value: { light: '#FF4D4F', dark: '#DC4446' },
    description: 'The main color for error state.',
  },
  {
    variable: 'colorErrorActive',
    group: 'Map',
    value: { light: '#D9363E', dark: '#AD393A' },
    description: 'The active state of the error color.',
  },
  {
    variable: 'colorErrorTextHover',
    group: 'Map',
    value: { light: '#FF7875', dark: '#E86E6B' },
    description: 'The hover state of the text in the error color.',
  },
  {
    variable: 'colorErrorText',
    group: 'Map',
    value: { light: '#FF4D4F', dark: '#DC4446' },
    description: 'The default state of the text in the error color.',
  },
  {
    variable: 'colorErrorTextActive',
    group: 'Map',
    value: { light: '#D9363E', dark: '#AD393A' },
    description: 'The active state of the text in the error color.',
  },
];

export const BRAND_LINK_TOKENS: ColorTokenRow[] = [
  {
    variable: 'colorLink',
    group: 'Seed',
    value: { light: 'blue/6', dark: 'blue/6' },
    description: 'Control the color of hyperlink.',
  },
  {
    variable: 'colorLinkHover',
    group: 'Seed',
    value: { light: 'blue/5', dark: 'blue/5' },
    description: 'Control the color of hyperlink when hovering.',
  },
  {
    variable: 'colorLinkActive',
    group: 'Seed',
    value: { light: 'blue/7', dark: 'blue/7' },
    description: 'Control the color of hyperlink when clicked.',
  },
];

export const BRAND_CONTROL_TOKENS: ColorTokenRow[] = [
  {
    variable: 'controlItemBgActive',
    group: 'Alias',
    value: { light: 'colorPrimaryBg', dark: 'colorPrimaryBg' },
    aliasOf: 'colorPrimaryBg',
    description:
      'Control the background color of control component item when active.',
  },
  {
    variable: 'controlItemBgActiveDisabled',
    group: 'Alias',
    value: { light: 'colorFill', dark: 'colorFill' },
    aliasOf: 'colorFill',
    description:
      'Control the background color of control component item when active and disabled.',
  },
  {
    variable: 'controlItemBgActiveHover',
    group: 'Alias',
    value: { light: 'colorPrimaryBgHover', dark: 'colorPrimaryBgHover' },
    aliasOf: 'colorPrimaryBgHover',
    description:
      'Control the background color of control component item when hovering and active.',
  },
  {
    variable: 'controlItemBgHover',
    group: 'Alias',
    value: { light: 'colorFillTertiary', dark: 'colorFillTertiary' },
    aliasOf: 'colorFillTertiary',
    description:
      'Control the background color of control component item when hovering.',
  },
  {
    variable: 'controlOutline',
    group: 'Alias',
    value: { light: '#0591FF', dark: 'colorPrimaryBg' },
    aliasOf: 'colorPrimaryBg',
    description: 'Control the outline color of input component.',
  },
  {
    variable: 'controlTmpOutline',
    group: 'Alias',
    value: { light: 'colorFillQuaternary', dark: 'colorFillQuaternary' },
    aliasOf: 'colorFillQuaternary',
    description: 'Control the temporary outline color of input component.',
  },
];

export const ALL_COLOR_TOKEN_ROWS: ColorTokenRow[] = [
  ...NEUTRAL_TEXT_TOKENS,
  ...NEUTRAL_ICON_TOKENS,
  ...NEUTRAL_BG_TOKENS,
  ...NEUTRAL_BORDER_TOKENS,
  ...NEUTRAL_FILL_TOKENS,
  ...BRAND_PRIMARY_TOKENS,
  ...BRAND_SUCCESS_TOKENS,
  ...BRAND_WARNING_TOKENS,
  ...BRAND_INFO_TOKENS,
  ...BRAND_ERROR_TOKENS,
  ...BRAND_LINK_TOKENS,
  ...BRAND_CONTROL_TOKENS,
];
