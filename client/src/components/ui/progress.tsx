import * as React from 'react';
import { cn } from 'cn';
import { Progress as ProgressPrimitive } from 'radix-ui';

// `value` is clamped to 0–100, so an over-budget 125% just shows a full bar.
function Progress({
  className,
  indicatorClassName,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }) {
  const percent = Math.min(Math.max(value ?? 0, 0), 100);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={percent}
      className={cn(
        'relative flex h-2 w-full items-center overflow-x-hidden rounded-full bg-gray-200',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          'size-full flex-1 rounded-full bg-primary transition-all',
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
