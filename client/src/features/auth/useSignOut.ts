import { startTransition } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';

// Logs out and goes to /login in one transition, so ProtectedRoute never renders signed-out on
// the current page and remembers it as the next login's destination.
export function useSignOut() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return () =>
    startTransition(() => {
      logout();
      navigate('/login', { replace: true });
    });
}
