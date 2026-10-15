import { AlertCircle } from '@untitledui/icons';
import { EmptyState } from '@/components/feedback/EmptyState';
import { MonthSelector } from '@/components/MonthSelector';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { BudgetSummary } from '@/features/dashboard/BudgetSummary';
import { CategorySpendChart } from '@/features/dashboard/CategorySpendChart';
import { useGetDashboardQuery } from '@/features/dashboard/dashboardApi';
import { DashboardStats } from '@/features/dashboard/DashboardStats';
import { RecentExpenses } from '@/features/dashboard/RecentExpenses';
import { useMonthParam } from '@/lib/month';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0];
  const [month, setMonth] = useMonthParam();
  // currentData is empty while another month loads, so old numbers never show under a new label.
  const { currentData: summary, error, refetch } = useGetDashboardQuery(month);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's how your month is going."
        actions={<MonthSelector month={month} onChange={setMonth} />}
      />

      {error ? (
        <EmptyState
          tone="error"
          icon={AlertCircle}
          title="Couldn't load your dashboard"
          description={error.message}
          actions={<Button onClick={refetch}>Try again</Button>}
        />
      ) : (
        <div className="@container flex flex-col gap-6">
          <DashboardStats summary={summary} />
          <div className="grid gap-6 @3xl:grid-cols-2">
            <CategorySpendChart summary={summary} />
            <BudgetSummary month={month} summary={summary} />
          </div>
          <RecentExpenses month={month} summary={summary} />
        </div>
      )}
    </>
  );
}
