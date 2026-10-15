import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// The card every overview section sits in: titled header (with optional actions), then the content.
export function AdminPanel({
  title,
  description,
  actions,
  className,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <section
      aria-labelledby={id}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-secondary bg-primary shadow-xs',
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary px-4 py-5 md:px-6">
        <div className="min-w-0">
          <h2 id={id} className="text-lg font-semibold text-primary">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-sm text-tertiary">{description}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}
