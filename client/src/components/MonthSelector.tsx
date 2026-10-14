import { ChevronLeft, ChevronRight } from '@untitledui/icons';
import { Button } from '@/components/ui/button';
import { formatMonth, shiftMonth } from '@/lib/month';

// Untitled button group: previous, the month label, next.
export function MonthSelector({
  month,
  onChange,
}: {
  month: string;
  onChange: (month: string) => void;
}) {
  return (
    <div className="inline-flex items-center divide-x divide-primary rounded-lg bg-primary shadow-xs inset-ring inset-ring-(--border-color-primary)">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-r-none"
        aria-label="Previous month"
        onClick={() => onChange(shiftMonth(month, -1))}
      >
        <ChevronLeft />
      </Button>
      <span
        aria-live="polite"
        className="flex h-10 min-w-36 items-center justify-center px-4 text-sm font-semibold text-secondary"
      >
        {formatMonth(month)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-l-none"
        aria-label="Next month"
        onClick={() => onChange(shiftMonth(month, 1))}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
