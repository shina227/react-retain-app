import type { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCloseOverlay } from './overlayNavigation';

// The Untitled slideout: header (title, supporting text, close), scrolling body and a footer
// pinned to the bottom. It's a routed panel over the expense list, full width on phones.
export function ExpensePanel({
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
    <Sheet open onOpenChange={(open) => !open && close()}>
      <SheetContent
        className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-100"
        {...(!description && { 'aria-describedby': undefined })}
      >
        <SheetHeader className="gap-1 px-4 pt-6 pr-14 pb-5 md:px-6">
          <SheetTitle className="truncate">{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-6 md:px-6">{children}</div>
        {footer && (
          <SheetFooter className="flex-row items-center gap-3 border-t border-secondary px-4 py-4 md:px-6">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
