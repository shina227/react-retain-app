import {
  selectFilters,
  setFilter,
  setSort,
  type ExpenseFilters,
} from '@/store/expenseFiltersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { PaymentMethod } from '@/types/api';
import { paymentMethodLabels } from '../constants';
import { useGetCategoriesQuery } from '../expensesApi';
import { AmountFilter } from './AmountFilter';
import { DateFilter } from './DateFilter';
import { FilterSelect } from './FilterSelect';

// Each sort option is a sortBy + sortOrder pair, carried as "date-desc" and so on.
const sortOptions = [
  { value: 'date-desc', label: 'Newest' },
  { value: 'date-asc', label: 'Oldest' },
  { value: 'amount-desc', label: 'Highest amount' },
  { value: 'amount-asc', label: 'Lowest amount' },
];

const paymentOptions = Object.entries(paymentMethodLabels).map(([value, label]) => ({
  value,
  label,
}));

// Date presets, a pill per filter and sort. In a row on desktop; `stacked` makes each one full
// width for the mobile sheet. Every control writes straight to the Redux filters slice.
export function FilterControls({ stacked = false }: { stacked?: boolean }) {
  const dispatch = useAppDispatch();
  const { categoryId, paymentMethod, sortBy, sortOrder } = useAppSelector(selectFilters);
  const { data: categories = [] } = useGetCategoriesQuery();
  const pill = stacked ? 'w-full' : undefined;

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: (
      <>
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        {category.name}
      </>
    ),
  }));

  return (
    <>
      <DateFilter className={stacked ? 'w-full *:flex-1 *:justify-center' : undefined} />
      <FilterSelect
        label="Category"
        allLabel="All"
        value={categoryId}
        options={categoryOptions}
        onChange={(value) => dispatch(setFilter({ categoryId: value }))}
        className={pill}
      />
      <FilterSelect
        label="Payment"
        allLabel="All"
        value={paymentMethod}
        options={paymentOptions}
        onChange={(value) => dispatch(setFilter({ paymentMethod: value as PaymentMethod | '' }))}
        className={pill}
      />
      <AmountFilter className={pill} />
      <FilterSelect
        label="Sort"
        value={`${sortBy}-${sortOrder}`}
        options={sortOptions}
        onChange={(value) => {
          const [by, order] = value.split('-') as [
            ExpenseFilters['sortBy'],
            ExpenseFilters['sortOrder'],
          ];
          dispatch(setSort({ sortBy: by, sortOrder: order }));
        }}
        className={pill}
      />
    </>
  );
}
