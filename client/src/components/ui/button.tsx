import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Slot } from 'radix-ui';

const secondary =
  'bg-primary text-secondary shadow-skeuomorphic inset-ring inset-ring-(--border-color-primary) hover:bg-primary_hover hover:text-secondary_hover aria-expanded:bg-primary_hover';

// Untitled UI buttons: primary, secondary, tertiary (ghost), destructive, link.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          'bg-brand-solid text-white shadow-skeuomorphic inset-ring-2 inset-ring-white/12 hover:bg-brand-solid_hover',
        secondary,
        outline: secondary,
        ghost:
          'text-tertiary hover:bg-primary_hover hover:text-tertiary_hover aria-expanded:bg-primary_hover',
        destructive:
          'bg-error-solid text-white shadow-skeuomorphic inset-ring-2 inset-ring-white/12 hover:bg-error-solid_hover',
        link: 'h-auto! p-0! text-brand-secondary underline-offset-4 hover:text-brand-secondary_hover hover:underline',
      },
      size: {
        xs: "h-8 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-4",
        sm: 'h-9 px-3',
        default: 'h-10 px-3.5',
        lg: 'h-11 px-4 text-base',
        xl: 'h-12 px-4.5 text-base',
        icon: 'size-10',
        'icon-xs': "size-8 [&_svg:not([class*='size-'])]:size-4",
        'icon-sm': 'size-9',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
