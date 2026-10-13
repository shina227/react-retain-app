import {
  ChartPie,
  LayoutDashboard,
  PiggyBank,
  Receipt,
  Settings,
  ShieldCheck,
  Tags,
  type LucideIcon,
} from 'lucide-react';
import { NavLink } from 'react-router';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';
import { AccountCard } from './AccountCard';

// `end` marks items that are only active on their exact path (Overview isn't active on
// /admin/categories); the rest stay active on nested routes like /expenses/:id.
type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };

const mainNav: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/reports', label: 'Reports', icon: ChartPie },
];
const adminNav: NavItem[] = [
  { to: '/admin', label: 'Overview', icon: ShieldCheck, end: true },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
];
const footerNav: NavItem[] = [{ to: '/settings', label: 'Settings', icon: Settings }];

function NavSection({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-0.5 px-4">
      {items.map(({ to, label, icon: Icon, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
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

// Untitled sidebar content: logo, the main nav, an admin section for admins, then Settings and
// the account card pinned to the bottom.
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
              <h2 className="mt-5 mb-1 px-6 text-xs font-semibold text-quaternary">Admin</h2>
              <NavSection items={adminNav} onNavigate={onNavigate} />
            </>
          )}
        </nav>
      </div>
      <div className="flex flex-col gap-4 pb-4">
        <nav aria-label="Settings">
          <NavSection items={footerNav} onNavigate={onNavigate} />
        </nav>
        <div className="px-4">
          <AccountCard />
        </div>
      </div>
    </div>
  );
}
