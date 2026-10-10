import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/features/auth/AuthContext';

// Placeholder until the dashboard is built (Wed Oct 14).
export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0];

  return (
    <PageHeader
      title={`Welcome back, ${firstName}`}
      description="Here's how your month is going."
    />
  );
}
