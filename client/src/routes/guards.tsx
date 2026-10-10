import { Navigate, Outlet, useLocation, type Location } from 'react-router';
import { FullPageLoader } from '@/components/FullPageLoader';
import { useAuth } from '@/features/auth/AuthContext';

// Signed-in users only. Remembers where the user was heading so login can send them back.
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

// Admins only; must sit inside ProtectedRoute. The API enforces the same rule with 403s.
export function AdminRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

// Login and register pages. Once signed in (including right after logging in),
// the user goes to the page they originally asked for, or the dashboard.
export function GuestRoute() {
  const { user, isLoading } = useAuth();
  const from = (useLocation().state as { from?: Location } | null)?.from;

  if (isLoading) return <FullPageLoader />;
  if (user) return <Navigate to={from ? `${from.pathname}${from.search}` : '/dashboard'} replace />;
  return <Outlet />;
}
