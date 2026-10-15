import {
  AlertCircle,
  BankNote02,
  CalendarDate,
  PieChart03,
  Receipt,
  Users01,
} from '@untitledui/icons';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { AdminPanel } from '@/features/admin/AdminPanel';
import { useGetInsightsQuery } from '@/features/admin/adminApi';
import { CategoryUsage } from '@/features/admin/CategoryUsage';
import { RecentExpensesTable, RecentUsersTable } from '@/features/admin/RecentActivity';
import { Donut, DonutSkeleton } from '@/features/dashboard/CategorySpendChart';
import { toSlices } from '@/features/dashboard/slices';
import { formatMoney } from '@/lib/format';

export default function AdminOverviewPage() {
  const { data: insights, error, refetch } = useGetInsightsQuery();

  return (
    <>
      <PageHeader title="Overview" description="Platform-wide insights across every user." />

      {error ? (
        <EmptyState
          tone="error"
          icon={AlertCircle}
          title="Couldn't load the insights"
          description={error.message}
          actions={<Button onClick={refetch}>Try again</Button>}
        />
      ) : (
        <div className="@container flex flex-col gap-6">
          <section
            aria-label="Platform totals"
            className="grid gap-4 @xl:grid-cols-2 @5xl:grid-cols-4"
          >
            <StatCard
              icon={Users01}
              color="var(--color-brand-600)"
              label="Total users"
              value={insights?.totalUsers.toLocaleString()}
              caption="Registered accounts"
            />
            <StatCard
              icon={Receipt}
              color="#7a5af8"
              label="Total expenses"
              value={insights?.totalExpenses.toLocaleString()}
              caption="Recorded across all users"
            />
            <StatCard
              icon={BankNote02}
              color="var(--color-success-600)"
              label="Total value"
              value={insights && formatMoney(insights.totalValue)}
              caption="Sum of every expense"
            />
            <StatCard
              icon={CalendarDate}
              color="var(--color-warning-600)"
              label="Expenses this month"
              value={insights?.expensesThisMonth.toLocaleString()}
              caption="Dated in the current month"
            />
          </section>

          <div className="grid gap-6 @4xl:grid-cols-2">
            <AdminPanel title="Spend per category" description="Total value, all time">
              {!insights ? (
                <DonutSkeleton rows={8} />
              ) : insights.totalValue === 0 ? (
                <EmptyState
                  icon={PieChart03}
                  title="No spending yet"
                  description="Once users add expenses, you'll see where the money goes."
                />
              ) : (
                // Categories with no spend have no slice; they show up under "Least used".
                <Donut
                  slices={toSlices(
                    insights.spendPerCategory.filter((c) => c.total > 0),
                    insights.totalValue,
                    Infinity,
                  )}
                  total={insights.totalValue}
                />
              )}
            </AdminPanel>
            <CategoryUsage insights={insights} />
          </div>

          <AdminPanel title="Recent expenses" description="The 10 latest, across all users">
            <RecentExpensesTable expenses={insights?.recentExpenses} />
          </AdminPanel>
          <AdminPanel title="New users" description="The 5 most recent sign-ups">
            <RecentUsersTable users={insights?.recentUsers} />
          </AdminPanel>
        </div>
      )}
    </>
  );
}
