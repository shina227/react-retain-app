import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

// Untitled UI pill badges. Each colour also sets --dot for the optional status dot.
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full font-medium whitespace-nowrap ring-1 ring-inset [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-gray-50 text-gray-700 ring-gray-200 [--dot:var(--color-gray-500)]',
        brand: 'bg-brand-50 text-brand-700 ring-brand-200 [--dot:var(--color-brand-500)]',
        success: 'bg-success-50 text-success-700 ring-success-200 [--dot:var(--color-success-500)]',
        warning: 'bg-warning-50 text-warning-700 ring-warning-200 [--dot:var(--color-warning-500)]',
        destructive: 'bg-error-50 text-error-700 ring-error-200 [--dot:var(--color-error-500)]',
        outline: 'bg-white text-gray-700 ring-gray-300 [--dot:var(--color-gray-500)]',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  size = 'sm',
  dot = false,
  children,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { dot?: boolean }) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-(--dot)" />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
