import { ChartColumn, Receipt, ShieldCheck, type LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';
import { AccountCard } from './AccountCard';

type NavItem = { to: string; label: string; icon: LucideIcon };

const mainNav: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: ChartColumn },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
];
const adminNav: NavItem[] = [{ to: '/admin', label: 'Admin', icon: ShieldCheck }];

function NavSection({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-0.5 px-4">
      {items.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex h-9 items-center gap-2 rounded-md p-2 text-sm font-semibold text-secondary transition hover:bg-primary_hover hover:text-secondary_hover',
                isActive && 'bg-active text-secondary_hover',
              )
            }
          >
            <Icon aria-hidden className="size-5 text-fg-quaternary" />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

// Untitled sidebar content: logo, nav sections split by dividers, account card at the bottom.
// Shared by the desktop sidebar and the mobile drawer; `onNavigate` closes the drawer.
export function Sidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const { isAdmin } = useAuth();

  return (
    <div className={cn('flex h-full flex-col justify-between', className)}>
      <div>
        <div className="p-5">
          <Logo />
        </div>
        <nav aria-label="Main">
          <NavSection items={mainNav} onNavigate={onNavigate} />
          {isAdmin && (
            <>
              <hr className="mx-4 my-2 border-secondary" />
              <NavSection items={adminNav} onNavigate={onNavigate} />
            </>
          )}
        </nav>
      </div>
      <div className="px-4 pb-4">
        <AccountCard />
      </div>
    </div>
  );
}
