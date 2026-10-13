import { useLocation, useNavigate } from 'react-router';

// In-app links that open a panel (list → detail, detail → edit, Add expense) pass this state,
// so closing can step back to where the user was instead of stacking a new history entry.
export const canGoBack = { canGoBack: true } as const;

// Closes the panel: back to the previous view, or (after a refresh or a pasted link, when
// there's nothing of ours behind us) replace the panel URL with the list.
export function useCloseOverlay() {
  const navigate = useNavigate();
  const state = useLocation().state as typeof canGoBack | null;
  return () => (state?.canGoBack ? navigate(-1) : navigate('/expenses', { replace: true }));
}
