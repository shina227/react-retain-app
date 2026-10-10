import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

// Redux holds server data (RTK Query) and, from Tuesday, the expense filters slice.
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
