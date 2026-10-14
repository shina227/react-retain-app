import { zodResolver } from '@hookform/resolvers/zod';
import { Wallet02 } from '@untitledui/icons';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FeaturedIcon, FeaturedIconRings } from '@/components/feedback/FeaturedIcon';
import { FormAlert } from '@/components/form/FormAlert';
import { SubmitButton } from '@/components/form/SubmitButton';
import { TextField } from '@/components/form/TextField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatMoney, fromMinor } from '@/lib/format';
import { applyServerErrors } from '@/lib/forms';
import { formatMonth } from '@/lib/month';
import { amountSchema } from '@/features/expenses/schemas';
import { useSetBudgetMutation } from './budgetApi';

const budgetFormSchema = z.object({ amount: amountSchema });

type BudgetFormValues = z.input<typeof budgetFormSchema>;
type BudgetFormOutput = z.output<typeof budgetFormSchema>;

// Set or update one month's budget. The form only mounts while open, so it always starts
// from the current amount.
export function BudgetDialog({
  month,
  amount,
  open,
  onOpenChange,
}: {
  month: string;
  amount: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isEdit = amount !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="relative gap-1 px-4 pt-5 pr-14 pb-5 sm:px-6 sm:pt-6">
          <FeaturedIconRings className="-top-31 -left-32 sm:-top-30 sm:-left-30" />
          <FeaturedIcon icon={Wallet02} className="relative mb-3" />
          <DialogTitle className="relative">{isEdit ? 'Update budget' : 'Set budget'}</DialogTitle>
          <DialogDescription className="relative">
            Your spending limit for {formatMonth(month)}.
          </DialogDescription>
        </DialogHeader>
        <BudgetForm month={month} amount={amount} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function BudgetForm({
  month,
  amount,
  onDone,
}: {
  month: string;
  amount: number | null;
  onDone: () => void;
}) {
  const formId = useId();
  const [formError, setFormError] = useState<string | null>(null);
  const [setBudget] = useSetBudgetMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormValues, unknown, BudgetFormOutput>({
    resolver: zodResolver(budgetFormSchema),
    mode: 'onTouched',
    defaultValues: { amount: amount === null ? '' : fromMinor(amount) },
  });

  const onSubmit = handleSubmit(async (input) => {
    setFormError(null);
    try {
      await setBudget({ month, amount: input.amount }).unwrap();
      toast.success('Budget saved', {
        description: `${formatMonth(month)} · ${formatMoney(input.amount)}`,
      });
      onDone();
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <>
      <form
        id={formId}
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col gap-5 px-4 pb-6 sm:px-6"
      >
        {formError && <FormAlert>{formError}</FormAlert>}
        <TextField
          id="budget-amount"
          label="Monthly budget"
          leading="RF"
          inputMode="numeric"
          placeholder="0"
          autoComplete="off"
          autoFocus
          className="h-14 pl-13 text-display-xs font-semibold tabular-nums"
          error={errors.amount?.message}
          {...register('amount')}
        />
      </form>
      <DialogFooter className="grid grid-cols-2 gap-3 border-t border-secondary px-4 pt-4 pb-4 sm:px-6 sm:pb-6 [&>*]:w-full">
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <SubmitButton form={formId} pending={isSubmitting}>
          Save budget
        </SubmitButton>
      </DialogFooter>
    </>
  );
}
