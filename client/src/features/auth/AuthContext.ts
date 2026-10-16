import { createContext, useContext } from 'react';
import type { LoginInput, ProfileInput, RegisterInput, User } from '@/types/api';

export interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean; // true while restoring a saved session on page load
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  updateProfile: (input: ProfileInput) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
