import { api } from '@/lib/api';
import type { AuthResponse, LoginInput, ProfileInput, RegisterInput, User } from '@/types/api';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginInput>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: build.mutation<AuthResponse, RegisterInput>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    updateMe: build.mutation<{ user: User }, ProfileInput>({
      query: (body) => ({ url: '/auth/me', method: 'PATCH', body }),
    }),
    me: build.query<{ user: User }, void>({
      query: () => '/auth/me',
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useUpdateMeMutation, useLazyMeQuery } =
  authApi;
