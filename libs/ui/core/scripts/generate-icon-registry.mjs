/**
 * Generates icon-registry.ts from svg/{outlined,filled,twotone}/*.svg
 * Source: Ant Design Icons (same set as Ant Design System for Figma)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconDir = path.join(__dirname, '../src/lib/icon');
const svgDir = path.join(iconDir, 'svg');
const outFile = path.join(iconDir, 'icon-registry.ts');

const themes = ['outlined', 'filled', 'twotone'];

function parseSvg(content) {
  const viewBoxMatch = content.match(
    /<svg[^>]*\sviewBox=["']([^"']+)["']/i
  );
  const viewBox = viewBoxMatch?.[1] ?? '0 0 1024 1024';

  const paths = [];
  const pathRegex = /<path\b([^>]*)\/?>/gi;
  let match;

  while ((match = pathRegex.exec(content)) !== null) {
    const attrs = match[1];
    const dMatch = attrs.match(/\bd=["']([^"']+)["']/i);
    if (!dMatch) continue;

    const fillMatch = attrs.match(/\bfill=["']([^"']+)["']/i);
    const entry = { d: dMatch[1] };
    if (fillMatch && fillMatch[1] !== 'currentColor') {
      entry.fill = fillMatch[1];
    }
    paths.push(entry);
  }

  return { viewBox, paths };
}

function escapeString(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const registry = {};

for (const theme of themes) {
  const themeDir = path.join(svgDir, theme);
  const files = fs.readdirSync(themeDir).filter((f) => f.endsWith('.svg'));
  registry[theme] = {};

  for (const file of files.sort()) {
    const name = file.replace(/\.svg$/, '');
    const content = fs.readFileSync(path.join(themeDir, file), 'utf8');
    registry[theme][name] = parseSvg(content);
  }
}

const outlinedNames = Object.keys(registry.outlined).sort();
const filledNames = Object.keys(registry.filled).sort();
const twotoneNames = Object.keys(registry.twotone).sort();

function serializePaths(paths) {
  return paths
    .map((p) => {
      const fillPart = p.fill ? `, fill: '${escapeString(p.fill)}'` : '';
      return `{ d: '${escapeString(p.d)}'${fillPart} }`;
    })
    .join(',\n      ');
}

function serializeTheme(theme, icons) {
  const entries = Object.keys(icons)
    .sort()
    .map((name) => {
      const { viewBox, paths } = icons[name];
      return `    '${name}': {
      viewBox: '${viewBox}',
      paths: [
      ${serializePaths(paths)}
      ],
    }`;
    })
    .join(',\n');

  return `  ${theme}: {\n${entries}\n  }`;
}

const output = `/* eslint-disable */
/**
 * AUTO-GENERATED — do not edit manually.
 * Run: node libs/ui/core/scripts/generate-icon-registry.mjs
 * SVG source: src/lib/icon/svg/ (Ant Design Icons)
 */

export type IconTheme = 'outlined' | 'filled' | 'twotone';

export interface IconPath {
  d: string;
  fill?: string;
}

export interface IconDefinition {
  viewBox: string;
  paths: IconPath[];
}

export const iconRegistry = {
${themes.map((t) => serializeTheme(t, registry[t])).join(',\n')}
} as const satisfies Record<IconTheme, Record<string, IconDefinition>>;

export type IconName = ${outlinedNames.map((n) => `'${n}'`).join(' | ') || 'string'};

export const iconNames = ${JSON.stringify(outlinedNames)} as const;

export const iconNamesByTheme = {
  outlined: ${JSON.stringify(outlinedNames)},
  filled: ${JSON.stringify(filledNames)},
  twotone: ${JSON.stringify(twotoneNames)},
} as const;

export function getIconDefinition(
  name: string,
  theme: IconTheme = 'outlined'
): IconDefinition | undefined {
  return iconRegistry[theme][name as keyof (typeof iconRegistry)[typeof theme]];
}
`;

fs.writeFileSync(outFile, output);
console.log(
  `Generated ${outFile} (${outlinedNames.length} outlined, ${filledNames.length} filled, ${twotoneNames.length} twotone)`
);
