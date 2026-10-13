import { Loader2 } from 'lucide-react';

export function FullPageLoader() {
  return (
    <div role="status" className="grid min-h-svh place-items-center">
      <Loader2 aria-hidden className="size-8 animate-spin text-brand-600" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
