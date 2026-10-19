import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminListQuery } from '@/types/api';

// Search, filter and paging for the admin list pages, one entry per list, so Redux is the
// single source of truth here too. `search` is the applied (debounced) text, not each keystroke.
export type AdminList = 'expenses' | 'users';

export interface AdminListFilters {
  search: string;
  categoryId: string;
  page: number;
  limit: number;
}

const initialList: AdminListFilters = { search: '', categoryId: '', page: 1, limit: 10 };

const initialState: Record<AdminList, AdminListFilters> = {
  expenses: initialList,
  users: initialList,
};

type ListPayload<T> = PayloadAction<{ list: AdminList; value: T }>;

// Any change other than the page goes back to page 1.
const adminListsSlice = createSlice({
  name: 'adminLists',
  initialState,
  reducers: {
    setAdminSearch: (state, { payload }: ListPayload<string>) => {
      Object.assign(state[payload.list], { search: payload.value, page: 1 });
    },
    setAdminCategory: (state, { payload }: ListPayload<string>) => {
      Object.assign(state[payload.list], { categoryId: payload.value, page: 1 });
    },
    setAdminPage: (state, { payload }: ListPayload<number>) => {
      state[payload.list].page = payload.value;
    },
    setAdminLimit: (state, { payload }: ListPayload<number>) => {
      Object.assign(state[payload.list], { limit: payload.value, page: 1 });
    },
  },
  selectors: {
    selectAdminList: (state, list: AdminList) => state[list],
  },
});

export const { setAdminSearch, setAdminCategory, setAdminPage, setAdminLimit } =
  adminListsSlice.actions;
export const { selectAdminList } = adminListsSlice.selectors;
export default adminListsSlice;

// The API query: an unset category is left out of the URL.
export const toAdminListQuery = (f: AdminListFilters): AdminListQuery => ({
  search: f.search,
  categoryId: f.categoryId || undefined,
  page: f.page,
  limit: f.limit,
});
