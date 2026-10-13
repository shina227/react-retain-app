import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@/components/form/TextField';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { selectFilters, setFilter } from '@/store/expenseFiltersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { amountRangeSchema } from '../schemas';
import { FilterPill } from './FilterPill';
import { amountLabel } from './filterLabels';

type Range = { minAmount: number | null; maxAmount: number | null };

// "Amount: Any ⌄", opening a min / max form. Blank means no bound on that side.
export function AmountFilter({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const { minAmount, maxAmount } = useAppSelector(selectFilters);
  const [open, setOpen] = useState(false);
  const label = amountLabel(minAmount, maxAmount);

  const apply = (range: Range) => {
    dispatch(setFilter(range));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FilterPill label="Amount" active={!!label} className={className}>
          {label || 'Any'}
        </FilterPill>
      </PopoverTrigger>
      <PopoverContent>
        {/* Mounted only while open, so it always starts from the applied range. */}
        <AmountRangeForm range={{ minAmount, maxAmount }} onApply={apply} />
      </PopoverContent>
    </Popover>
  );
}

function AmountRangeForm({ range, onApply }: { range: Range; onApply: (range: Range) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(amountRangeSchema),
    mode: 'onTouched',
    defaultValues: {
      minAmount: range.minAmount?.toString() ?? '',
      maxAmount: range.maxAmount?.toString() ?? '',
    },
  });

  const amountField = (name: keyof Range, label: string, placeholder: string) => (
    <TextField
      id={`filter-${name}`}
      label={label}
      leading="RF"
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      error={errors[name]?.message}
      {...register(name, { deps: ['minAmount', 'maxAmount'] })}
    />
  );

  return (
    <form noValidate onSubmit={handleSubmit(onApply)} className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-primary">Amount range</p>
      <div className="grid grid-cols-2 gap-3">
        {amountField('minAmount', 'Min', 'No min')}
        {amountField('maxAmount', 'Max', 'No max')}
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-secondary pt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onApply({ minAmount: null, maxAmount: null })}
        >
          Clear
        </Button>
        <Button type="submit" size="sm">
          Apply
        </Button>
      </div>
    </form>
  );
}
