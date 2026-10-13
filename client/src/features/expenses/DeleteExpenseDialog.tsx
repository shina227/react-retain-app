import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { isApiError } from '@/lib/api';
import { formatDate, formatMoney } from '@/lib/format';
import type { Expense } from '@/types/api';
import { CategoryAvatar } from './CategoryMarks';
import { useDeleteExpenseMutation } from './expensesApi';

// Confirms and deletes one expense, from a list row or the detail panel. Open while `expense`
// is set. On failure it stays open, so the user can retry or cancel.
export function DeleteExpenseDialog({
  expense,
  onClose,
  onDeleted,
}: {
  expense: Expense | null;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const [deleteExpense, { isLoading }] = useDeleteExpenseMutation();
  // Keeps the last expense on screen while the dialog fades out after `expense` clears.
  const [shown, setShown] = useState(expense);
  if (expense && expense !== shown) setShown(expense);

  const confirm = async () => {
    if (!expense) return;
    try {
      await deleteExpense(expense.id).unwrap();
      toast.success('Expense deleted', { description: expense.title });
      onClose();
      onDeleted?.();
    } catch (error) {
      toast.error("Couldn't delete the expense", {
        description: isApiError(error) ? error.message : 'Something went wrong. Try again.',
      });
    }
  };

  return (
    <ConfirmDialog
      open={expense !== null}
      onOpenChange={(open) => !open && onClose()}
      title="Delete expense?"
      description="It will be removed from your expenses and totals. This can't be undone."
      pending={isLoading}
      onConfirm={confirm}
    >
      {/* What's about to go, so there's no doubt which expense this is. */}
      {shown && (
        <div className="flex items-center gap-3 rounded-xl border border-secondary bg-secondary p-3">
          <CategoryAvatar category={shown.category} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-primary">{shown.title}</p>
            <p className="truncate text-sm text-tertiary">
              {shown.category.name} · {formatDate(shown.date)}
            </p>
          </div>
          <p className="text-sm font-semibold whitespace-nowrap text-primary tabular-nums">
            {formatMoney(shown.amount)}
          </p>
        </div>
      )}
    </ConfirmDialog>
  );
}
