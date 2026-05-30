function definePalette(
  steps: ReadonlyArray<readonly [light: string, dark: string]>
) {
  return Object.fromEntries(
    steps.map(([light, dark], index) => [index + 1, { light, dark }])
  ) as Record<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    { light: string; dark: string }
  >;
}

function defineThemeToken(light: string, dark: string) {
  return { light, dark } as const;
}

function mapBrandPalette(palette: ReturnType<typeof definePalette>, prefix: string) {
  return {
    [`${prefix}Bg`]: palette[1],
    [`${prefix}BgHover`]: palette[2],
    [`${prefix}Border`]: palette[3],
    [`${prefix}BorderHover`]: palette[4],
    [`${prefix}Hover`]: palette[5],
    [prefix]: palette[6],
    [`${prefix}Active`]: palette[7],
    [`${prefix}TextHover`]: palette[8],
    [`${prefix}Text`]: palette[9],
    [`${prefix}TextActive`]: palette[10],
  } as Record<string, { light: string; dark: string }>;
}

const bluePalette = definePalette([
  ['#E6F4FF', '#111A2C'],
  ['#BAE0FF', '#112545'],
  ['#91CAFF', '#15325B'],
  ['#69B1FF', '#15417E'],
  ['#4096FF', '#1554AD'],
  ['#1677FF', '#1668DC'],
  ['#0958D9', '#3C89E8'],
  ['#003EB3', '#65A9F3'],
  ['#002C8C', '#8DC5F8'],
  ['#001D66', '#B7DCFA'],
]);

const greenPalette = definePalette([
  ['#F6FFED', '#162312'],
  ['#D9F7BE', '#1D3712'],
  ['#B7EB8F', '#274916'],
  ['#95DE64', '#306317'],
  ['#73D13D', '#3C8618'],
  ['#52C41A', '#49AA19'],
  ['#389E0D', '#6ABE39'],
  ['#237804', '#8FD460'],
  ['#135200', '#B2E58B'],
  ['#092B00', '#D5F2BB'],
]);

const goldPalette = definePalette([
  ['#FFFBE6', '#2B2111'],
  ['#FFF1B8', '#443111'],
  ['#FFE58F', '#594214'],
  ['#FFD666', '#7C5914'],
  ['#FFC53D', '#AA7714'],
  ['#FAAD14', '#D89614'],
  ['#D48806', '#E8B339'],
  ['#AD6800', '#F3CC62'],
  ['#874D00', '#F8DF8B'],
  ['#613400', '#FAEDB5'],
]);

const brandPrimary = mapBrandPalette(bluePalette, 'primary');
const brandSuccess = {
  ...mapBrandPalette(greenPalette, 'success'),
  successHover: greenPalette[4],
  successBorderHover: greenPalette[4],
};
const brandWarning = {
  ...mapBrandPalette(goldPalette, 'warning'),
  warningHover: goldPalette[4],
  warningBorderHover: goldPalette[4],
};
const brandInfo = {
  ...mapBrandPalette(bluePalette, 'info'),
  infoHover: bluePalette[4],
  infoBorderHover: bluePalette[4],
};
const brandError = {
  errorBg: defineThemeToken('#FFF2F0', '#2C1618'),
  errorBgHover: defineThemeToken('#FFF1F0', '#451D1F'),
  errorBorder: defineThemeToken('#FFCCC7', '#5B2526'),
  errorBorderHover: defineThemeToken('#FFA39E', '#7E2E2F'),
  errorHover: defineThemeToken('#FF7875', '#E86E6B'),
  error: defineThemeToken('#FF4D4F', '#DC4446'),
  errorActive: defineThemeToken('#D9363E', '#AD393A'),
  errorTextHover: defineThemeToken('#FF7875', '#E86E6B'),
  errorText: defineThemeToken('#FF4D4F', '#DC4446'),
  errorTextActive: defineThemeToken('#D9363E', '#AD393A'),
};
const brandLink = {
  link: bluePalette[6],
  linkHover: bluePalette[5],
  linkActive: bluePalette[7],
};

const neutralFill = {
  fill: defineThemeToken('rgb(0 0 0 / 15%)', 'rgb(255 255 255 / 18%)'),
  fillSecondary: defineThemeToken('rgb(0 0 0 / 6%)', 'rgb(255 255 255 / 12%)'),
  fillTertiary: defineThemeToken('rgb(0 0 0 / 4%)', 'rgb(255 255 255 / 8%)'),
  fillQuaternary: defineThemeToken('rgb(0 0 0 / 2%)', 'rgb(255 255 255 / 4%)'),
} as const;

const neutralText = {
  text: defineThemeToken('rgb(0 0 0 / 88%)', 'rgb(255 255 255 / 85%)'),
  textSecondary: defineThemeToken('rgb(0 0 0 / 65%)', 'rgb(255 255 255 / 65%)'),
  textTertiary: defineThemeToken('rgb(0 0 0 / 45%)', 'rgb(255 255 255 / 45%)'),
  textQuaternary: defineThemeToken('rgb(0 0 0 / 25%)', 'rgb(255 255 255 / 25%)'),
  textLightSolid: defineThemeToken('#FFFFFF', '#FFFFFF'),
} as const;

const neutralBgBase = defineThemeToken('#FFFFFF', '#000000');

const neutralBg = {
  bgBase: neutralBgBase,
  bgContainer: defineThemeToken('#FFFFFF', '#141414'),
  bgElevated: defineThemeToken('#FFFFFF', '#1F1F1F'),
  bgLayout: defineThemeToken('#F5F5F5', '#000000'),
  bgMask: defineThemeToken('rgb(0 0 0 / 45%)', 'rgb(0 0 0 / 45%)'),
  bgSpotlight: defineThemeToken('rgb(0 0 0 / 85%)', '#424242'),
  bgContainerDisabled: neutralFill.fillTertiary,
  bgTextActive: neutralFill.fill,
  bgTextHover: neutralFill.fillSecondary,
  borderBg: defineThemeToken('#FFFFFF', '#141414'),
} as const;

const brandControl = {
  controlItemBgActive: brandPrimary.primaryBg,
  controlItemBgActiveDisabled: neutralFill.fill,
  controlItemBgActiveHover: brandPrimary.primaryBgHover,
  controlItemBgHover: neutralFill.fillTertiary,
  controlOutline: defineThemeToken('#0591FF', brandPrimary.primaryBg.dark),
  controlTmpOutline: neutralFill.fillQuaternary,
} as const;

export const tokens = {
  color: {
    blue: bluePalette,
    cyan: definePalette([
      ['#E6FFFB', '#112123'],
      ['#B5F5EC', '#113536'],
      ['#87E8DE', '#144848'],
      ['#5CDBD3', '#146262'],
      ['#36CFC9', '#138585'],
      ['#13C2C2', '#13A8A8'],
      ['#08979C', '#33BCB7'],
      ['#006D75', '#58D1C9'],
      ['#00474F', '#84E2D8'],
      ['#002329', '#B2F1E8'],
    ]),
    geekblue: definePalette([
      ['#F0F5FF', '#131629'],
      ['#D6E4FF', '#161D40'],
      ['#ADC6FF', '#1C2755'],
      ['#85A5FF', '#203175'],
      ['#597EF7', '#263EA0'],
      ['#2F54EB', '#2B4ACB'],
      ['#1D39C4', '#5273E0'],
      ['#10239E', '#7F9EF3'],
      ['#061178', '#A8C1F8'],
      ['#030852', '#D2E0FA'],
    ]),
    gold: goldPalette,
    green: greenPalette,
    lime: definePalette([
      ['#FCFFE6', '#1F2611'],
      ['#F4FFB8', '#2E3C10'],
      ['#EAFF8F', '#3E4F13'],
      ['#D3F261', '#536D13'],
      ['#BAE637', '#6F9412'],
      ['#A0D911', '#8BBB11'],
      ['#A0D911', '#A9D134'],
      ['#5B8C00', '#C9E75D'],
      ['#3F6600', '#E4F88B'],
      ['#254000', '#F0FAB5'],
    ]),
    magenta: definePalette([
      ['#FFF0F6', '#291321'],
      ['#FFD6E7', '#40162F'],
      ['#FFADD2', '#551C3B'],
      ['#FF85C0', '#75204F'],
      ['#F759AB', '#A02669'],
      ['#EB2F96', '#CB2B83'],
      ['#C41D7F', '#E0529C'],
      ['#9E1068', '#F37FB7'],
      ['#780650', '#F8A8CC'],
      ['#520339', '#FAD2E3'],
    ]),
    orange: definePalette([
      ['#FFF7E6', '#2B1D11'],
      ['#FFE7BA', '#442A11'],
      ['#FFD591', '#593815'],
      ['#FFC069', '#7C4A15'],
      ['#FFA940', '#AA6215'],
      ['#FA8C16', '#D87A16'],
      ['#D46B08', '#E89A3C'],
      ['#AD4E00', '#F3B765'],
      ['#873800', '#F8CF8D'],
      ['#612500', '#FAE3B7'],
    ]),
    purple: definePalette([
      ['#F9F0FF', '#1A1325'],
      ['#EFDBFF', '#24163A'],
      ['#D3ADF7', '#301C4D'],
      ['#B37FEB', '#3E2069'],
      ['#9254DE', '#51258F'],
      ['#722ED1', '#642AB5'],
      ['#531DAB', '#854ECA'],
      ['#391085', '#AB7AE0'],
      ['#22075E', '#CDA8F0'],
      ['#120338', '#EBD7FA'],
    ]),
    red: definePalette([
      ['#FFF1F0', '#2A1215'],
      ['#FFCCC7', '#431418'],
      ['#FFA39E', '#58181C'],
      ['#FF7875', '#791A1F'],
      ['#FF4D4F', '#A61D24'],
      ['#F5222D', '#D32029'],
      ['#CF1322', '#E84749'],
      ['#A8071A', '#F37370'],
      ['#820014', '#F89F9A'],
      ['#5C0011', '#FAC8C3'],
    ]),
    volcano: definePalette([
      ['#FFF2E8', '#2B1611'],
      ['#FFD8BF', '#441D12'],
      ['#FFBB96', '#592716'],
      ['#FF9C6E', '#7C3118'],
      ['#FF7A45', '#AA3E19'],
      ['#FA541C', '#D84A1B'],
      ['#D4380D', '#E87040'],
      ['#AD2102', '#F3956A'],
      ['#871400', '#F8B692'],
      ['#610B00', '#FAD4BC'],
    ]),
    yellow: definePalette([
      ['#FEFFE6', '#2B2611'],
      ['#FFFFB8', '#443B11'],
      ['#FFFB8F', '#595014'],
      ['#FFF566', '#7C6E14'],
      ['#FFEC3D', '#AA9514'],
      ['#FADB14', '#D8BD14'],
      ['#D4B106', '#E8D639'],
      ['#AD8B00', '#F3EA62'],
      ['#876800', '#F8F48B'],
      ['#614700', '#FAFAB5'],
    ]),
    neutral: {
      text: {
        ...neutralText,
        textHeading: neutralText.text,
        textLabel: neutralText.textSecondary,
        textDescription: neutralText.textTertiary,
        textDisabled: neutralText.textQuaternary,
        textPlaceholder: neutralText.textQuaternary,
      },
      icon: {
        icon: neutralText.textTertiary,
        iconHover: neutralText.text,
      },
      bg: neutralBg,
      border: {
        border: defineThemeToken('#D9D9D9', '#424242'),
        borderSecondary: defineThemeToken('#F0F0F0', '#303030'),
        split: defineThemeToken('rgb(0 0 0 / 6%)', 'rgb(255 255 255 / 6%)'),
      },
      fill: {
        ...neutralFill,
        fillContent: neutralFill.fillSecondary,
        fillContentHover: neutralFill.fill,
        fillAlter: neutralFill.fillQuaternary,
      },
    },
    brand: {
      primary: brandPrimary,
      success: brandSuccess,
      warning: brandWarning,
      info: brandInfo,
      error: brandError,
      link: brandLink,
      control: brandControl,
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
  },
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.625',
    },
  },
  radius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    modal: 1050,
    tooltip: 1070,
  },
} as const;

export type Tokens = typeof tokens;

export default tokens;
