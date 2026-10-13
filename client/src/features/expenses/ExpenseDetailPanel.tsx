import { Pencil, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatDateTime, formatMoney } from '@/lib/format';
import { CategoryAvatar, CategoryBadge } from './CategoryMarks';
import { paymentMethodLabels } from './constants';
import { DeleteExpenseDialog } from './DeleteExpenseDialog';
import { ExpenseLoadError } from './ExpenseLoadError';
import { ExpensePanel } from './ExpensePanel';
import { useGetExpenseQuery } from './expensesApi';
import { canGoBack, useCloseOverlay } from './overlayNavigation';

// /expenses/:id: every field of one expense, in a slideout over the list, with edit and delete.
export default function ExpenseDetailPanel() {
  const { id = '' } = useParams();
  const { data: expense, error, isLoading, refetch } = useGetExpenseQuery(id);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const close = useCloseOverlay();

  if (isLoading) {
    return (
      <ExpensePanel title="Loading expense…">
        <DetailSkeleton />
      </ExpensePanel>
    );
  }

  if (!expense) return <ExpenseLoadError error={error} onRetry={refetch} />;

  return (
    <ExpensePanel
      title={expense.title}
      description={formatDate(expense.date)}
      footer={
        <>
          <Button
            variant="secondary"
            className="ml-auto text-error-primary hover:text-error-primary"
            onClick={() => setConfirmingDelete(true)}
          >
            <Trash2 />
            Delete
          </Button>
          <Button asChild>
            <Link to={`/expenses/${expense.id}/edit`} state={canGoBack}>
              <Pencil />
              Edit
            </Link>
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-4 rounded-xl bg-secondary p-4">
        <CategoryAvatar category={expense.category} className="size-12 text-lg" />
        <div>
          <p className="text-sm font-medium text-tertiary">Amount</p>
          <p className="text-display-xs font-semibold text-primary tabular-nums">
            {formatMoney(expense.amount)}
          </p>
        </div>
      </div>

      <dl className="mt-2 divide-y divide-(--border-color-secondary)">
        <Field label="Date">{formatDate(expense.date)}</Field>
        <Field label="Category">
          <CategoryBadge category={expense.category} />
        </Field>
        <Field label="Payment method">{paymentMethodLabels[expense.paymentMethod]}</Field>
        <Field label="Notes">
          {expense.notes ? (
            <span className="whitespace-pre-line">{expense.notes}</span>
          ) : (
            <span className="text-quaternary">No notes</span>
          )}
        </Field>
        <Field label="Added">{formatDateTime(expense.createdAt)}</Field>
        {expense.updatedAt !== expense.createdAt && (
          <Field label="Last updated">{formatDateTime(expense.updatedAt)}</Field>
        )}
      </dl>

      <DeleteExpenseDialog
        expense={confirmingDelete ? expense : null}
        onClose={() => setConfirmingDelete(false)}
        onDeleted={close}
      />
    </ExpensePanel>
  );
}

// One description-list row: label on the left, value on the right, stacking on narrow panels.
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-tertiary">{label}</dt>
      <dd className="min-w-0 text-sm font-medium break-words text-primary">{children}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div aria-busy aria-label="Loading expense">
      <Skeleton className="h-20 rounded-xl" />
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex justify-between gap-4 py-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}
