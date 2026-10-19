import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import adminListsSlice from './adminListsSlice';
import expenseFiltersSlice from './expenseFiltersSlice';

// Redux holds server data (RTK Query) and every list's search, filters, sort and paging.
const rootReducer = combineSlices(api, expenseFiltersSlice, adminListsSlice);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
