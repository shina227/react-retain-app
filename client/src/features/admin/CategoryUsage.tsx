import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryAvatar } from '@/features/expenses/CategoryMarks';
import type { AdminInsights } from '@/types/api';
import { Panel } from '@/components/Panel';

const views = {
  most: { label: 'Most used', description: 'Top 5 categories by number of expenses' },
  least: { label: 'Least used', description: 'Bottom 5, including unused categories' },
};
type View = keyof typeof views;

const segment =
  'flex h-8 items-center rounded-md border border-transparent px-2.5 text-sm font-semibold text-quaternary transition outline-none hover:text-tertiary_hover focus-visible:ring-4 focus-visible:ring-brand-500/24 aria-pressed:border-primary aria-pressed:bg-primary_alt aria-pressed:text-secondary aria-pressed:shadow-xs';

// Top 5 and bottom 5 are one ranking seen from either end, so they share a card with a toggle.
// Both views scale their bars against the most-used category, so "least used" bars read as small.
export function CategoryUsage({ insights }: { insights?: AdminInsights }) {
  const [view, setView] = useState<View>('most');
  const items = view === 'most' ? insights?.top5 : insights?.bottom5;
  const max = Math.max(...(insights?.top5.map((c) => c.count) ?? []), 1);

  return (
    <Panel
      title="Category usage"
      description={views[view].description}
      actions={
        <div
          role="group"
          aria-label="Ranking"
          className="flex gap-0.5 rounded-lg border border-secondary bg-secondary_alt p-0.5"
        >
          {(Object.keys(views) as View[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={segment}
            >
              {views[key].label}
            </button>
          ))}
        </div>
      }
    >
      {!items ? (
        <div aria-busy aria-label="Loading categories" className="flex flex-col gap-5 p-4 md:p-6">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <ol className="flex flex-col gap-5 p-4 md:p-6">
          {items.map((category, i) => (
            <li key={category.id} className="flex items-center gap-3">
              <span className="w-4 text-sm font-semibold text-quaternary tabular-nums">
                {i + 1}
              </span>
              <CategoryAvatar category={category} className="size-9 text-sm" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-primary">{category.name}</span>
                  <span className="text-tertiary tabular-nums">
                    {category.count} {category.count === 1 ? 'expense' : 'expenses'}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-tertiary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(category.count / max) * 100}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
