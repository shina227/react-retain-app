import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/types/icon';

// Untitled metric card: label with a "light" featured icon top-right, then the number.
// `color` (any CSS colour) tints only the icon: the icon itself, a soft circle and a fainter
// halo, all mixed from that one value so they sit quietly in light and dark mode.
// While `value` is undefined (first load) the number and caption are skeletons.
export function StatCard({
  icon: Icon,
  color,
  label,
  value,
  caption,
  className,
}: {
  icon: IconComponent;
  color: string;
  label: string;
  value?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-secondary bg-primary p-5 shadow-xs',
        className,
      )}
    >
      {/* The icon shares the label's row, so the number below gets the card's full width. */}
      <div className="flex items-start justify-between gap-3">
        <p className="pt-1 text-sm font-medium text-tertiary">{label}</p>
        <span
          aria-hidden
          className="m-1 grid size-9 shrink-0 place-items-center rounded-full"
          style={{
            color,
            backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
            boxShadow: `0 0 0 5px color-mix(in srgb, ${color} 6%, transparent)`,
          }}
        >
          <Icon className="size-5" />
        </span>
      </div>
      {value === undefined ? (
        <>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-20" />
        </>
      ) : (
        <>
          <p className="-mt-1 text-display-sm font-semibold text-primary tabular-nums">{value}</p>
          {caption && <p className="truncate text-sm text-tertiary">{caption}</p>}
        </>
      )}
    </div>
  );
}
