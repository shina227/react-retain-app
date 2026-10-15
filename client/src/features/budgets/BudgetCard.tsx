import { AlertCircle, Edit01, Wallet02 } from '@untitledui/icons';
import { useState } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardQuery } from '@/features/dashboard/dashboardApi';
import { formatMoney } from '@/lib/format';
import { formatMonth } from '@/lib/month';
import { BudgetProgress } from './BudgetProgress';
import { BudgetDialog } from './BudgetDialog';
import { BudgetStatusBadge } from './BudgetStatusBadge';

// The selected month's budget: spent against the limit, with a dialog to set or change it.
export function BudgetCard({ month }: { month: string }) {
  // currentData is empty while another month loads, so old numbers never show under a new label.
  const { currentData: summary, error, refetch } = useGetDashboardQuery(month);
  const [dialogOpen, setDialogOpen] = useState(false);
  const label = formatMonth(month);

  const setButton = (
    <Button onClick={() => setDialogOpen(true)}>
      <Wallet02 />
      Set budget
    </Button>
  );

  return (
    <section
      aria-labelledby="month-budget"
      className="mb-8 overflow-hidden rounded-xl border border-secondary bg-primary shadow-xs"
    >
      <header className="flex flex-wrap items-center gap-3 border-b border-secondary px-4 py-5 md:px-6">
        <h2 id="month-budget" className="text-lg font-semibold text-primary">
          {label}
        </h2>
        {summary && <BudgetStatusBadge status={summary.status} />}
        {summary?.budget != null && (
          <Button variant="secondary" className="ml-auto" onClick={() => setDialogOpen(true)}>
            <Edit01 />
            Update budget
          </Button>
        )}
      </header>

      {error ? (
        <EmptyState
          tone="error"
          icon={AlertCircle}
          title="Couldn't load this month"
          description={error.message}
          actions={<Button onClick={refetch}>Try again</Button>}
        />
      ) : !summary ? (
        <div aria-busy aria-label="Loading budget" className="flex flex-col gap-4 p-4 md:p-6">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      ) : summary.budget === null ? (
        <EmptyState
          icon={Wallet02}
          title="No budget set"
          description={`Set a limit for ${label} to see how your spending compares. You've spent ${formatMoney(summary.totalSpent)} so far.`}
          actions={setButton}
        />
      ) : (
        <BudgetProgress
          month={month}
          spent={summary.totalSpent}
          budget={summary.budget}
          status={summary.status}
        />
      )}

      <BudgetDialog
        month={month}
        amount={summary?.budget ?? null}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  );
}
