import { LineChartUp01 } from '@untitledui/icons';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipValueType,
} from 'recharts';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Panel } from '@/components/Panel';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMoney, formatMoneyCompact } from '@/lib/format';
import { formatMonth, formatMonthShort } from '@/lib/month';
import type { TrendPoint } from '@/types/api';
import { TREND_MONTHS } from './reportsApi';

const HEIGHT = 240;
const tick = { fill: 'var(--text-color-tertiary)', fontSize: 12 };

// Total spent per month, ending at the selected month, which gets the solid bar.
export function SpendingTrend({ trend, month }: { trend?: TrendPoint[]; month: string }) {
  return (
    <Panel title="Spending trend" description={`The last ${TREND_MONTHS} months`}>
      {!trend ? (
        <div aria-busy aria-label="Loading chart" className="p-4 md:p-6">
          <Skeleton className="w-full" style={{ height: HEIGHT }} />
        </div>
      ) : trend.every((point) => point.total === 0) ? (
        <EmptyState
          icon={LineChartUp01}
          title="Nothing spent yet"
          description={`There are no expenses in the ${TREND_MONTHS} months up to this one.`}
        />
      ) : (
        <div className="p-4 md:p-6">
          {/* The chart is visual only; this list gives screen readers the same numbers. */}
          <ul className="sr-only">
            {trend.map((point) => (
              <li key={point.month}>
                {formatMonth(point.month)}: {formatMoney(point.total)}
              </li>
            ))}
          </ul>
          <div aria-hidden>
            <ResponsiveContainer width="100%" height={HEIGHT}>
              <BarChart data={trend} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border-color-secondary)" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonthShort}
                  tick={tick}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={formatMoneyCompact}
                  tick={tick}
                  tickLine={false}
                  axisLine={false}
                  width={64}
                />
                <Tooltip
                  content={TrendTooltip}
                  cursor={{ fill: 'var(--background-color-secondary)' }}
                />
                <Bar
                  dataKey="total"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                  isAnimationActive={false}
                >
                  {trend.map((point) => (
                    <Cell
                      key={point.month}
                      fill={
                        point.month === month
                          ? 'var(--color-brand-600)'
                          : 'color-mix(in srgb, var(--color-brand-600) 30%, transparent)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Panel>
  );
}

function TrendTooltip({ active, payload }: TooltipContentProps<TooltipValueType, number | string>) {
  const point = payload?.[0]?.payload as TrendPoint | undefined;
  if (!active || !point) return null;

  return (
    <div className="rounded-lg bg-primary px-3 py-2 text-xs shadow-lg inset-ring inset-ring-(--border-color-secondary)">
      <p className="font-semibold text-primary">{formatMonth(point.month)}</p>
      <p className="text-tertiary tabular-nums">{formatMoney(point.total)}</p>
    </div>
  );
}
