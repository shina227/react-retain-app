import { AlertCircle } from '@untitledui/icons';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { Panel } from '@/components/Panel';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/features/admin/AdminTables';
import { useGetAdminUsersQuery } from '@/features/admin/adminApi';
import { ListSearch } from '@/features/admin/ListSearch';
import { useAdminList } from '@/features/admin/useAdminList';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
  const list = useAdminList();
  const { data, error, isFetching, refetch } = useGetAdminUsersQuery(list.query);

  return (
    <>
      <PageHeader title="Users" description="Everyone with a Retain account." />

      <Panel
        title="All users"
        description={data && `${data.total} ${data.total === 1 ? 'account' : 'accounts'}`}
        actions={<ListSearch label="Search users" value={list.search} onChange={list.setSearch} />}
      >
        {error ? (
          <EmptyState
            tone="error"
            icon={AlertCircle}
            title="Couldn't load the users"
            description={error.message}
            actions={<Button onClick={refetch}>Try again</Button>}
          />
        ) : (
          // Keeps the current page on screen, dimmed, while the next one loads.
          <div className={cn('transition-opacity', isFetching && data && 'opacity-60')}>
            <UsersTable
              users={data?.data}
              empty={list.isFiltered ? 'No users match your search.' : 'No users yet.'}
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
