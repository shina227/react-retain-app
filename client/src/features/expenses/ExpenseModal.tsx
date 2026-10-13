import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCloseOverlay } from './overlayNavigation';

// The Untitled modal for adding and editing (viewing uses the slideout): title and supporting
// text, a body that scrolls on short screens, and equal-width actions.
// Same props as ExpensePanel, so either can wrap the same content.
export function ExpenseModal({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const close = useCloseOverlay();

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent
        className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 p-0 sm:max-w-lg"
        {...(!description && { 'aria-describedby': undefined })}
      >
        <DialogHeader className="gap-1 px-4 pt-5 pr-14 pb-5 sm:px-6 sm:pt-6">
          <DialogTitle className="truncate">{title}</DialogTitle>
          {description && <DialogDescription className="truncate">{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto px-4 pb-2 sm:px-6">{children}</div>
        {footer && (
          <DialogFooter className="grid grid-cols-2 gap-3 px-4 pt-6 pb-4 sm:px-6 sm:pb-6 [&>*]:w-full">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
