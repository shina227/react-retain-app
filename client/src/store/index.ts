import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import expenseFiltersSlice from './expenseFiltersSlice';

// Redux holds server data (RTK Query) and the expense list's filters.
const rootReducer = combineSlices(api, expenseFiltersSlice);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
