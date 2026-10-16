import { Calendar, CreditCardDown, TrendDown01, TrendUp01 } from '@untitledui/icons';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/format';
import { formatMonth } from '@/lib/month';
import type { TrendPoint } from '@/types/api';

// The selected month against the one before it. Both totals are the last two trend points,
// so this needs no request of its own. Spending more is red, spending less is green.
export function MonthComparison({ trend }: { trend?: TrendPoint[] }) {
  const current = trend?.at(-1);
  const previous = trend?.at(-2);
  const change = current && previous ? current.total - previous.total : 0;

  return (
    <section aria-label="This month vs last month" className="@container">
      <div className="grid gap-4 @3xl:grid-cols-3">
        <StatCard
          icon={CreditCardDown}
          color="var(--color-brand-600)"
          label="This month"
          value={current && formatMoney(current.total)}
          caption={current && formatMonth(current.month)}
        />
        <StatCard
          icon={Calendar}
          color="#0ba5ec"
          label="Last month"
          value={previous && formatMoney(previous.total)}
          caption={previous && formatMonth(previous.month)}
        />
        <StatCard
          icon={change > 0 ? TrendUp01 : TrendDown01}
          color={changeColor(change)}
          label="Change"
          value={previous && percentChange(change, previous.total)}
          caption={changeCaption(change)}
        />
      </div>
    </section>
  );
}

function changeColor(change: number) {
  if (change === 0) return 'var(--color-gray-500)';
  return change > 0 ? 'var(--color-error-600)' : 'var(--color-success-600)';
}

// "+12.5%", "-8%", or "—" when last month had nothing to compare against.
function percentChange(change: number, previous: number) {
  if (previous === 0) return '—';
  const percent = Math.round((change / previous) * 1000) / 10;
  return `${percent > 0 ? '+' : ''}${percent}%`;
}

function changeCaption(change: number) {
  if (change === 0) return 'Same as last month';
  return `${formatMoney(Math.abs(change))} ${change > 0 ? 'more' : 'less'} than last month`;
}
