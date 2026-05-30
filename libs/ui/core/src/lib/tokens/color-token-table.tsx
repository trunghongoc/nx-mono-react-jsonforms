import tokens from '../../tokens.config';

import { ALL_COLOR_TOKEN_ROWS, type ColorTokenRow } from './color-token-meta';

type PaletteStep = Record<
  number,
  {
    light: string;
    dark: string;
  }
>;

const TOKEN_LOOKUP = new Map(
  ALL_COLOR_TOKEN_ROWS.map((row) => [row.variable, row.value])
);

function isPaletteReference(value: string) {
  return /^[a-z]+\/\d+$/.test(value);
}

function isCssColor(value: string) {
  return value.startsWith('#') || value.startsWith('rgb');
}

function resolvePaletteReference(reference: string, theme: 'light' | 'dark') {
  const [paletteName, stepRaw] = reference.split('/');
  const step = Number(stepRaw);
  const palette = tokens.color[paletteName as keyof typeof tokens.color];

  if (!palette || typeof palette !== 'object' || !(step in palette)) {
    return null;
  }

  return (palette as PaletteStep)[step][theme];
}

function resolveTokenColor(
  value: string,
  theme: 'light' | 'dark',
  visited = new Set<string>()
): string | null {
  if (isCssColor(value)) {
    return value;
  }

  if (isPaletteReference(value)) {
    return resolvePaletteReference(value, theme);
  }

  if (visited.has(value)) {
    return null;
  }

  visited.add(value);

  const tokenValue = TOKEN_LOOKUP.get(value);
  if (!tokenValue) {
    return null;
  }

  return resolveTokenColor(tokenValue[theme], theme, visited);
}

const SWATCH_CLASS = 'size-6 shrink-0';

function ColorSwatch({
  color,
  title,
}: {
  color: string;
  title?: string;
}) {
  return (
    <div
      className={`${SWATCH_CLASS} rounded border border-border`}
      style={{ backgroundColor: color }}
      title={title ?? color}
      aria-label={title ?? color}
    />
  );
}

function ThemeSwatchPair({
  light,
  dark,
  label,
}: {
  light: string | null;
  dark: string | null;
  label?: string;
}) {
  if (!light && !dark) {
    return null;
  }

  if (light && dark && light === dark) {
    return (
      <ColorSwatch
        color={light}
        title={label ? `${label}: ${light}` : light}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 overflow-hidden rounded border border-border"
      title={label}
      aria-label={label}
    >
      {light ? (
        <div
          className={`${SWATCH_CLASS} border-r border-border`}
          style={{ backgroundColor: light }}
          title={label ? `${label} light: ${light}` : `Light: ${light}`}
          aria-label={label ? `${label} light` : 'Light theme color'}
        />
      ) : null}
      {dark ? (
        <div
          className={SWATCH_CLASS}
          style={{ backgroundColor: dark }}
          title={label ? `${label} dark: ${dark}` : `Dark: ${dark}`}
          aria-label={label ? `${label} dark` : 'Dark theme color'}
        />
      ) : null}
    </div>
  );
}

function ValueCell({
  value,
  theme,
}: {
  value: string;
  theme: 'light' | 'dark';
}) {
  const resolved = resolveTokenColor(value, theme);

  return (
    <div className="flex min-w-44 items-center gap-2">
      {resolved ? (
        <ColorSwatch
          color={resolved}
          title={`${theme} theme: ${resolved}`}
        />
      ) : (
        <div
          className={`${SWATCH_CLASS} rounded border border-dashed border-border bg-bg-layout`}
          title="Unresolved token reference"
          aria-hidden="true"
        />
      )}
      <code className="text-xs text-text-secondary">{value}</code>
    </div>
  );
}

function VariableCell({ row }: { row: ColorTokenRow }) {
  const light = resolveTokenColor(row.value.light, 'light');
  const dark = resolveTokenColor(row.value.dark, 'dark');

  return (
    <div className="flex items-center gap-2">
      <ThemeSwatchPair light={light} dark={dark} label={row.variable} />
      <code className="rounded bg-fill-tertiary px-2 py-1 text-xs text-text">
        {row.variable}
      </code>
    </div>
  );
}

function GroupBadge({ group }: { group: ColorTokenRow['group'] }) {
  const styles: Record<ColorTokenRow['group'], string> = {
    Colors: 'bg-blue-1 text-blue-9',
    Map: 'bg-green-1 text-green-9',
    Alias: 'bg-gold-1 text-gold-9',
    Seed: 'bg-purple-1 text-purple-9',
  };

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${styles[group]}`}>
      {group}
    </span>
  );
}

export function ColorTokenTable({
  title,
  rows,
}: {
  title: string;
  rows: ColorTokenRow[];
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold text-text">{title}</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-bg-layout">
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-medium text-text">Variable</th>
              <th className="px-4 py-3 font-medium text-text">Group</th>
              <th className="px-4 py-3 font-medium text-text">
                Light Theme Value
              </th>
              <th className="px-4 py-3 font-medium text-text">
                Dark Theme Value
              </th>
              <th className="px-4 py-3 font-medium text-text">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.variable}
                className="border-b border-border-secondary align-top last:border-b-0"
              >
                <td className="px-4 py-3">
                  <VariableCell row={row} />
                </td>
                <td className="px-4 py-3">
                  <GroupBadge group={row.group} />
                </td>
                <td className="px-4 py-3">
                  <ValueCell value={row.value.light} theme="light" />
                </td>
                <td className="px-4 py-3">
                  <ValueCell value={row.value.dark} theme="dark" />
                </td>
                <td className="max-w-md px-4 py-3 text-text-secondary">
                  {row.description}
                  {row.aliasOf ? (
                    <span className="mt-1 block text-xs text-text-tertiary">
                      Alias of <code>{row.aliasOf}</code>
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function BasePaletteTable({
  paletteName,
  title,
}: {
  paletteName: keyof typeof tokens.color;
  title: string;
}) {
  const palette = tokens.color[paletteName];

  if (!palette || typeof palette !== 'object' || !('1' in palette)) {
    return null;
  }

  const rows = Array.from({ length: 10 }, (_, index) => {
    const step = (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    const value = (palette as PaletteStep)[step];

    return {
      variable: `${paletteName}/${step}`,
      group: 'Colors' as const,
      value,
      description: `Base color palette step ${step}.`,
    };
  });

  return <ColorTokenTable title={title} rows={rows} />;
}

export { resolveTokenColor };
