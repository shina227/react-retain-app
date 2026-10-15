import { Progress } from '@/components/ui/progress';
import { formatMoney } from '@/lib/format';
import { currentMonth, daysLeftInMonth } from '@/lib/month';
import { cn } from '@/lib/utils';
import type { BudgetStatus } from '@/types/api';

const barColors: Record<BudgetStatus, string> = {
  within: 'bg-success-500',
  approaching: 'bg-warning-500',
  over: 'bg-error-solid',
  none: '',
};

// Spent of budget, a bar coloured by status, then percent used and what's left (or how far over).
// For the current month, what's left is also spread over the days remaining.
// Used by the Budgets page card and the dashboard summary, so both always read the same.
export function BudgetProgress({
  month,
  spent,
  budget,
  status,
}: {
  month: string;
  spent: number;
  budget: number;
  status: BudgetStatus;
}) {
  const percent = Math.round((spent / budget) * 1000) / 10;
  const remaining = budget - spent;
  const days = daysLeftInMonth();
  const pace =
    month === currentMonth() && remaining > 0
      ? ` · about ${formatMoney(Math.floor(remaining / days))} a day ${days === 1 ? 'for today' : `for the next ${days} days`}`
      : '';

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-display-sm font-semibold text-primary tabular-nums">
          {formatMoney(spent)}
        </span>
        <span className="text-md text-tertiary">spent of {formatMoney(budget)}</span>
      </p>
      {/* Over 100% just shows a full bar. */}
      <Progress
        value={percent}
        aria-label={`${percent}% of the budget used`}
        indicatorClassName={barColors[status]}
      />
      <div className="flex flex-wrap justify-between gap-2 text-sm font-medium tabular-nums">
        <span className="text-tertiary">{percent}% used</span>
        <span className={cn(remaining < 0 ? 'text-error-primary' : 'text-secondary')}>
          {remaining < 0
            ? `${formatMoney(-remaining)} over`
            : `${formatMoney(remaining)} left${pace}`}
        </span>
      </div>
    </div>
  );
}
