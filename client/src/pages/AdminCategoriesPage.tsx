import { AlertCircle, Edit01, Plus, Trash01 } from '@untitledui/icons';
import { useState } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminPanel } from '@/features/admin/AdminPanel';
import { useGetAdminCategoriesQuery } from '@/features/admin/adminApi';
import { CategoryDialog } from '@/features/admin/CategoryDialog';
import { DeleteCategoryDialog } from '@/features/admin/DeleteCategoryDialog';
import { CategoryAvatar } from '@/features/expenses/CategoryMarks';
import { formatDate } from '@/lib/format';
import type { AdminCategory } from '@/types/api';

const DEFAULT_LOCKED = "Uncategorized is the default category, so it can't be edited or deleted.";

export default function AdminCategoriesPage() {
  const { data: categories, error, refetch } = useGetAdminCategoriesQuery();
  // `editing` is null for "new category"; the dialog's open state is separate so it can fade out.
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);

  const openForm = (category: AdminCategory | null) => {
    setEditing(category);
    setFormOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Categories"
        description="Create, rename and remove the categories everyone uses."
        actions={
          <Button onClick={() => openForm(null)}>
            <Plus />
            New category
          </Button>
        }
      />

      {error ? (
        <EmptyState
          tone="error"
          icon={AlertCircle}
          title="Couldn't load the categories"
          description={error.message}
          actions={<Button onClick={refetch}>Try again</Button>}
        />
      ) : (
        <AdminPanel
          title="All categories"
          description="Deleting a category moves its expenses to Uncategorized."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Colour</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="hidden xl:table-cell">Created</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!categories
                ? Array.from({ length: 6 }, (_, i) => (
                    <TableRow key={i} className="hover:bg-transparent">
                      <TableCell colSpan={5}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <CategoryAvatar category={category} />
                          <span className="font-medium text-primary">{category.name}</span>
                          {category.isDefault && <Badge>Default</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className="size-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="hidden font-mono text-xs uppercase xl:inline">
                            {category.color}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-secondary tabular-nums">
                        {category.usageCount}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {formatDate(category.createdAt.slice(0, 10))}
                      </TableCell>
                      <TableCell className="py-0">
                        {/* The wrapper carries the tooltip, since disabled buttons don't show one. */}
                        <div
                          className="flex justify-end gap-0.5"
                          title={category.isDefault ? DEFAULT_LOCKED : undefined}
                        >
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete ${category.name}`}
                            disabled={category.isDefault}
                            className="text-fg-quaternary hover:text-error-primary"
                            onClick={() => setDeleting(category)}
                          >
                            <Trash01 />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${category.name}`}
                            disabled={category.isDefault}
                            className="text-fg-quaternary hover:text-fg-quaternary_hover"
                            onClick={() => openForm(category)}
                          >
                            <Edit01 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </AdminPanel>
      )}

      <CategoryDialog category={editing} open={formOpen} onOpenChange={setFormOpen} />
      <DeleteCategoryDialog category={deleting} onClose={() => setDeleting(null)} />
    </>
  );
}
