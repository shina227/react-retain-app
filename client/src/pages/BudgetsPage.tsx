import { MonthSelector } from '@/components/MonthSelector';
import { PageHeader } from '@/components/PageHeader';
import { BudgetCard } from '@/features/budgets/BudgetCard';
import { BudgetHistory } from '@/features/budgets/BudgetHistory';
import { useMonthParam } from '@/lib/month';

export default function BudgetsPage() {
  const [month, setMonth] = useMonthParam();

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Set a monthly limit and see how each month went."
        actions={<MonthSelector month={month} onChange={setMonth} />}
      />
      <BudgetCard month={month} />
      <BudgetHistory selected={month} onSelect={setMonth} />
    </>
  );
}
