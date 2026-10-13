import { Menu02 } from '@untitledui/icons';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

// Untitled app shell: floating sidebar on desktop (lg+); below that a 56px top bar whose
// menu button opens the same sidebar as a drawer.
export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-svh">
      <aside className="sticky top-0 hidden h-svh w-70 shrink-0 py-1 pl-1 lg:block">
        <Sidebar className="rounded-xl border border-secondary bg-primary shadow-xs" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-secondary bg-primary pr-3 pl-4 lg:hidden">
          <Logo />
          <Sheet open={navOpen} onOpenChange={setNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open navigation">
                <Menu02 />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-70 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Sidebar onNavigate={() => setNavOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-8 pb-12 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
