import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';

// A page on its own, outside the app layout: the logo up top and a message centred below.
// Used by the 404 and error pages, which can show whether or not anyone is signed in.
export function FullPageMessage({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center px-4 py-12 md:pt-24">
      <Logo size="md" />
      <div className="flex w-full flex-1 items-center justify-center">{children}</div>
    </main>
  );
}
