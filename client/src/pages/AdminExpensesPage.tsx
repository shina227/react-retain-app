import { AlertCircle } from '@untitledui/icons';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { Panel } from '@/components/Panel';
import { Button } from '@/components/ui/button';
import { ExpensesTable } from '@/features/admin/AdminTables';
import { useGetAdminExpensesQuery } from '@/features/admin/adminApi';
import { ListSearch } from '@/features/admin/ListSearch';
import { useAdminList } from '@/features/admin/useAdminList';
import { useGetCategoriesQuery } from '@/features/expenses/expensesApi';
import { FilterSelect } from '@/features/expenses/filters/FilterSelect';
import { cn } from '@/lib/utils';

export default function AdminExpensesPage() {
  const list = useAdminList();
  const { data, error, isFetching, refetch } = useGetAdminExpensesQuery(list.query);
  const { data: categories = [] } = useGetCategoriesQuery();

  return (
    <>
      <PageHeader title="All expenses" description="Expenses across every user." />

      <Panel
        title="All expenses"
        description={data && `${data.total} ${data.total === 1 ? 'expense' : 'expenses'}`}
        actions={
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <FilterSelect
              label="Category"
              allLabel="All"
              value={list.categoryId}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              onChange={list.setCategoryId}
            />
            <ListSearch
              label="Search expenses or users"
              value={list.search}
              onChange={list.setSearch}
            />
          </div>
        }
      >
        {error ? (
          <EmptyState
            tone="error"
            icon={AlertCircle}
            title="Couldn't load the expenses"
            description={error.message}
            actions={<Button onClick={refetch}>Try again</Button>}
          />
        ) : (
          // Keeps the current page on screen, dimmed, while the next one loads.
          <div className={cn('transition-opacity', isFetching && data && 'opacity-60')}>
            <ExpensesTable
              expenses={data?.data}
              rows={10}
              empty={list.isFiltered ? 'No expenses match these filters.' : 'No expenses yet.'}
            />
            {!!data?.total && (
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                pageSize={data.limit}
                onPageChange={list.setPage}
                onPageSizeChange={list.setLimit}
              />
            )}
          </div>
        )}
      </Panel>
    </>
  );
}
