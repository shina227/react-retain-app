import { Skeleton } from '@/components/ui/skeleton';

// Mirrors a list row (avatar, two lines of text, amount) so nothing jumps when data arrives.
export function ExpenseListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ul
      aria-busy
      aria-label="Loading expenses"
      className="divide-y divide-(--border-color-secondary)"
    >
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center gap-3 px-4 py-4 md:px-6">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5 max-w-60" />
            <Skeleton className="h-3.5 w-1/4 max-w-40" />
          </div>
          <Skeleton className="h-4 w-20" />
        </li>
      ))}
    </ul>
  );
}
