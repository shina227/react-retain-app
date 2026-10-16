import { api } from '@/lib/api';
import type { TrendPoint } from '@/types/api';

// How many months the trend chart covers, ending at the selected month.
export const TREND_MONTHS = 6;

export const reportsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Tagged 'Dashboard' so expense changes refresh it, like the dashboard summary.
    getTrend: build.query<TrendPoint[], string>({
      query: (month) => ({ url: '/reports/trend', params: { month, months: TREND_MONTHS } }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetTrendQuery } = reportsApi;
