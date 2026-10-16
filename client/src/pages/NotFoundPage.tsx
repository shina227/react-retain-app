import { SearchRefraction } from '@untitledui/icons';
import { Link } from 'react-router';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FullPageMessage } from '@/components/feedback/FullPageMessage';
import { Button } from '@/components/ui/button';

// Any URL no route matches. "/" sends signed-in users to their home and everyone else to login.
export default function NotFoundPage() {
  return (
    <FullPageMessage>
      <title>Page not found · Retain</title>
      <EmptyState
        icon={SearchRefraction}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        actions={
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
        }
      />
    </FullPageMessage>
  );
}
