import { ChevronSelectorVertical, LogOut01, Moon01, Sun } from '@untitledui/icons';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/AuthContext';
import { useSignOut } from '@/features/auth/useSignOut';
import { initials } from '@/lib/utils';

// Untitled "nav account card" at the bottom of the sidebar; opens the theme and log out menu.
export function AccountCard() {
  const { user, isAdmin } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const signOut = useSignOut();
  if (!user) return null;

  const isDark = resolvedTheme === 'dark';
  const ThemeIcon = isDark ? Sun : Moon01;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex w-full items-center gap-2 rounded-xl border border-secondary bg-primary_alt p-3 text-left transition hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tertiary text-base font-semibold text-quaternary ring-[0.75px] ring-black/10 ring-inset">
            {initials(user.name)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col pr-5 text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              <span className="truncate">{user.name}</span>
              {isAdmin && <Badge variant="brand">Admin</Badge>}
            </span>
            <span className="truncate text-tertiary">{user.email}</span>
          </span>
          <ChevronSelectorVertical
            aria-hidden
            className="absolute top-3 right-3 size-4 text-fg-quaternary"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" sideOffset={8}>
        <DropdownMenuItem onSelect={() => setTheme(isDark ? 'light' : 'dark')}>
          <ThemeIcon aria-hidden /> {isDark ? 'Light mode' : 'Dark mode'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut}>
          <LogOut01 aria-hidden /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
