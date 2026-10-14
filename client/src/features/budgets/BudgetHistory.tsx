import { AlertCircle, ClockRewind } from '@untitledui/icons';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatMoney } from '@/lib/format';
import { formatMonth } from '@/lib/month';
import { cn } from '@/lib/utils';
import { useGetBudgetsQuery } from './budgetApi';
import { BudgetStatusBadge } from './BudgetStatusBadge';

// Budget and spent drop off on narrow screens; remaining and status carry the story.
const wideOnly = 'hidden sm:table-cell';

// Every month with a budget, newest first. Clicking a month shows it in the card above.
export function BudgetHistory({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (month: string) => void;
}) {
  const { data: budgets, error, isLoading, refetch } = useGetBudgetsQuery();

  return (
    <section
      aria-labelledby="budget-history"
      className="overflow-hidden rounded-xl border border-secondary bg-primary shadow-xs"
    >
      <header className="border-b border-secondary px-4 py-5 md:px-6">
        <h2 id="budget-history" className="text-lg font-semibold text-primary">
          History
        </h2>
        <p className="text-sm text-tertiary">How each month went against its budget.</p>
      </header>

      {error ? (
        <EmptyState
          tone="error"
          icon={AlertCircle}
          title="Couldn't load your budgets"
          description={error.message}
          actions={<Button onClick={refetch}>Try again</Button>}
        />
      ) : !isLoading && !budgets?.length ? (
        <EmptyState
          icon={ClockRewind}
          title="No history yet"
          description="Each month you set a budget for will show up here."
        />
      ) : (
        <Table aria-busy={isLoading}>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className={cn(wideOnly, 'text-right')}>Budget</TableHead>
              <TableHead className={cn(wideOnly, 'text-right')}>Spent</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }, (_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }, (_, j) => (
                      <TableCell key={j} className={j === 1 || j === 2 ? wideOnly : undefined}>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : budgets?.map((budget) => (
                  <TableRow
                    key={budget.month}
                    data-state={budget.month === selected ? 'selected' : undefined}
                  >
                    <TableCell>
                      <button
                        type="button"
                        aria-current={budget.month === selected ? 'date' : undefined}
                        onClick={() => onSelect(budget.month)}
                        className="font-medium text-primary hover:underline focus-visible:underline focus-visible:outline-none"
                      >
                        {formatMonth(budget.month)}
                      </button>
                    </TableCell>
                    <TableCell className={cn(wideOnly, 'text-right tabular-nums')}>
                      {formatMoney(budget.amount)}
                    </TableCell>
                    <TableCell className={cn(wideOnly, 'text-right tabular-nums')}>
                      {formatMoney(budget.spent)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'tabular-nums',
                        'text-right font-medium',
                        budget.remaining < 0 ? 'text-error-primary' : 'text-primary',
                      )}
                    >
                      {formatMoney(budget.remaining)}
                    </TableCell>
                    <TableCell>
                      <BudgetStatusBadge status={budget.status} />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
