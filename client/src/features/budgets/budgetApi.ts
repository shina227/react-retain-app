import { api } from '@/lib/api';
import type { Budget } from '@/types/api';

export const budgetApi = api.injectEndpoints({
  endpoints: (build) => ({
    // `month` is "YYYY-MM"; `amount` is null when no budget is set.
    getBudget: build.query<Budget, string>({
      query: (month) => `/budgets/${month}`,
      providesTags: (_result, _error, month) => [{ type: 'Budget', id: month }],
    }),
    // A new budget changes that month's remaining and status on the dashboard.
    setBudget: build.mutation<Budget, { month: string; amount: number }>({
      query: ({ month, amount }) => ({ url: `/budgets/${month}`, method: 'PUT', body: { amount } }),
      invalidatesTags: (_result, _error, { month }) => [{ type: 'Budget', id: month }, 'Dashboard'],
    }),
  }),
});

export const { useGetBudgetQuery, useSetBudgetMutation } = budgetApi;
