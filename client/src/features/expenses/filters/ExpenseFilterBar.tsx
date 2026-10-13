import { FlipBackward } from '@untitledui/icons';
import { Button } from '@/components/ui/button';
import { clearFilters, selectActiveFilterCount } from '@/store/expenseFiltersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { FilterControls } from './FilterControls';
import { MobileFilters } from './MobileFilters';
import { SearchFilter } from './SearchFilter';

// The toolbar above the expense table. Desktop (lg+): one row of search, date presets, a pill
// per filter (tinted while on, so the row is its own summary), sort, then Reset.
// Smaller screens: search plus a Filters button that opens the same controls in a sheet.
export function ExpenseFilterBar({ resultCount }: { resultCount?: number }) {
  const dispatch = useAppDispatch();
  const activeCount = useAppSelector(selectActiveFilterCount);

  return (
    <div className="flex items-center gap-2 border-b border-secondary px-4 py-3 md:px-6 lg:flex-wrap">
      <SearchFilter />
      <div className="hidden lg:contents">
        <FilterControls />
        <Button
          variant="ghost"
          size="sm"
          disabled={activeCount === 0}
          onClick={() => dispatch(clearFilters())}
          className="ml-auto"
        >
          <FlipBackward />
          Reset
        </Button>
      </div>
      <div className="lg:hidden">
        <MobileFilters resultCount={resultCount} />
      </div>
    </div>
  );
}
