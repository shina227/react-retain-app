import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

// Untitled UI pill badges, on utility colours so they adapt to dark mode.
// Each colour also sets --dot for the optional status dot.
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full font-medium whitespace-nowrap ring-1 ring-inset [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'bg-utility-gray-50 text-utility-gray-700 ring-utility-gray-200 [--dot:var(--color-utility-gray-500)]',
        brand:
          'bg-utility-brand-50 text-utility-brand-700 ring-utility-brand-200 [--dot:var(--color-utility-brand-500)]',
        success:
          'bg-utility-success-50 text-utility-success-700 ring-utility-success-200 [--dot:var(--color-utility-success-500)]',
        warning:
          'bg-utility-warning-50 text-utility-warning-700 ring-utility-warning-200 [--dot:var(--color-utility-warning-500)]',
        destructive:
          'bg-utility-error-50 text-utility-error-700 ring-utility-error-200 [--dot:var(--color-utility-error-500)]',
        outline:
          'bg-primary text-secondary ring-(--border-color-primary) [--dot:var(--color-utility-gray-500)]',
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
