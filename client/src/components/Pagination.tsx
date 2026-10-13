import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Always 7 slots: the first and last page, the current page's neighbours, and an ellipsis only
// where it hides two or more pages. 10 pages on page 5 → 1 … 4 5 6 … 10; on page 4 → 1 2 3 4 5 … 10.
function getPageItems(page: number, totalPages: number): (number | 'gap')[] {
  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (totalPages <= 7) return range(1, totalPages);

  const start = Math.max(Math.min(page - 1, totalPages - 4), 3);
  const end = Math.min(Math.max(page + 1, 5), totalPages - 2);

  return [
    1,
    start > 3 ? 'gap' : 2,
    ...range(start, end),
    end < totalPages - 2 ? 'gap' : totalPages - 1,
    totalPages,
  ];
}

// Untitled table footer: "Page 1 of 10" with numbered pages on desktop; on mobile just the
// arrows either side of the page label.
export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-3 border-t border-secondary px-4 pt-3 pb-4 md:px-6"
    >
      <Button
        variant="secondary"
        size="icon-sm"
        aria-label="Previous page"
        disabled={isFirst}
        onClick={() => onPageChange(page - 1)}
      >
        <ArrowLeft />
      </Button>

      <p className="text-sm font-medium text-secondary md:hidden" aria-live="polite">
        Page {page} of {totalPages}
      </p>

      <ol className="hidden items-center gap-0.5 md:flex">
        {getPageItems(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} aria-hidden className="w-10 text-center text-sm text-tertiary">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
                className={cn(
                  'size-10 rounded-lg text-sm font-medium outline-none hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2',
                  item === page ? 'bg-primary_hover text-secondary' : 'text-tertiary',
                )}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ol>

      <Button
        variant="secondary"
        size="icon-sm"
        aria-label="Next page"
        disabled={isLast}
        onClick={() => onPageChange(page + 1)}
      >
        <ArrowRight />
      </Button>
    </nav>
  );
}
