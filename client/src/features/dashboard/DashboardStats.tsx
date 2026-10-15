import { CreditCardDown, Trophy01, Wallet02 } from '@untitledui/icons';
import { StatCard } from '@/components/StatCard';
import { formatMoney } from '@/lib/format';
import type { BudgetStatus, DashboardSummary } from '@/types/api';

// The remaining card's icon takes the budget status colour; the other two use brand accents.
const remainingColors: Record<BudgetStatus, string> = {
  within: 'var(--color-success-600)',
  approaching: 'var(--color-warning-600)',
  over: 'var(--color-error-600)',
  none: 'var(--color-gray-500)',
};

// The month's three headline numbers. Without a summary (first load) the cards show skeletons.
export function DashboardStats({ summary }: { summary?: DashboardSummary }) {
  const count = summary?.byCategory.reduce((sum, c) => sum + c.count, 0) ?? 0;
  const highest = summary?.highestExpense;

  return (
    <section aria-label="This month at a glance" className="@container">
      <div className="grid gap-4 @3xl:grid-cols-3">
        <StatCard
          icon={CreditCardDown}
          color="var(--color-brand-600)"
          label="Total spent"
          value={summary && formatMoney(summary.totalSpent)}
          caption={`${count} ${count === 1 ? 'expense' : 'expenses'}`}
        />
        <StatCard
          icon={Wallet02}
          color={remainingColors[summary?.status ?? 'none']}
          label="Remaining budget"
          value={summary && (summary.remaining === null ? '—' : formatMoney(summary.remaining))}
          caption={remainingCaption(summary)}
        />
        <StatCard
          icon={Trophy01}
          color="#7a5af8"
          label="Highest expense"
          value={summary && (highest ? formatMoney(highest.amount) : '—')}
          caption={highest ? `${highest.title} · ${highest.category.name}` : 'No expenses yet'}
        />
      </div>
    </section>
  );
}

function remainingCaption(summary?: DashboardSummary) {
  if (!summary || summary.budget === null) return 'No budget set';
  if (summary.totalSpent > summary.budget) return `Over your ${formatMoney(summary.budget)} budget`;
  return `Of your ${formatMoney(summary.budget)} budget`;
}
