import { AlertCircle, CreditCardDown, Plus, SearchLg } from '@untitledui/icons';
import { useEffect } from 'react';
import { Link, Outlet } from 'react-router';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExpenseList } from '@/features/expenses/ExpenseList';
import { ExpenseFilterBar } from '@/features/expenses/filters/ExpenseFilterBar';
import { ExpenseListSkeleton } from '@/features/expenses/ExpenseListSkeleton';
import { ExpenseStats } from '@/features/expenses/ExpenseStats';
import { useGetExpensesQuery } from '@/features/expenses/expensesApi';
import { canGoBack } from '@/features/expenses/overlayNavigation';
import { cn } from '@/lib/utils';
import {
  clearFilters,
  selectActiveFilterCount,
  selectExpenseQueryArgs,
  setLimit,
  setPage,
} from '@/store/expenseFiltersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const addExpenseButton = (
  <Button asChild>
    <Link to="/expenses/new" state={canGoBack}>
      <Plus />
      Add expense
    </Link>
  </Button>
);

export default function ExpensesPage() {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectExpenseQueryArgs);
  const activeFilterCount = useAppSelector(selectActiveFilterCount);
  const { data, error, isLoading, isFetching, refetch } = useGetExpensesQuery(query);

  // Deleting the last expense on the last page leaves us past the end: step back to the new
  // last page. An effect, since dispatching to the store during render isn't allowed.
  const lastPage = data?.totalPages ?? 0;
  useEffect(() => {
    if (lastPage > 0 && query.page > lastPage) dispatch(setPage(lastPage));
  }, [dispatch, lastPage, query.page]);

  return (
    <>
      <PageHeader
        title="Expenses"
        description="Everything you've spent, in one place."
        actions={addExpenseButton}
      />

      {!error && <ExpenseStats list={data} isFetching={isFetching} />}

      <section
        aria-labelledby="all-expenses"
        className="overflow-hidden rounded-xl border border-secondary bg-primary shadow-xs"
      >
        <header className="flex items-center gap-2 border-b border-secondary px-4 py-5 md:px-6">
          <h2 id="all-expenses" className="text-lg font-semibold text-primary">
            All expenses
          </h2>
          {data && (
            <Badge variant="outline">
              {data.total} {data.total === 1 ? 'expense' : 'expenses'}
            </Badge>
          )}
        </header>

        <ExpenseFilterBar resultCount={data?.total} />

        {isLoading ? (
          <ExpenseListSkeleton />
        ) : error ? (
          <EmptyState
            tone="error"
            icon={AlertCircle}
            title="Couldn't load your expenses"
            description={'message' in error ? error.message : 'Something went wrong. Try again.'}
            actions={<Button onClick={refetch}>Try again</Button>}
          />
        ) : !data?.total && activeFilterCount > 0 ? (
          <EmptyState
            icon={SearchLg}
            title="No expenses found"
            description="Nothing matches these filters. Try widening them, or start again."
            actions={
              <Button variant="secondary" onClick={() => dispatch(clearFilters())}>
                Clear filters
              </Button>
            }
          />
        ) : !data?.total ? (
          <EmptyState
            icon={CreditCardDown}
            title="No expenses yet"
            description="Add your first expense to start seeing where your money goes."
            actions={addExpenseButton}
          />
        ) : (
          // Keeps the current page on screen, dimmed, while the next one loads.
          <div
            aria-busy={isFetching}
            className={cn('transition-opacity', isFetching && 'opacity-60')}
          >
            {/* Day groups only make sense when the list is in date order. */}
            <ExpenseList expenses={data.data} grouped={query.sortBy === 'date'} />
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={data.limit}
              onPageChange={(page) => dispatch(setPage(page))}
              onPageSizeChange={(limit) => dispatch(setLimit(limit))}
            />
          </div>
        )}
      </section>

      {/* The routed detail slideout or add/edit modal renders over the list. */}
      <Outlet />
    </>
  );
}
