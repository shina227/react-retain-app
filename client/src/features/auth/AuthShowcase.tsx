import { AlertTriangle } from '@untitledui/icons';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';

// Made-up numbers for the mock dashboard; the last bar is "today".
const week = [
  { day: 'M', height: 'h-[40%]' },
  { day: 'T', height: 'h-[65%]' },
  { day: 'W', height: 'h-[30%]' },
  { day: 'T', height: 'h-[80%]' },
  { day: 'F', height: 'h-[55%]' },
  { day: 'S', height: 'h-[95%]' },
  { day: 'S', height: 'h-[70%]' },
];

const budgets = [
  { name: 'Food & groceries', spent: 54_400, limit: 80_000, width: 'w-[68%]', bar: 'bg-brand-600' },
  { name: 'Transport', spent: 27_600, limit: 30_000, width: 'w-[92%]', bar: 'bg-warning-500' },
  { name: 'Utilities', spent: 18_000, limit: 45_000, width: 'w-[40%]', bar: 'bg-brand-600' },
];

// Brand panel beside the auth form on wide screens: tagline plus a mock of the dashboard.
// Purely decorative, so it's hidden from screen readers.
export function AuthShowcase({ className }: { className?: string }) {
  return (
    <aside
      aria-hidden
      className={cn(
        'relative flex-col justify-center gap-12 overflow-hidden rounded-3xl bg-brand-600 p-16',
        className,
      )}
    >
      <span className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.08)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_top_right,black,transparent_70%)] bg-size-[48px_48px]" />
      <span className="absolute -top-40 -right-40 size-120 rounded-full bg-brand-400/40 blur-3xl" />
      <span className="absolute -bottom-48 -left-32 size-96 rounded-full bg-brand-800/60 blur-3xl" />

      <div className="relative flex max-w-md flex-col gap-4">
        <h2 className="text-display-md font-semibold text-balance text-white">
          Every franc, accounted for.
        </h2>
        <p className="text-lg text-brand-100">
          Log expenses in seconds, set monthly budgets and see where your money really goes.
        </p>
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col gap-6 rounded-2xl bg-primary p-6 shadow-xl ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-tertiary">Spent this month</span>
              <span className="text-display-sm font-semibold text-primary">
                {formatMoney(412_300)}
              </span>
            </div>
            <span className="rounded-full border border-utility-brand-200 bg-utility-brand-50 px-2.5 py-0.5 text-sm font-medium text-utility-brand-700">
              68% of budget
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex h-24 items-end gap-2">
              {week.map(({ height }, i) => (
                <span
                  key={i}
                  className={cn(
                    'flex-1 rounded-t-md',
                    height,
                    i === week.length - 1 ? 'bg-brand-600' : 'bg-utility-brand-200',
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {week.map(({ day }, i) => (
                <span key={i} className="flex-1 text-center text-xs text-quaternary">
                  {day}
                </span>
              ))}
            </div>
          </div>

          <ul className="flex flex-col gap-4 border-t border-secondary pt-5">
            {budgets.map(({ name, spent, limit, width, bar }) => (
              <li key={name} className="flex flex-col gap-2">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="font-medium text-secondary">{name}</span>
                  <span className="text-tertiary">
                    {formatMoney(spent)} / {formatMoney(limit)}
                  </span>
                </div>
                <span className="h-2 overflow-hidden rounded-full bg-tertiary">
                  <span className={cn('block h-full rounded-full', width, bar)} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute -bottom-6 -left-8 flex items-center gap-3 rounded-xl bg-primary py-3 pr-4 pl-3 shadow-lg ring-1 ring-black/5">
          <span className="grid size-8 place-items-center rounded-full bg-utility-warning-50 text-utility-warning-700">
            <AlertTriangle className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-primary">Transport at 92%</span>
            <span className="text-xs text-tertiary">{formatMoney(2_400)} left this month</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
