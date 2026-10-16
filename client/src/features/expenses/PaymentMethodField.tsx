import type { UseFormRegisterReturn } from 'react-hook-form';
import { FieldError, FieldLegend, FieldSet } from '@/components/ui/field';
import type { PaymentMethod } from '@/types/api';
import { paymentMethodIcons, paymentMethodLabels } from './constants';

const paymentMethods = Object.keys(paymentMethodLabels) as PaymentMethod[];

// Payment method as a native radio group styled as cards, so arrow keys and screen readers
// work as usual. Spread register('paymentMethod') into `registration`.
export function PaymentMethodField({
  registration,
  error,
}: {
  registration: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <FieldSet className="gap-0" data-invalid={!!error}>
      <FieldLegend variant="label" className="text-secondary">
        Payment method
      </FieldLegend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {paymentMethods.map((method) => {
          const Icon = paymentMethodIcons[method];
          return (
            <label
              key={method}
              className="flex cursor-pointer flex-col items-start gap-3 rounded-xl border border-secondary bg-primary p-3 shadow-xs transition hover:border-primary has-checked:border-brand has-checked:bg-utility-brand-50 has-checked:ring-1 has-checked:ring-(--border-color-brand) has-focus-visible:ring-4 has-focus-visible:ring-brand-500/24"
            >
              <input type="radio" value={method} className="peer sr-only" {...registration} />
              <span className="grid size-8 place-items-center rounded-lg border border-secondary bg-primary text-fg-quaternary shadow-xs peer-checked:border-transparent peer-checked:bg-brand-600 peer-checked:text-white">
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium text-secondary peer-checked:text-utility-brand-700">
                {paymentMethodLabels[method]}
              </span>
            </label>
          );
        })}
      </div>
      {error && <FieldError className="mt-1.5">{error}</FieldError>}
    </FieldSet>
  );
}
