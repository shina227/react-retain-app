import { BarChartSquare02, CreditCardDown, Receipt } from '@untitledui/icons';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { selectActiveFilterCount, selectFilters } from '@/store/expenseFiltersSlice';
import { useAppSelector } from '@/store/hooks';
import type { ExpenseList } from '@/types/api';
import { activePreset, datePresets } from './filters/datePresets';
import { dateRangeLabel } from './filters/filterLabels';

// Untitled's indigo (our brand), sky and violet: colour without borrowing the status hues.
const accents = { indigo: 'var(--color-brand-600)', sky: '#0ba5ec', violet: '#7a5af8' };

// Totals for whatever the list is showing: every expense matching the filters, not just this
// page (the API sums them). The dashboard has the monthly picture; these follow the filters.
export function ExpenseStats({ list, isFetching }: { list?: ExpenseList; isFetching: boolean }) {
  const { startDate, endDate } = useAppSelector(selectFilters);
  const activeCount = useAppSelector(selectActiveFilterCount);

  // "All time", "This month", "1 Oct – 12 Oct 2026", plus "· filtered" when anything beyond
  // the date narrows it.
  const preset = activePreset({ startDate, endDate });
  const period =
    preset === 'custom'
      ? dateRangeLabel(startDate, endDate)
      : datePresets.find(({ id }) => id === preset)?.label;
  const otherFilters = activeCount - (startDate || endDate ? 1 : 0);
  const scope = otherFilters > 0 ? `${period} · filtered` : period;

  const total = list?.total;
  const totalAmount = list?.summary.totalAmount;
  const average = list && list.total > 0 ? Math.round(list.summary.totalAmount / list.total) : 0;

  return (
    // A container, so the grid goes by the space it actually has (window, zoom and sidebar
    // aside): three across once each card gets ~13rem, otherwise stacked.
    <section aria-label="Summary" aria-busy={isFetching} className="@container mb-6">
      <div
        className={cn(
          'grid gap-4 transition-opacity @3xl:grid-cols-3',
          isFetching && list && 'opacity-60',
        )}
      >
        <StatCard
          icon={CreditCardDown}
          color={accents.indigo}
          label="Total spent"
          value={totalAmount === undefined ? undefined : formatMoney(totalAmount)}
          caption={scope}
        />
        <StatCard
          icon={Receipt}
          color={accents.sky}
          label="Expenses"
          value={total?.toLocaleString()}
          caption={total === 1 ? 'Transaction recorded' : 'Transactions recorded'}
        />
        <StatCard
          icon={BarChartSquare02}
          color={accents.violet}
          label="Average per expense"
          value={list ? formatMoney(average) : undefined}
          caption="Total spent ÷ expenses"
        />
      </div>
    </section>
  );
}
