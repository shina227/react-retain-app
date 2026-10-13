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
