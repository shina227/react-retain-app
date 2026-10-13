import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { isApiError } from '@/lib/api';
import type { Expense } from '@/types/api';
import { useDeleteExpenseMutation } from './expensesApi';

// Confirms and deletes one expense, from a list row or the detail panel. Open while `expense`
// is set. On failure it stays open, so the user can retry or cancel.
export function DeleteExpenseDialog({
  expense,
  onClose,
  onDeleted,
}: {
  expense: Pick<Expense, 'id' | 'title'> | null;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const [deleteExpense, { isLoading }] = useDeleteExpenseMutation();
  // Keeps the last expense's title on screen while the dialog fades out after `expense` clears.
  const [shown, setShown] = useState(expense);
  if (expense && expense !== shown) setShown(expense);

  const confirm = async () => {
    if (!expense) return;
    try {
      await deleteExpense(expense.id).unwrap();
      toast.success('Expense deleted');
      onClose();
      onDeleted?.();
    } catch (error) {
      toast.error(isApiError(error) ? error.message : "Couldn't delete the expense");
    }
  };

  return (
    <ConfirmDialog
      open={expense !== null}
      onOpenChange={(open) => !open && onClose()}
      title="Delete expense"
      description={<>Are you sure you want to delete “{shown?.title}”? This can't be undone.</>}
      pending={isLoading}
      onConfirm={confirm}
    />
  );
}
