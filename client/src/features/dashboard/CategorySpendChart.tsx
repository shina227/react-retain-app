import { Plus, PieChart03 } from '@untitledui/icons';
import { Link } from 'react-router';
import { Pie, PieChart, Tooltip, type TooltipContentProps, type TooltipValueType } from 'recharts';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMoney } from '@/lib/format';
import type { DashboardSummary } from '@/types/api';
import { toSlices, type Slice } from './slices';

// Where the month's money went: a donut with the total in the middle, and a legend that lists
// every category's amount, so nothing depends on colour alone. Shares are in the tooltip.
export function CategorySpendChart({ summary }: { summary?: DashboardSummary }) {
  return (
    <section
      aria-labelledby="category-spend"
      className="@container flex flex-col rounded-xl border border-secondary bg-primary shadow-xs"
    >
      <header className="border-b border-secondary px-4 py-5 md:px-6">
        <h2 id="category-spend" className="text-lg font-semibold text-primary">
          Spending by category
        </h2>
      </header>

      {!summary ? (
        <DonutSkeleton />
      ) : summary.totalSpent === 0 ? (
        <EmptyState
          icon={PieChart03}
          title="No spending this month"
          description="Once you add expenses, you'll see which categories they fall into."
          actions={
            <Button asChild variant="secondary">
              <Link to="/expenses/new">
                <Plus />
                Add expense
              </Link>
            </Button>
          }
        />
      ) : (
        <Donut
          slices={toSlices(
            summary.byCategory.map(({ category, total }) => ({ ...category, total })),
            summary.totalSpent,
          )}
          total={summary.totalSpent}
        />
      )}
    </section>
  );
}

export function DonutSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-busy aria-label="Loading chart" className="flex items-center gap-8 p-4 md:p-6">
      <Skeleton className="size-40 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-3">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    </div>
  );
}

export function Donut({ slices, total }: { slices: Slice[]; total: number }) {
  return (
    <div className="flex flex-col items-center gap-6 p-4 @sm:flex-row md:p-6">
      <DonutRing slices={slices} total={total} />

      <ul className="flex w-full flex-col gap-2.5">
        {slices.map((slice) => (
          <li key={slice.name} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: slice.fill }}
            />
            <span className="min-w-0 flex-1 truncate text-tertiary">{slice.name}</span>
            <span className="font-medium text-secondary tabular-nums">
              {formatMoney(slice.total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Just the ring, with the total in the middle. Hidden from screen readers, so whatever sits
// beside it (a legend or a table) must carry the names and amounts.
export function DonutRing({ slices, total }: { slices: Slice[]; total: number }) {
  return (
    <div aria-hidden className="relative size-40 shrink-0">
      <PieChart width={160} height={160}>
        <Pie
          data={slices}
          dataKey="total"
          nameKey="name"
          innerRadius={54}
          outerRadius={80}
          paddingAngle={slices.length > 1 ? 2 : 0}
          cornerRadius={4}
          stroke="none"
          startAngle={90}
          endAngle={-270}
          isAnimationActive={false}
        />
        <Tooltip content={SliceTooltip} />
      </PieChart>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-tertiary">Total</span>
        <span className="text-sm font-semibold text-primary tabular-nums">
          {formatMoney(total)}
        </span>
      </div>
    </div>
  );
}

function SliceTooltip({ active, payload }: TooltipContentProps<TooltipValueType, number | string>) {
  const slice = payload?.[0]?.payload as Slice | undefined;
  if (!active || !slice) return null;

  return (
    <div className="rounded-lg bg-primary px-3 py-2 text-xs shadow-lg inset-ring inset-ring-(--border-color-secondary)">
      <p className="font-semibold text-primary">{slice.name}</p>
      <p className="text-tertiary tabular-nums">
        {formatMoney(slice.total)} · {slice.share}%
      </p>
    </div>
  );
}
