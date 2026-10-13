import type { ReactNode } from 'react';
import { FeaturedIcon, FeaturedIconRings } from '@/components/feedback/FeaturedIcon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { IconComponent } from '@/types/icon';
import { useCloseOverlay } from './overlayNavigation';

// The Untitled modal for adding and editing (viewing uses the slideout): a featured icon over
// faint concentric circles, title and supporting text, a body that scrolls on short screens,
// and equal-width actions under a divider.
// Same props as ExpensePanel (plus the icon), so either can wrap the same content.
export function ExpenseModal({
  title,
  description,
  icon,
  footer,
  children,
}: {
  title: string;
  description?: string;
  icon?: IconComponent;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const close = useCloseOverlay();

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent
        className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
        {...(!description && { 'aria-describedby': undefined })}
      >
        <DialogHeader className="relative gap-1 px-4 pt-5 pr-14 pb-5 sm:px-6 sm:pt-6">
          {icon && (
            <>
              <FeaturedIconRings className="-top-31 -left-32 sm:-top-30 sm:-left-30" />
              <FeaturedIcon icon={icon} className="relative mb-3" />
            </>
          )}
          <DialogTitle className="relative truncate">{title}</DialogTitle>
          {description && (
            <DialogDescription className="relative truncate">{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="overflow-y-auto px-4 pb-6 sm:px-6">{children}</div>
        {footer && (
          <DialogFooter className="grid grid-cols-2 gap-3 border-t border-secondary px-4 pt-4 pb-4 sm:px-6 sm:pb-6 [&>*]:w-full">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
