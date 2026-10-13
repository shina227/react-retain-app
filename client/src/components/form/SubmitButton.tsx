import { Loading02 } from '@untitledui/icons';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';

// Submit button that disables itself and shows a spinner while the form is pending.
export function SubmitButton({
  pending,
  children,
  ...props
}: ComponentProps<typeof Button> & { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending && <Loading02 aria-hidden className="animate-spin" />}
      {children}
    </Button>
  );
}
