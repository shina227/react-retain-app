import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from '@untitledui/icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@/components/form/TextField';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { openDatePicker } from '@/lib/forms';
import { cn } from '@/lib/utils';
import { selectFilters, setFilter } from '@/store/expenseFiltersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { dateRangeSchema } from '../schemas';
import { activePreset, datePresets, presetRange } from './datePresets';
import { dateRangeLabel } from './filterLabels';

const segment =
  'flex h-8 items-center gap-1.5 rounded-md border border-transparent px-2.5 text-sm font-semibold whitespace-nowrap text-quaternary transition outline-none hover:text-tertiary_hover focus-visible:ring-4 focus-visible:ring-brand-500/24 aria-pressed:border-primary aria-pressed:bg-primary_alt aria-pressed:text-secondary aria-pressed:shadow-xs';

// Untitled segmented control: three presets plus a calendar for a custom range, which shows
// the range once one is applied.
export function DateFilter({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const { startDate, endDate } = useAppSelector(selectFilters);
  const active = activePreset({ startDate, endDate });
  const customLabel = active === 'custom' ? dateRangeLabel(startDate, endDate) : '';
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <div
      role="group"
      aria-label="Date range"
      className={cn(
        'flex shrink-0 gap-0.5 rounded-lg border border-secondary bg-secondary_alt p-0.5',
        className,
      )}
    >
      {datePresets.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-pressed={active === id}
          onClick={() => dispatch(setFilter(presetRange(id)))}
          className={segment}
        >
          {label}
        </button>
      ))}

      <Popover open={customOpen} onOpenChange={setCustomOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={customLabel ? `Custom range: ${customLabel}` : 'Custom range'}
            aria-pressed={active === 'custom'}
            className={segment}
          >
            <Calendar aria-hidden className="size-4" />
            {customLabel}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {/* Mounted only while open, so it always starts from the applied range. */}
          <DateRangeForm
            defaultValues={{ startDate, endDate }}
            onApply={(range) => {
              dispatch(setFilter(range));
              setCustomOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DateRangeForm({
  defaultValues,
  onApply,
}: {
  defaultValues: { startDate: string; endDate: string };
  onApply: (range: { startDate: string; endDate: string }) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(dateRangeSchema), mode: 'onTouched', defaultValues });

  const dateField = (name: 'startDate' | 'endDate', label: string) => (
    <TextField
      id={`filter-${name}`}
      label={label}
      type="date"
      icon={Calendar}
      className="[&::-webkit-calendar-picker-indicator]:hidden"
      onClick={(event) => openDatePicker(event.currentTarget)}
      error={errors[name]?.message}
      {...register(name, { deps: ['startDate', 'endDate'] })}
    />
  );

  return (
    <form noValidate onSubmit={handleSubmit(onApply)} className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-primary">Custom range</p>
      {dateField('startDate', 'From')}
      {dateField('endDate', 'To')}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onApply({ startDate: '', endDate: '' })}
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
