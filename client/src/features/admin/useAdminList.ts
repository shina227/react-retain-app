import { useEffect, useMemo, useState } from 'react';
import {
  selectAdminList,
  setAdminCategory,
  setAdminLimit,
  setAdminPage,
  setAdminSearch,
  toAdminListQuery,
  type AdminList,
} from '@/store/adminListsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const DEBOUNCE_MS = 300;

// An admin list page's search, filter and paging, read from and written to Redux.
// Only the search box's in-progress text is local; it reaches the store once typing pauses.
export function useAdminList(list: AdminList) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => selectAdminList(state, list));
  const [search, setSearch] = useState(filters.search);

  // Each keystroke restarts the timer, so the request goes out once typing pauses.
  useEffect(() => {
    const value = search.trim();
    if (value === filters.search) return;
    const timer = setTimeout(() => dispatch(setAdminSearch({ list, value })), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, filters.search, list, dispatch]);

  const query = useMemo(() => toAdminListQuery(filters), [filters]);

  return {
    query,
    search,
    categoryId: filters.categoryId,
    isFiltered: !!filters.search || !!filters.categoryId,
    setSearch,
    setPage: (value: number) => dispatch(setAdminPage({ list, value })),
    setCategoryId: (value: string) => dispatch(setAdminCategory({ list, value })),
    setLimit: (value: number) => dispatch(setAdminLimit({ list, value })),
  };
}
