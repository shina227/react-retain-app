import type { ReactNode } from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { FilterPill } from './FilterPill';

// Radix items can't have an empty value, so "All" travels as this and becomes ''.
const ALL = '__all__';

// A dropdown in pill form: "Category: All ⌄". With `allLabel`, the first option clears the
// filter (''), and the pill is tinted while something else is chosen.
export function FilterSelect({
  label,
  value,
  options,
  allLabel,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: { value: string; label: ReactNode }[];
  allLabel?: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Select
      value={value || (allLabel ? ALL : undefined)}
      onValueChange={(next) => onChange(next === ALL ? '' : next)}
    >
      <SelectPrimitive.Trigger asChild>
        <FilterPill label={label} active={!!allLabel && !!value} className={className}>
          <SelectValue />
        </FilterPill>
      </SelectPrimitive.Trigger>
      <SelectContent position="popper" align="start" className="min-w-44 p-1">
        {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
