import { AlertCircle } from '@untitledui/icons';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FullPageMessage } from '@/components/feedback/FullPageMessage';
import { Button } from '@/components/ui/button';

// The router's error boundary: shown instead of a blank screen when a page throws while
// rendering (React logs the error itself). "Go home" is a full page load, so the app starts
// again from a clean state.
export default function ErrorPage() {
  return (
    <FullPageMessage>
      <title>Something went wrong · Retain</title>
      <EmptyState
        tone="error"
        icon={AlertCircle}
        title="Something went wrong"
        description="This page hit an unexpected error. Try again, or head back to your home page."
        actions={
          <>
            <Button variant="secondary" asChild>
              <a href="/">Go home</a>
            </Button>
            <Button onClick={() => window.location.reload()}>Reload page</Button>
          </>
        }
      />
    </FullPageMessage>
  );
}
