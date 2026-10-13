import { NavLink, useLocation } from 'react-router';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/register', label: 'Sign up' },
  { to: '/login', label: 'Log in' },
];

// Title, description and the Sign up | Log in switcher (AuthLayout shows the logo).
// Links pass the router state on, so "where the user was going" survives switching.
export function AuthHeader({ title, description }: { title: string; description: string }) {
  const { state } = useLocation();

  return (
    <header className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
      <div className="flex flex-col gap-2 md:gap-3">
        <h1 className="text-xl font-semibold text-primary md:text-display-xs">{title}</h1>
        <p className="text-base text-tertiary">{description}</p>
      </div>
      <nav
        aria-label="Account"
        className="flex w-full gap-0.5 rounded-lg border border-secondary bg-secondary_alt"
      >
        {tabs.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            state={state}
            replace
            className={({ isActive }) =>
              cn(
                'flex h-9 flex-1 items-center justify-center rounded-lg border border-transparent text-sm font-semibold text-quaternary transition hover:text-tertiary_hover',
                isActive &&
                  'border-primary bg-primary_alt text-secondary shadow-xs hover:text-secondary',
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
