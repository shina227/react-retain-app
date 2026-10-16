import { PieChart03 } from '@untitledui/icons';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Panel } from '@/components/Panel';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DonutRing, DonutSkeleton } from '@/features/dashboard/CategorySpendChart';
import { toSlices } from '@/features/dashboard/slices';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { DashboardSummary } from '@/types/api';

// The count matters least, so it's the column that goes on narrow screens.
const wideOnly = 'hidden sm:table-cell';

// Every category the month's money went to: the donut for the shape, the table for the numbers.
export function CategoryBreakdown({ summary }: { summary?: DashboardSummary }) {
  return (
    <Panel title="Spending by category" description="Each category's share of the month's total">
      {!summary ? (
        <DonutSkeleton rows={5} />
      ) : summary.totalSpent === 0 ? (
        <EmptyState
          icon={PieChart03}
          title="No spending this month"
          description="Pick another month, or add expenses to see where your money goes."
        />
      ) : (
        <Breakdown summary={summary} />
      )}
    </Panel>
  );
}

function Breakdown({ summary }: { summary: DashboardSummary }) {
  const slices = toSlices(
    summary.byCategory.map(({ category, total }) => ({ ...category, total })),
    summary.totalSpent,
    Infinity,
  );

  return (
    <div className="@container">
      <div className="flex flex-col items-center gap-6 py-4 md:p-6 @3xl:flex-row @3xl:items-start">
        <DonutRing slices={slices} total={summary.totalSpent} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className={cn(wideOnly, 'text-right')}>Expenses</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.byCategory.map(({ category, count, total }) => (
              <TableRow key={category.id}>
                {/* Long names wrap rather than push the share column off a phone screen. */}
                <TableCell className="whitespace-normal">
                  <span className="flex items-center gap-2 font-medium text-primary">
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </span>
                </TableCell>
                <TableCell className={cn(wideOnly, 'text-right text-tertiary tabular-nums')}>
                  {count}
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatMoney(total)}</TableCell>
                <TableCell className="text-right text-tertiary tabular-nums">
                  {Math.round((total / summary.totalSpent) * 100)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
