import { api } from '@/lib/api';
import type { DashboardSummary } from '@/types/api';

export const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Expense and budget mutations invalidate 'Dashboard', so this refetches after either.
    getDashboard: build.query<DashboardSummary, string>({
      query: (month) => ({ url: '/dashboard', params: { month } }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
