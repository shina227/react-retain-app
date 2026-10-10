import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// One line of the live password checklist; the circle turns green once the rule is met.
export function PasswordRequirement({ met, children }: { met: boolean; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm text-tertiary">
      <span
        className={cn(
          'grid size-5 shrink-0 place-items-center rounded-full text-white transition-colors',
          met ? 'bg-success-500' : 'bg-(--border-color-primary)',
        )}
      >
        <Check aria-hidden className="size-3" strokeWidth={3} />
      </span>
      {children}
      <span className="sr-only">{met ? '(met)' : '(not met)'}</span>
    </li>
  );
}
