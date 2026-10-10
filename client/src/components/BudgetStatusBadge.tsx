import { CircleCheck, CircleMinus, CircleX, TriangleAlert, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type BudgetStatus = 'within' | 'approaching' | 'over' | 'none';

// Status is never colour alone: each one also has its own icon and label.
const statuses: Record<
  BudgetStatus,
  { label: string; icon: LucideIcon; variant: 'success' | 'warning' | 'destructive' | 'default' }
> = {
  within: { label: 'Within budget', icon: CircleCheck, variant: 'success' },
  approaching: { label: 'Approaching limit', icon: TriangleAlert, variant: 'warning' },
  over: { label: 'Over budget', icon: CircleX, variant: 'destructive' },
  none: { label: 'No budget set', icon: CircleMinus, variant: 'default' },
};

export function BudgetStatusBadge({ status }: { status: BudgetStatus }) {
  const { label, icon: Icon, variant } = statuses[status];
  return (
    <Badge variant={variant} size="md">
      <Icon aria-hidden />
      {label}
    </Badge>
  );
}
