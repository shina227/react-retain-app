import { ArrowRight, Wallet02 } from '@untitledui/icons';
import { Link } from 'react-router';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BudgetProgress } from '@/features/budgets/BudgetProgress';
import { BudgetStatusBadge } from '@/features/budgets/BudgetStatusBadge';
import { formatMonth } from '@/lib/month';
import type { DashboardSummary } from '@/types/api';

// The month's budget at a glance, sitting beside the category chart; the full card and
// history live on /budgets.
export function BudgetSummary({ month, summary }: { month: string; summary?: DashboardSummary }) {
  const budgetsLink = `/budgets?month=${month}`;

  return (
    <section
      aria-labelledby="budget-summary"
      className="flex flex-col rounded-xl border border-secondary bg-primary shadow-xs"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary px-4 py-5 md:px-6">
        <h2 id="budget-summary" className="text-lg font-semibold text-primary">
          Monthly budget
        </h2>
        {summary && <BudgetStatusBadge status={summary.status} />}
      </header>

      {/* Centred, so when the chart beside it is taller the extra space sits evenly around this. */}
      <div className="flex flex-1 flex-col justify-center">
        {!summary ? (
          <div aria-busy aria-label="Loading budget" className="flex flex-col gap-4 p-4 md:p-6">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : summary.budget === null ? (
          <EmptyState
            icon={Wallet02}
            title="No budget set"
            description={`Set a limit for ${formatMonth(month)} to see how your spending compares.`}
            actions={
              <Button asChild>
                <Link to={budgetsLink}>
                  <Wallet02 />
                  Set a budget
                </Link>
              </Button>
            }
          />
        ) : (
          <BudgetProgress
            month={month}
            spent={summary.totalSpent}
            budget={summary.budget}
            status={summary.status}
          />
        )}
      </div>

      {summary?.budget != null && (
        <footer className="flex justify-end px-4 pb-4 md:px-6 md:pb-6">
          <Button asChild variant="secondary" size="sm">
            <Link to={budgetsLink}>
              View budgets
              <ArrowRight />
            </Link>
          </Button>
        </footer>
      )}
    </section>
  );
}
