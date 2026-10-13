import { api } from '@/lib/api';
import type { Category, Expense, ExpenseInput, ExpenseList, ExpenseQuery } from '@/types/api';

// Any change to an expense also changes the dashboard totals and the admin insights.
const LIST = { type: 'Expense', id: 'LIST' } as const;
const derived = ['Dashboard', 'Admin'] as const;

export const expensesApi = api.injectEndpoints({
  endpoints: (build) => ({
    // The query object becomes the URL params; undefined values are left out.
    getExpenses: build.query<ExpenseList, ExpenseQuery>({
      query: (params) => ({ url: '/expenses', params }),
      providesTags: (result) => [
        LIST,
        ...(result?.data.map(({ id }) => ({ type: 'Expense' as const, id })) ?? []),
      ],
    }),
    getExpense: build.query<Expense, string>({
      query: (id) => `/expenses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Expense', id }],
    }),
    createExpense: build.mutation<Expense, ExpenseInput>({
      query: (body) => ({ url: '/expenses', method: 'POST', body }),
      invalidatesTags: [LIST, ...derived],
    }),
    updateExpense: build.mutation<Expense, { id: string; body: ExpenseInput }>({
      query: ({ id, body }) => ({ url: `/expenses/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Expense', id }, LIST, ...derived],
    }),
    // Only the list is invalidated: refetching the deleted id would just 404.
    deleteExpense: build.mutation<void, string>({
      query: (id) => ({ url: `/expenses/${id}`, method: 'DELETE' }),
      invalidatesTags: [LIST, ...derived],
    }),
    // For the category select. Admin category changes invalidate 'Category'.
    getCategories: build.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetCategoriesQuery,
} = expensesApi;
