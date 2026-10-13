import { ChevronDown } from '@untitledui/icons';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// "Category: All ⌄": the trigger for every filter dropdown and popover. `active` tints it, so
// the row itself shows which filters are on. Spreads its props onto the button, so Radix
// triggers can use it with asChild.
export function FilterPill({
  label,
  active = false,
  children,
  className,
  ...props
}: ComponentProps<'button'> & { label: string; active?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-secondary bg-primary px-3 text-sm whitespace-nowrap shadow-xs transition outline-none hover:bg-primary_hover focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand-500/24 data-[state=open]:bg-primary_hover',
        active &&
          'border-utility-brand-200 bg-utility-brand-50 hover:bg-utility-brand-50 data-[state=open]:bg-utility-brand-50',
        className,
      )}
      {...props}
    >
      <span className="text-tertiary">{label}:</span>
      <span
        className={cn(
          'flex max-w-44 items-center gap-1.5 truncate font-semibold text-secondary',
          active && 'text-utility-brand-700',
        )}
      >
        {children}
      </span>
      <ChevronDown aria-hidden className="ml-auto size-4 text-fg-quaternary" />
    </button>
  );
}
