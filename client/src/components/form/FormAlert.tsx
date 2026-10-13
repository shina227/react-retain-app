import { CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

// Form-level error, for problems that don't belong to a single field.
export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-lg border border-error-300 bg-error-50 p-4 text-sm font-medium text-error-700"
    >
      <CircleAlert aria-hidden className="size-5 shrink-0 text-error-600" />
      {children}
    </div>
  );
}
