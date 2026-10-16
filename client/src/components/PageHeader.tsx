import type { ReactNode } from 'react';

// Untitled page header: 20px title with optional supporting text; actions sit on the right
// and wrap underneath on narrow screens. It also sets the browser tab title (React hoists
// <title> into <head>); `tabTitle` overrides it when the heading is not a page name.
export function PageHeader({
  title,
  tabTitle = title,
  description,
  actions,
}: {
  title: string;
  tabTitle?: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      <title>{`${tabTitle} · Retain`}</title>
      <div className="flex min-w-0 flex-1 basis-80 flex-col gap-0.5">
        <h1 className="text-xl font-semibold text-primary">{title}</h1>
        {description && <p className="text-base text-tertiary">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
