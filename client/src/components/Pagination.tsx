import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronLeft,
  ChevronLeftDouble,
  ChevronRight,
  ChevronRightDouble,
} from '@untitledui/icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/types/icon';

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

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

// Untitled table footer. Left: "Page [n] of N" (type a page and press Enter) and rows per page.
// Right: first / previous, numbered pages, next / last. On mobile only the jump box and arrows show.
export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  // Hidden only when even the smallest page size fits everything (nothing to page or resize).
  if (total <= PAGE_SIZE_OPTIONS[0]) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-3 border-t border-secondary px-4 py-3 md:px-6"
    >
      <div className="flex items-center gap-3 text-sm text-secondary">
        {/* Keyed so the box resets to the current page whenever the page changes. */}
        <PageJump
          key={`${page}/${totalPages}`}
          page={page}
          totalPages={totalPages}
          onJump={onPageChange}
        />
        <span aria-hidden className="hidden h-5 w-px bg-(--border-color-secondary) md:block" />
        <div className="hidden items-center gap-2 md:flex">
          <span>Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger
              size="sm"
              aria-label="Rows per page"
              className="h-8 gap-1 py-0 pr-2 pl-2.5 text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ArrowButton
          label="First page"
          icon={ChevronLeftDouble}
          disabled={isFirst}
          onClick={() => onPageChange(1)}
        />
        <ArrowButton
          label="Previous page"
          icon={ChevronLeft}
          disabled={isFirst}
          onClick={() => onPageChange(page - 1)}
        />

        <ol className="hidden items-center gap-0.5 px-1 md:flex">
          {getPageItems(page, totalPages).map((item, index) =>
            item === 'gap' ? (
              <li
                key={`gap-${index}`}
                aria-hidden
                className="w-8 text-center text-sm text-tertiary"
              >
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
                    'size-8 rounded-md text-sm font-medium tabular-nums outline-none hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2',
                    item === page ? 'bg-active text-primary' : 'text-tertiary',
                  )}
                >
                  {item}
                </button>
              </li>
            ),
          )}
        </ol>

        <ArrowButton
          label="Next page"
          icon={ChevronRight}
          disabled={isLast}
          onClick={() => onPageChange(page + 1)}
        />
        <ArrowButton
          label="Last page"
          icon={ChevronRightDouble}
          disabled={isLast}
          onClick={() => onPageChange(totalPages)}
        />
      </div>
    </nav>
  );
}

function ArrowButton({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: IconComponent;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="secondary"
      size="icon-xs"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon />
    </Button>
  );
}

// "Page [n] of N": a one-field form. Validated by zod as you type (whole number, 1 to N);
// Enter jumps, and leaving the box without a valid page puts the current one back.
function PageJump({
  page,
  totalPages,
  onJump,
}: {
  page: number;
  totalPages: number;
  onJump: (page: number) => void;
}) {
  const schema = z.object({
    page: z
      .string()
      .trim()
      .regex(/^\d+$/, `Enter 1–${totalPages}`)
      .transform(Number)
      .pipe(z.number().min(1, `Enter 1–${totalPages}`).max(totalPages, `Enter 1–${totalPages}`)),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { page: String(page) },
  });
  const error = errors.page?.message;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => onJump(values.page))}
      className="relative flex items-center gap-2"
    >
      <label htmlFor="pagination-page">Page</label>
      <input
        id="pagination-page"
        inputMode="numeric"
        autoComplete="off"
        aria-invalid={!!error}
        aria-describedby={error ? 'pagination-page-error' : undefined}
        className="h-8 w-10 rounded-md border border-primary bg-primary text-center text-sm font-medium text-primary tabular-nums shadow-xs outline-none focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand-500/24 aria-invalid:border-error_subtle aria-invalid:focus-visible:ring-error-500/24"
        {...register('page', { onBlur: () => error && reset() })}
      />
      <span>of {totalPages}</span>
      {error && (
        <span
          id="pagination-page-error"
          role="alert"
          className="absolute top-full left-0 mt-1 text-xs whitespace-nowrap text-error-primary"
        >
          {error}
        </span>
      )}
    </form>
  );
}
