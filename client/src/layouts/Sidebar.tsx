import {
  CoinsStacked01,
  CreditCardDown,
  Grid01,
  PieChart03,
  Settings01,
  Tag01,
  Users01,
} from '@untitledui/icons';
import { NavLink } from 'react-router';
import { Logomark } from '@/components/Logo';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/types/icon';
import { AccountCard } from './AccountCard';

// `end` marks items that are only active on their exact path (Overview isn't active on
// /admin/categories); the rest stay active on nested routes like /expenses/:id.
type NavItem = { to: string; label: string; icon: IconComponent; end?: boolean };
type NavGroup = { title: string; items: NavItem[] };

// Admins get their own console rather than the personal-finance pages.
const userNav: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { to: '/dashboard', label: 'Overview', icon: Grid01 },
      { to: '/expenses', label: 'Expenses', icon: CreditCardDown },
      { to: '/budgets', label: 'Budgets', icon: CoinsStacked01 },
      { to: '/reports', label: 'Spending analytics', icon: PieChart03 },
    ],
  },
  { title: 'Preferences', items: [{ to: '/settings', label: 'Settings', icon: Settings01 }] },
];
const adminNav: NavGroup[] = [
  {
    title: 'Management',
    items: [
      { to: '/admin', label: 'Overview', icon: Grid01, end: true },
      { to: '/admin/users', label: 'Users', icon: Users01 },
      { to: '/admin/expenses', label: 'All expenses', icon: CreditCardDown },
      { to: '/admin/categories', label: 'Categories', icon: Tag01 },
    ],
  },
  { title: 'Account', items: [{ to: '/settings', label: 'Settings', icon: Settings01 }] },
];

function NavSection({ title, items, onNavigate }: NavGroup & { onNavigate?: () => void }) {
  return (
    <section className="flex flex-col gap-1 border-t border-secondary px-4 pt-5 pb-4">
      <h2 className="px-2 text-xs font-semibold tracking-wide text-quaternary uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'group flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold text-secondary transition hover:bg-primary_hover hover:text-secondary_hover',
                  isActive &&
                    'active bg-utility-brand-50 text-utility-brand-700 hover:bg-utility-brand-50 hover:text-utility-brand-700',
                )
              }
            >
              <Icon className="size-5 shrink-0 text-fg-quaternary group-[.active]:text-utility-brand-700" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Untitled sidebar content: logo with the console name, grouped nav for the user's role, then
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
  const groups = isAdmin ? adminNav : userNav;

  return (
    <div className={cn('flex h-full flex-col justify-between', className)}>
      <div>
        <div className="flex items-center gap-3 p-5">
          <Logomark size="md" />
          <div className="flex flex-col">
            <span className="text-base font-semibold text-primary">Retain</span>
            <span className="text-xs font-medium tracking-wide text-tertiary uppercase">
              {isAdmin ? 'Admin console' : 'Personal finance'}
            </span>
          </div>
        </div>
        <nav aria-label="Main">
          {groups.map((group) => (
            <NavSection key={group.title} {...group} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>
      <div className="px-4 pb-4">
        <AccountCard />
      </div>
    </div>
  );
}
