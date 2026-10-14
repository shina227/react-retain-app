import { MonthSelector } from '@/components/MonthSelector';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/features/auth/AuthContext';
import { useMonthParam } from '@/lib/month';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0];
  const [month, setMonth] = useMonthParam();

  return (
    <PageHeader
      title={`Welcome back, ${firstName}`}
      description="Here's how your month is going."
      actions={<MonthSelector month={month} onChange={setMonth} />}
    />
  );
}
