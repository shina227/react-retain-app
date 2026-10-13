import { AlertTriangle, CheckCircle, MinusCircle, XCircle } from '@untitledui/icons';
import type { IconComponent } from '@/types/icon';
import { Badge } from '@/components/ui/badge';
import type { BudgetStatus } from '@/types/api';

// Status is never colour alone: each one also has its own icon and label.
const statuses: Record<
  BudgetStatus,
  { label: string; icon: IconComponent; variant: 'success' | 'warning' | 'destructive' | 'default' }
> = {
  within: { label: 'Within budget', icon: CheckCircle, variant: 'success' },
  approaching: { label: 'Approaching limit', icon: AlertTriangle, variant: 'warning' },
  over: { label: 'Over budget', icon: XCircle, variant: 'destructive' },
  none: { label: 'No budget set', icon: MinusCircle, variant: 'default' },
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
