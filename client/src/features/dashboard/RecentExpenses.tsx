import { ArrowRight, CreditCardDown, Plus } from '@untitledui/icons';
import { Link, useNavigate } from 'react-router';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryAvatar } from '@/features/expenses/CategoryMarks';
import { canGoBack } from '@/features/expenses/overlayNavigation';
import { formatDate, formatMoney } from '@/lib/format';
import { monthDateRange } from '@/lib/month';
import { clearFilters, setFilter } from '@/store/expenseFiltersSlice';
import { useAppDispatch } from '@/store/hooks';
import type { DashboardSummary } from '@/types/api';

// The month's five latest expenses. "View all" opens the expenses list filtered to this month.
export function RecentExpenses({ month, summary }: { month: string; summary?: DashboardSummary }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Start from clean filters, so nothing left over from earlier hides part of the month.
  const viewAll = () => {
    dispatch(clearFilters());
    dispatch(setFilter(monthDateRange(month)));
    navigate('/expenses');
  };

  return (
    <section
      aria-labelledby="recent-expenses"
      className="flex flex-col overflow-hidden rounded-xl border border-secondary bg-primary shadow-xs"
    >
      <header className="flex items-center justify-between gap-3 border-b border-secondary px-4 py-5 md:px-6">
        <h2 id="recent-expenses" className="text-lg font-semibold text-primary">
          Recent expenses
        </h2>
        {!!summary?.recent.length && (
          <Button variant="link" onClick={viewAll}>
            View all
            <ArrowRight />
          </Button>
        )}
      </header>

      {!summary ? (
        <div aria-busy aria-label="Loading recent expenses">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 md:px-6">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : !summary.recent.length ? (
        <EmptyState
          icon={CreditCardDown}
          title="No expenses this month"
          description="Expenses you add for this month will show up here."
          actions={
            <Button asChild variant="secondary">
              <Link to="/expenses/new">
                <Plus />
                Add expense
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-(--border-color-secondary)">
          {summary.recent.map((expense) => (
            <li key={expense.id}>
              <Link
                to={`/expenses/${expense.id}`}
                state={canGoBack}
                className="flex items-center gap-3 px-4 py-3 outline-none hover:bg-primary_hover focus-visible:bg-primary_hover md:px-6"
              >
                <CategoryAvatar category={expense.category} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-primary">{expense.title}</p>
                  <p className="truncate text-sm text-tertiary">
                    {expense.category.name} · {formatDate(expense.date)}
                  </p>
                </div>
                <span className="text-sm font-semibold whitespace-nowrap text-primary tabular-nums">
                  {formatMoney(expense.amount)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
