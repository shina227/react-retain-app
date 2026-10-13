import { XIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { AlertDialog } from 'radix-ui';
import { SubmitButton } from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';

// The Untitled destructive modal: title, consequence, Cancel | Delete.
// An alertdialog, so focus starts on Cancel and clicking outside doesn't dismiss it.
// While the action runs it can't be closed, and the confirm button shows a spinner.
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Delete',
  pending,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  pending: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-overlay/70 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-primary p-4 shadow-xl duration-100 outline-none sm:max-w-100 sm:p-6 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <AlertDialog.Title className="pr-8 text-lg font-semibold text-primary">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-1 text-sm text-tertiary">
            {description}
          </AlertDialog.Description>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" disabled={pending}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            {/* Not AlertDialog.Action: that would close the dialog before the request finishes. */}
            <SubmitButton type="button" variant="destructive" pending={pending} onClick={onConfirm}>
              {confirmLabel}
            </SubmitButton>
          </div>

          {/* A plain button: Radix focuses the last-registered Cancel, which should be the real one. */}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            disabled={pending}
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4"
          >
            <XIcon />
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
