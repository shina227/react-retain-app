import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { Slot } from 'radix-ui';

const secondary =
  'bg-white text-gray-700 shadow-skeuomorphic hover:bg-gray-50 hover:text-gray-800 aria-expanded:bg-gray-50';

// Untitled UI buttons: primary, secondary (white, outlined), tertiary (ghost), destructive, link.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-skeuomorphic hover:bg-brand-700',
        secondary,
        outline: secondary,
        ghost: 'text-gray-600 hover:bg-gray-50 hover:text-gray-700 aria-expanded:bg-gray-50',
        destructive: 'bg-error-600 text-white shadow-skeuomorphic hover:bg-error-700',
        link: 'h-auto! p-0! text-brand-700 underline-offset-4 hover:text-brand-800 hover:underline',
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
