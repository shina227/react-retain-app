import * as React from 'react';
import { cn } from 'cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-11 w-full min-w-0 rounded-lg border border-input bg-white px-3.5 text-base text-gray-900 shadow-xs transition outline-none placeholder:text-gray-500 focus-visible:border-brand-300 focus-visible:ring-4 focus-visible:ring-brand-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 aria-invalid:border-error-300 aria-invalid:focus-visible:ring-error-100 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-gray-700',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
