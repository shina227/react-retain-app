import { Outlet } from 'react-router';

// Untitled "simple" auth layout: a 360px column near the top of a plain page, no card.
export function AuthLayout() {
  return (
    <main className="flex min-h-svh flex-col items-center px-4 py-12 md:px-8 md:pt-24">
      <div className="flex w-full max-w-90 flex-col gap-8">
        <Outlet />
      </div>
    </main>
  );
}
