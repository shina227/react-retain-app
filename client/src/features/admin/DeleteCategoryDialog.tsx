import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { CategoryAvatar } from '@/features/expenses/CategoryMarks';
import { isApiError } from '@/lib/api';
import type { AdminCategory } from '@/types/api';
import { useDeleteCategoryMutation } from './adminApi';

const expenses = (n: number) => `${n} ${n === 1 ? 'expense' : 'expenses'}`;

// Confirms deleting a category. Its expenses aren't lost: the server moves them to
// "Uncategorized" in the same transaction, and the toast reports how many moved.
export function DeleteCategoryDialog({
  category,
  onClose,
}: {
  category: AdminCategory | null;
  onClose: () => void;
}) {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();
  // Keeps the last category on screen while the dialog fades out after `category` clears.
  const [shown, setShown] = useState(category);
  if (category && category !== shown) setShown(category);

  const confirm = async () => {
    if (!category) return;
    try {
      const { reassignedCount } = await deleteCategory(category.id).unwrap();
      toast.success('Category deleted', {
        description: reassignedCount
          ? `${expenses(reassignedCount)} moved to Uncategorized.`
          : category.name,
      });
      onClose();
    } catch (error) {
      toast.error("Couldn't delete the category", {
        description: isApiError(error) ? error.message : 'Something went wrong. Try again.',
      });
    }
  };

  const count = shown?.usageCount ?? 0;

  return (
    <ConfirmDialog
      open={category !== null}
      onOpenChange={(open) => !open && onClose()}
      title="Delete category?"
      description={
        count
          ? `${expenses(count)} will be moved to Uncategorized. This can't be undone.`
          : "No expenses use it, so nothing will be moved. This can't be undone."
      }
      pending={isLoading}
      onConfirm={confirm}
    >
      {shown && (
        <div className="flex items-center gap-3 rounded-xl border border-secondary bg-secondary p-3">
          <CategoryAvatar category={shown} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-primary">{shown.name}</p>
            <p className="text-sm text-tertiary">Used by {expenses(count)}</p>
          </div>
        </div>
      )}
    </ConfirmDialog>
  );
}
