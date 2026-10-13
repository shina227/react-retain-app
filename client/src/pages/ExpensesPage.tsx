import { AlertCircle, CreditCardDown, Plus } from '@untitledui/icons';
import { useState } from 'react';
import { Link, Outlet } from 'react-router';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { canGoBack } from '@/features/expenses/overlayNavigation';
import { PAGE_SIZE } from '@/features/expenses/constants';
import { ExpenseList } from '@/features/expenses/ExpenseList';
import { ExpenseListSkeleton } from '@/features/expenses/ExpenseListSkeleton';
import { useGetExpensesQuery } from '@/features/expenses/expensesApi';
import { cn } from '@/lib/utils';

const addExpenseButton = (
  <Button asChild>
    <Link to="/expenses/new" state={canGoBack}>
      <Plus />
      Add expense
    </Link>
  </Button>
);

export default function ExpensesPage() {
  // Moves into the Redux filters slice with the rest of the query on Tuesday.
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const { data, error, isLoading, isFetching, refetch } = useGetExpensesQuery({
    page,
    limit: pageSize,
  });

  // Deleting the last expense on the last page leaves us past the end: step back to the
  // new last page (adjusting state during render, React's pattern for derived resets).
  if (data && data.totalPages > 0 && page > data.totalPages) setPage(data.totalPages);

  return (
    <>
      <PageHeader
        title="Expenses"
        description="Everything you've spent, in one place."
        actions={addExpenseButton}
      />

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
            <ExpenseList expenses={data.data} grouped />
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={pageSize}
              onPageChange={setPage}
              // A new page size changes what "page 3" means, so start again from the top.
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
        )}
      </section>

      {/* The routed detail slideout or add/edit modal renders over the list. */}
      <Outlet />
    </>
  );
}
