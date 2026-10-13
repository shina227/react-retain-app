import type { IconComponent } from '@/types/icon';
import { cn } from '@/lib/utils';

// Untitled featured icon: a bordered "modern" box by default (empty states), or a soft red
// circle for errors.
export function FeaturedIcon({
  icon: Icon,
  tone = 'default',
  className,
}: {
  icon: IconComponent;
  tone?: 'default' | 'error';
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex size-12 shrink-0 items-center justify-center',
        tone === 'error'
          ? 'rounded-full bg-error-primary text-error-primary'
          : 'rounded-[10px] bg-primary text-secondary shadow-skeuomorphic inset-ring inset-ring-(--border-color-primary)',
        className,
      )}
    >
      <Icon className="size-6" />
    </div>
  );
}

// Untitled's modal backdrop: 336px of 24px-spaced rings, fading out from the middle.
// Position it with className so its centre sits on the featured icon's centre.
export function FeaturedIconRings({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute size-84 bg-[repeating-radial-gradient(circle,transparent_0_23px,var(--border-color-secondary)_23px_24px)] mask-[radial-gradient(closest-side,black,transparent)]',
        className,
      )}
    />
  );
}
