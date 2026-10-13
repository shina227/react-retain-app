import { AlignLeft, Calendar, Clock, Edit01, Tag01, Trash01 } from '@untitledui/icons';
import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatDateTime, formatMoney } from '@/lib/format';
import type { IconComponent } from '@/types/icon';
import { CategoryAvatar, CategoryBadge } from './CategoryMarks';
import { paymentMethodIcons, paymentMethodLabels } from './constants';
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
            <Trash01 />
            Delete
          </Button>
          <Button asChild>
            <Link to={`/expenses/${expense.id}/edit`} state={canGoBack}>
              <Edit01 />
              Edit
            </Link>
          </Button>
        </>
      }
    >
      {/* Hero: the amount on a soft wash of the category colour. */}
      <div
        className="relative overflow-hidden rounded-2xl border border-secondary p-5"
        style={{
          backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${expense.category.color} 14%, transparent), transparent 70%)`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <CategoryAvatar category={expense.category} className="size-12 text-lg" />
          <CategoryBadge category={expense.category} />
        </div>
        <p className="mt-5 text-sm font-medium text-tertiary">Amount</p>
        <p className="text-display-sm font-semibold text-primary tabular-nums">
          {formatMoney(expense.amount)}
        </p>
      </div>

      <dl className="mt-6 flex flex-col gap-5">
        <Field icon={Calendar} label="Date">
          {formatDate(expense.date)}
        </Field>
        <Field icon={Tag01} label="Category">
          {expense.category.name}
        </Field>
        <Field icon={paymentMethodIcons[expense.paymentMethod]} label="Payment method">
          {paymentMethodLabels[expense.paymentMethod]}
        </Field>
        <Field icon={AlignLeft} label="Notes">
          {expense.notes ? (
            <span className="whitespace-pre-line">{expense.notes}</span>
          ) : (
            <span className="font-normal text-quaternary">No notes</span>
          )}
        </Field>
      </dl>

      <p className="mt-6 flex items-center gap-1.5 border-t border-secondary pt-4 text-xs text-tertiary">
        <Clock className="size-3.5 shrink-0" />
        Added {formatDateTime(expense.createdAt)}
        {expense.updatedAt !== expense.createdAt &&
          ` · Updated ${formatDateTime(expense.updatedAt)}`}
      </p>

      <DeleteExpenseDialog
        expense={confirmingDelete ? expense : null}
        onClose={() => setConfirmingDelete(false)}
        onDeleted={close}
      />
    </ExpensePanel>
  );
}

// One description-list row: an icon tile, then the label with the value underneath.
function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: IconComponent;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-lg border border-secondary bg-primary text-fg-quaternary shadow-xs"
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 pt-0.5">
        <dt className="text-sm text-tertiary">{label}</dt>
        <dd className="text-sm font-medium break-words text-primary">{children}</dd>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div aria-busy aria-label="Loading expense">
      <Skeleton className="h-40 rounded-2xl" />
      <div className="mt-6 flex flex-col gap-5">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex flex-col gap-1.5 pt-0.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
