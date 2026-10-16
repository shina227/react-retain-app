import { api } from '@/lib/api';
import type {
  AdminCategory,
  AdminExpense,
  AdminInsights,
  AdminListQuery,
  AdminUser,
  Category,
  Paginated,
} from '@/types/api';

export type CategoryInput = { name: string; color: string };

// Category changes affect every category dropdown ('Category') and the insights charts ('Admin').
const invalidates = ['Category', 'Admin'] as const;

export const adminApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Expense mutations also invalidate 'Admin', so the insights stay current.
    getInsights: build.query<AdminInsights, void>({
      query: () => '/admin/insights',
      providesTags: ['Admin'],
    }),
    getAdminUsers: build.query<Paginated<AdminUser>, AdminListQuery>({
      query: (params) => ({ url: '/admin/users', params }),
      providesTags: ['Admin'],
    }),
    getAdminExpenses: build.query<Paginated<AdminExpense>, AdminListQuery>({
      query: (params) => ({ url: '/admin/expenses', params }),
      providesTags: ['Admin'],
    }),
    getAdminCategories: build.query<AdminCategory[], void>({
      query: () => '/admin/categories',
      providesTags: ['Category', 'Admin'],
    }),
    createCategory: build.mutation<Category, CategoryInput>({
      query: (body) => ({ url: '/admin/categories', method: 'POST', body }),
      invalidatesTags: invalidates,
    }),
    updateCategory: build.mutation<Category, CategoryInput & { id: string }>({
      query: ({ id, ...body }) => ({ url: `/admin/categories/${id}`, method: 'PUT', body }),
      invalidatesTags: invalidates,
    }),
    deleteCategory: build.mutation<{ reassignedCount: number }, string>({
      query: (id) => ({ url: `/admin/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: invalidates,
    }),
  }),
});

export const {
  useGetInsightsQuery,
  useGetAdminUsersQuery,
  useGetAdminExpensesQuery,
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = adminApi;
