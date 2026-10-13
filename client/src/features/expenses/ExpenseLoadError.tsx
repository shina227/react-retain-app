import { CircleAlert, SearchX } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { isApiError } from '@/lib/api';
import { ExpensePanel } from './ExpensePanel';
import { useCloseOverlay } from './overlayNavigation';

// Shown when one expense couldn't be loaded, inside whichever container the view uses
// (the detail slideout, or the edit modal).
// Another user's expense is a 404 too, so "not found" also covers links that aren't yours.
export function ExpenseLoadError({
  error,
  onRetry,
  shell: Shell = ExpensePanel,
}: {
  error: unknown;
  onRetry: () => void;
  shell?: typeof ExpensePanel;
}) {
  const close = useCloseOverlay();
  const notFound = isApiError(error) && error.status === 404;

  return (
    <Shell title={notFound ? 'Expense not found' : 'Expense'}>
      {notFound ? (
        <EmptyState
          icon={SearchX}
          title="This expense doesn't exist"
          description="It may have been deleted, or the link is wrong."
          actions={
            <Button variant="secondary" onClick={close}>
              Back to expenses
            </Button>
          }
        />
      ) : (
        <EmptyState
          tone="error"
          icon={CircleAlert}
          title="Couldn't load this expense"
          description={isApiError(error) ? error.message : 'Something went wrong. Try again.'}
          actions={<Button onClick={onRetry}>Try again</Button>}
        />
      )}
    </Shell>
  );
}
