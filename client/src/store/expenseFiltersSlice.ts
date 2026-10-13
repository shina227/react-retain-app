import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { PAGE_SIZE } from '@/features/expenses/constants';
import { toMinor } from '@/lib/format';
import type { ExpenseQuery, PaymentMethod } from '@/types/api';

// The expense list's whole query lives here, so Redux is its single source of truth.
// Unset text/select filters are '' (what the inputs hold); unset amounts are null.
// Amounts are in francs as typed; the query selector converts them to stored minor units.
export interface ExpenseFilters {
  search: string;
  categoryId: string;
  paymentMethod: PaymentMethod | '';
  startDate: string;
  endDate: string;
  minAmount: number | null;
  maxAmount: number | null;
  sortBy: NonNullable<ExpenseQuery['sortBy']>;
  sortOrder: NonNullable<ExpenseQuery['sortOrder']>;
  page: number;
  limit: number;
}

type FilterFields = Omit<ExpenseFilters, 'sortBy' | 'sortOrder' | 'page' | 'limit'>;

const emptyFilters: FilterFields = {
  search: '',
  categoryId: '',
  paymentMethod: '',
  startDate: '',
  endDate: '',
  minAmount: null,
  maxAmount: null,
};

const initialState: ExpenseFilters = {
  ...emptyFilters,
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  limit: PAGE_SIZE,
};

// Anything that changes which expenses match (or how many fit on a page) starts again at page 1.
const expenseFiltersSlice = createSlice({
  name: 'expenseFilters',
  initialState,
  reducers: {
    // Partial, so a range (start + end date, min + max amount) updates in one go.
    setFilter: (state, { payload }: PayloadAction<Partial<FilterFields>>) => {
      Object.assign(state, payload, { page: 1 });
    },
    setSort: (state, { payload }: PayloadAction<Pick<ExpenseFilters, 'sortBy' | 'sortOrder'>>) => {
      Object.assign(state, payload, { page: 1 });
    },
    setPage: (state, { payload }: PayloadAction<number>) => {
      state.page = payload;
    },
    setLimit: (state, { payload }: PayloadAction<number>) => {
      Object.assign(state, { limit: payload, page: 1 });
    },
    // "Clear all" removes the filters but keeps the chosen sort and page size.
    clearFilters: (state) => {
      Object.assign(state, emptyFilters, { page: 1 });
    },
  },
  selectors: {
    selectFilters: (state) => state,
  },
});

export const { setFilter, setSort, setPage, setLimit, clearFilters } = expenseFiltersSlice.actions;
export const { selectFilters } = expenseFiltersSlice.selectors;
export default expenseFiltersSlice;

// One per removable chip: a date range or an amount range counts once.
export const selectActiveFilterCount = createSelector(
  selectFilters,
  (f) =>
    [
      f.search.trim(),
      f.categoryId,
      f.paymentMethod,
      f.startDate || f.endDate,
      f.minAmount !== null || f.maxAmount !== null,
    ].filter(Boolean).length,
);

// The API query: empty values dropped (RTK Query leaves undefined out of the URL), amounts in
// minor units. Memoized, so the list only refetches when the query actually changes.
export const selectExpenseQueryArgs = createSelector(
  selectFilters,
  (f) =>
    ({
      search: f.search.trim() || undefined,
      categoryId: f.categoryId || undefined,
      paymentMethod: f.paymentMethod || undefined,
      startDate: f.startDate || undefined,
      endDate: f.endDate || undefined,
      minAmount: f.minAmount === null ? undefined : toMinor(f.minAmount),
      maxAmount: f.maxAmount === null ? undefined : toMinor(f.maxAmount),
      sortBy: f.sortBy,
      sortOrder: f.sortOrder,
      page: f.page,
      limit: f.limit,
    }) satisfies ExpenseQuery,
);
