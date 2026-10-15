// Beyond this many categories the smallest fold into "Other", so the slices stay readable.
const MAX_SLICES = 6;
const OTHER_COLOR = 'var(--color-gray-400)';

export interface Slice {
  name: string;
  total: number;
  share: number;
  fill: string;
}

// Items must be sorted by total, largest first (the API does this). Pass Infinity as
// `maxSlices` to keep every category.
export function toSlices(
  items: { name: string; total: number; color: string }[],
  grandTotal: number,
  maxSlices = MAX_SLICES,
): Slice[] {
  const slice = (name: string, total: number, fill: string) => ({
    name,
    total,
    fill,
    share: Math.round((total / grandTotal) * 100),
  });
  const slices = items.map(({ name, total, color }) => slice(name, total, color));
  if (slices.length <= maxSlices) return slices;

  const rest = slices.slice(maxSlices - 1).reduce((sum, s) => sum + s.total, 0);
  return [...slices.slice(0, maxSlices - 1), slice('Other', rest, OTHER_COLOR)];
}
