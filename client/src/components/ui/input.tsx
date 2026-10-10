import * as React from 'react';
import { cn } from 'cn';

// Untitled input: 44px, 16px text, border-primary, brand ring on focus, error ring when invalid.
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-11 w-full min-w-0 rounded-lg border border-primary bg-primary px-3.5 text-base text-primary shadow-xs transition outline-none placeholder:text-placeholder focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand-500/24 disabled:cursor-not-allowed disabled:bg-secondary disabled:text-disabled aria-invalid:border-error_subtle aria-invalid:focus-visible:ring-error-500/24 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-secondary',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
