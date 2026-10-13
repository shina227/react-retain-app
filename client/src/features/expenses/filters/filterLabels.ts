import { formatDate, formatMoney, toMinor } from '@/lib/format';

// Filter values as people read them, for the pills.

const francs = (amount: number) => formatMoney(toMinor(amount));

// "RF 1,000 – RF 5,000", "≥ RF 1,000", "≤ RF 5,000", or '' when there's no bound.
export function amountLabel(min: number | null, max: number | null) {
  if (min !== null && max !== null) return `${francs(min)} – ${francs(max)}`;
  if (min !== null) return `≥ ${francs(min)}`;
  return max !== null ? `≤ ${francs(max)}` : '';
}

// "1 Oct – 12 Oct 2026", "From 1 Oct 2026", "Until 12 Oct 2026".
export function dateRangeLabel(startDate: string, endDate: string) {
  if (startDate && endDate) return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  return startDate ? `From ${formatDate(startDate)}` : `Until ${formatDate(endDate)}`;
}
