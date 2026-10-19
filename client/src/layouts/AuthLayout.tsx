import { Outlet } from 'react-router';
import { Logo } from '@/components/Logo';
import { AuthShowcase } from '@/features/auth/AuthShowcase';

// Untitled "split" auth layout. Below lg: logo and a 360px column near the top, no card.
// From lg: logo top-left, form centred in the left half, brand panel on the right.
export function AuthLayout() {
  return (
    <main className="flex min-h-svh">
      <div className="flex flex-1 flex-col items-center gap-8 px-4 py-12 md:px-8 md:pt-24 lg:items-stretch lg:gap-0 lg:pt-8 lg:pb-8">
        <Logo size="md" className="lg:self-start" />
        <div className="flex w-full flex-1 justify-center lg:items-center lg:py-12 lg:short:py-0">
          <div className="flex w-full max-w-90 flex-col gap-8">
            <Outlet />
          </div>
        </div>
      </div>
      <AuthShowcase className="sticky top-4 m-4 ml-0 hidden h-[calc(100svh-2rem)] lg:flex lg:w-1/2" />
    </main>
  );
}
