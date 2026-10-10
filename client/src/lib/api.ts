import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { ApiError } from '@/types/api';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';
const TOKEN_KEY = 'retain.token';

// The JWT lives in localStorage (see README for the XSS tradeoff).
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// AuthProvider registers this, so only the auth context ever clears the session.
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = tokenStorage.get();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

function toApiError(error: FetchBaseQueryError): ApiError {
  if (typeof error.status === 'number') {
    const body = (error.data as { error?: Omit<ApiError, 'status'> } | undefined)?.error;
    return {
      status: error.status,
      message: body?.message ?? 'Something went wrong. Try again.',
      code: body?.code ?? 'ERROR',
      details: body?.details,
    };
  }
  return {
    status: 0,
    message: "Couldn't reach the server. Check your connection and try again.",
    code: error.status,
  };
}

// Attaches the token, normalises errors to ApiError, and reports expired sessions.
export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (
  args,
  api,
  extraOptions,
) => {
  const hadToken = tokenStorage.get() !== null;
  const result = await rawBaseQuery(args, api, extraOptions);
  if (!result.error) return { data: result.data, meta: result.meta };

  // A 401 on a request that sent a token means the session is over (not just a wrong password).
  if (result.error.status === 401 && hadToken) onUnauthorized?.();
  return { error: toApiError(result.error), meta: result.meta };
};

// One API slice; each feature adds its endpoints with api.injectEndpoints.
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Expense', 'Category', 'Budget', 'Dashboard', 'Admin'],
  endpoints: () => ({}),
});

export const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' && error !== null && 'status' in error && 'message' in error;
