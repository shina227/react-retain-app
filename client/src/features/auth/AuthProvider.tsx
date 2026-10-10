import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, setUnauthorizedHandler, tokenStorage } from '@/lib/api';
import { useAppDispatch } from '@/store/hooks';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types/api';
import { AuthContext } from './AuthContext';
import { useLazyMeQuery, useLoginMutation, useRegisterMutation } from './authApi';

// Owns the signed-in user. The only place that sets or clears the token.
export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => tokenStorage.get() !== null);
  const [loginRequest] = useLoginMutation();
  const [registerRequest] = useRegisterMutation();
  const [fetchMe] = useLazyMeQuery();

  // Drops the token and every cached response, so the next user starts clean.
  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    dispatch(api.util.resetApiState());
  }, [dispatch]);

  const startSession = useCallback(
    ({ token, user }: AuthResponse) => {
      tokenStorage.set(token);
      dispatch(api.util.resetApiState());
      setUser(user);
    },
    [dispatch],
  );

  // Any 401 on an authenticated request (expired or revoked token) signs the user out.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Restore the session after a refresh.
  useEffect(() => {
    if (!tokenStorage.get()) return;
    fetchMe()
      .unwrap()
      .then(({ user }) => setUser(user))
      .catch(() => {}) // a 401 already logged out; other errors leave the user on the login page
      .finally(() => setIsLoading(false));
  }, [fetchMe]);

  const login = useCallback(
    async (input: LoginInput) => startSession(await loginRequest(input).unwrap()),
    [loginRequest, startSession],
  );

  const register = useCallback(
    async (input: RegisterInput) => startSession(await registerRequest(input).unwrap()),
    [registerRequest, startSession],
  );

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === 'ADMIN', isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
