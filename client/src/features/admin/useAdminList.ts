import { useEffect, useState } from 'react';
import type { AdminListQuery } from '@/types/api';

const DEBOUNCE_MS = 300;

// Local state for an admin list page. It lives here rather than in Redux because it's scoped
// to one page and nothing else reads it. Any change other than the page goes back to page 1.
export function useAdminList() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Each keystroke restarts the timer, so the request goes out once typing pauses.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const query: AdminListQuery = {
    search: debouncedSearch,
    categoryId: categoryId || undefined,
    page,
    limit,
  };

  return {
    query,
    search,
    categoryId,
    isFiltered: !!debouncedSearch || !!categoryId,
    setPage,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    setCategoryId: (value: string) => {
      setCategoryId(value);
      setPage(1);
    },
    setLimit: (value: number) => {
      setLimit(value);
      setPage(1);
    },
  };
}
