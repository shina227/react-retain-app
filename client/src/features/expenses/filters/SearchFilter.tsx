import { zodResolver } from '@hookform/resolvers/zod';
import { SearchLg, XClose } from '@untitledui/icons';
import { useEffect, useEffectEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { selectFilters, setFilter } from '@/store/expenseFiltersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { searchSchema } from '../schemas';

const DEBOUNCE_MS = 300;

// Search as a one-field form: typing applies it after a short pause (Enter applies it at once),
// "/" anywhere on the page jumps here, and "Clear all" elsewhere empties the box.
export function SearchFilter() {
  const dispatch = useAppDispatch();
  const applied = useAppSelector((state) => selectFilters(state).search);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
    mode: 'onChange',
    defaultValues: { search: applied },
  });
  const value = useWatch({ control, name: 'search' });
  const error = errors.search?.message;

  // Runs through the zod schema first, so an invalid search is never sent.
  const submit = handleSubmit(({ search }) => dispatch(setFilter({ search })));
  const apply = useEffectEvent(() => submit());

  // Debounce: each keystroke restarts the timer.
  useEffect(() => {
    if (value === applied) return;
    const timer = setTimeout(apply, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, applied]);

  // The store changed from elsewhere (Clear all, a removed chip): show that in the box.
  const syncFromStore = useEffectEvent(() => {
    if (value !== applied) reset({ search: applied });
  });
  useEffect(() => syncFromStore(), [applied]);

  const focusSearch = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
    if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
    event.preventDefault();
    setFocus('search');
  });
  useEffect(() => {
    document.addEventListener('keydown', focusSearch);
    return () => document.removeEventListener('keydown', focusSearch);
  }, []);

  return (
    // Compact on wide screens, like the inspo; it grows while focused or holding a search.
    <form
      role="search"
      noValidate
      onSubmit={submit}
      className={cn(
        'relative min-w-0 flex-1 transition-[width] duration-200 lg:w-32 lg:flex-none lg:focus-within:w-60',
        value && 'lg:w-60',
      )}
    >
      <SearchLg
        aria-hidden
        className="pointer-events-none absolute top-2 left-3 size-5 text-fg-quaternary"
      />
      <Input
        type="search"
        aria-label="Search expenses"
        placeholder="Search"
        autoComplete="off"
        aria-invalid={!!error}
        aria-describedby={error ? 'expense-search-error' : undefined}
        className="h-9 pr-10 pl-10 text-sm [&::-webkit-search-cancel-button]:hidden"
        {...register('search')}
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            reset({ search: '' });
            dispatch(setFilter({ search: '' }));
            setFocus('search');
          }}
          className="absolute top-1.5 right-2 grid size-6 place-items-center rounded-md text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover"
        >
          <XClose className="size-4" />
        </button>
      ) : (
        <kbd
          aria-hidden
          className="pointer-events-none absolute top-2 right-2.5 grid h-5 min-w-5 place-items-center rounded border border-secondary px-1 font-sans text-xs font-medium text-quaternary"
        >
          /
        </kbd>
      )}
      {error && (
        <p id="expense-search-error" role="alert" className="mt-1.5 text-sm text-error-primary">
          {error}
        </p>
      )}
    </form>
  );
}
