import { AlertCircle } from '@untitledui/icons';
import { EmptyState } from '@/components/feedback/EmptyState';
import { MonthSelector } from '@/components/MonthSelector';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { useGetDashboardQuery } from '@/features/dashboard/dashboardApi';
import { CategoryBreakdown } from '@/features/reports/CategoryBreakdown';
import { MonthComparison } from '@/features/reports/MonthComparison';
import { useGetTrendQuery } from '@/features/reports/reportsApi';
import { SpendingTrend } from '@/features/reports/SpendingTrend';
import { useMonthParam } from '@/lib/month';

export default function ReportsPage() {
  const [month, setMonth] = useMonthParam();
  // The dashboard summary already has the month's spend by category, so it's reused here.
  // currentData is empty while another month loads, so old numbers never show under a new label.
  const summary = useGetDashboardQuery(month);
  const trend = useGetTrendQuery(month);
  const error = summary.error ?? trend.error;

  const retry = () => {
    if (summary.error) summary.refetch();
    if (trend.error) trend.refetch();
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description="Where your money goes, by category and over time."
        actions={<MonthSelector month={month} onChange={setMonth} />}
      />

      {error ? (
        <EmptyState
          tone="error"
          icon={AlertCircle}
          title="Couldn't load your reports"
          description={error.message}
          actions={<Button onClick={retry}>Try again</Button>}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <MonthComparison trend={trend.currentData} />
          <SpendingTrend trend={trend.currentData} month={month} />
          <CategoryBreakdown summary={summary.currentData} />
        </div>
      )}
    </>
  );
}
