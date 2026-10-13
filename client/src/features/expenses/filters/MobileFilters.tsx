import { FilterLines } from '@untitledui/icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { clearFilters, selectActiveFilterCount, selectFilters } from '@/store/expenseFiltersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { FilterControls } from './FilterControls';

// Small screens: a "Filters" button (badge = filters on, not counting the visible search) that
// opens the same controls, full width, in a bottom sheet. They apply as you change them;
// the footer shows how many expenses match.
export function MobileFilters({ resultCount }: { resultCount?: number }) {
  const dispatch = useAppDispatch();
  const searching = useAppSelector((state) => !!selectFilters(state).search.trim());
  const count = useAppSelector(selectActiveFilterCount) - (searching ? 1 : 0);
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm" className="shrink-0">
          <FilterLines />
          Filters
          {count > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-brand-solid text-xs font-semibold text-white tabular-nums">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90dvh] gap-0 rounded-t-2xl">
        <span aria-hidden className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-quaternary" />
        <SheetHeader className="px-4 pt-3 pb-4">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow down your expenses.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4">
          <FilterControls stacked />
        </div>
        <SheetFooter className="grid grid-cols-2 gap-3 border-t border-secondary">
          <Button
            variant="secondary"
            disabled={count === 0}
            onClick={() => dispatch(clearFilters())}
          >
            Reset
          </Button>
          <Button onClick={() => setOpen(false)}>
            {resultCount === undefined
              ? 'Done'
              : `Show ${resultCount} ${resultCount === 1 ? 'expense' : 'expenses'}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
