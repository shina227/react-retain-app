import * as React from 'react';
import { cn } from 'cn';

// Untitled textarea: same border, focus ring and error states as Input.
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-28 w-full min-w-0 resize-y rounded-lg border border-primary bg-primary px-3.5 py-3 text-base text-primary shadow-xs transition outline-none placeholder:text-placeholder focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand-500/24 disabled:cursor-not-allowed disabled:bg-secondary disabled:text-disabled aria-invalid:border-error_subtle aria-invalid:focus-visible:ring-error-500/24',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
