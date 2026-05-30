import type { LayoutTokenGroup, LayoutTokenRow } from './layout-token-meta';

function GroupBadge({ group }: { group: LayoutTokenGroup }) {
  const styles: Record<LayoutTokenGroup, string> = {
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

function LayoutTokenPreview({ row }: { row: LayoutTokenRow }) {
  switch (row.kind) {
    case 'size':
      return (
        <div className="flex h-8 min-w-32 items-center">
          <div
            className="h-2 shrink-0 rounded-border-xs bg-primary"
            style={{ width: row.value }}
            title={row.value}
          />
        </div>
      );
    case 'controlHeight':
      return (
        <div className="flex h-12 items-end">
          <div
            className="w-6 shrink-0 rounded-border-xs bg-primary"
            style={{ height: row.value }}
            title={row.value}
          />
        </div>
      );
    case 'margin':
      return (
        <div
          className="inline-flex rounded-border-xs border border-dashed border-border bg-bg-layout"
          style={{ padding: row.value }}
          title={`margin: ${row.value}`}
        >
          <div className="size-3 rounded-border-xs bg-primary" />
        </div>
      );
    case 'padding':
      return (
        <div
          className="inline-flex rounded-border-xs border border-dashed border-border bg-bg-layout"
          style={{ padding: row.value }}
          title={`padding: ${row.value}`}
        >
          <div className="size-3 rounded-border-xs bg-primary" />
        </div>
      );
    case 'borderRadius':
      return (
        <div
          className="size-8 border-2 border-primary bg-primary-bg"
          style={{ borderRadius: row.value }}
          title={row.value}
        />
      );
    case 'screen': {
      const widthPx = Number.parseInt(row.value, 10);
      const barWidth = Math.min(120, Math.max(24, widthPx / 8));

      return (
        <div className="flex min-w-40 items-center gap-2">
          <div
            className="h-2 shrink-0 rounded-full bg-primary"
            style={{ width: barWidth }}
            title={row.value}
          />
          <span className="text-xs text-text-tertiary">{row.value}</span>
        </div>
      );
    }
    default:
      return null;
  }
}

function VariableCell({ row }: { row: LayoutTokenRow }) {
  return (
    <code className="rounded bg-fill-tertiary px-2 py-1 text-xs text-text">
      {row.variable}
    </code>
  );
}

function ValueCell({ row }: { row: LayoutTokenRow }) {
  return (
    <div className="flex flex-col gap-1">
      <code className="text-xs text-text">{row.value}</code>
      <code className="text-xs text-text-tertiary">{row.cssVar}</code>
      {row.tailwindClass ? (
        <code className="text-xs text-text-tertiary">{row.tailwindClass}</code>
      ) : null}
    </div>
  );
}

export function LayoutTokenTable({
  title,
  rows,
}: {
  title: string;
  rows: LayoutTokenRow[];
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
              <th className="px-4 py-3 font-medium text-text">Value</th>
              <th className="px-4 py-3 font-medium text-text">Preview</th>
              <th className="px-4 py-3 font-medium text-text">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.variable}
                className="border-b border-border-secondary align-middle last:border-b-0"
              >
                <td className="px-4 py-3">
                  <VariableCell row={row} />
                </td>
                <td className="px-4 py-3">
                  <GroupBadge group={row.group} />
                </td>
                <td className="px-4 py-3">
                  <ValueCell row={row} />
                </td>
                <td className="px-4 py-3">
                  <LayoutTokenPreview row={row} />
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
