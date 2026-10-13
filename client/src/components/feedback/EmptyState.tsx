import type { IconComponent } from '@/types/icon';
import type { ReactNode } from 'react';
import { FeaturedIcon } from './FeaturedIcon';

// Untitled empty state: featured icon, title, supporting text and actions, centred.
// The error tone swaps the bordered icon box for a red circle, as in the "Something went wrong" frame.
export function EmptyState({
  icon,
  title,
  description,
  actions,
  tone = 'default',
}: {
  icon: IconComponent;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  tone?: 'default' | 'error';
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className="flex flex-col items-center px-4 py-12 text-center md:py-16"
    >
      <FeaturedIcon icon={icon} tone={tone} className="mb-4" />
      <h2 className="text-base font-semibold text-primary">{title}</h2>
      <p className="mt-1 max-w-88 text-sm text-tertiary">{description}</p>
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
