import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CategoryBadge } from '@/features/expenses/CategoryMarks';
import { formatDate, formatMoney } from '@/lib/format';
import { initials } from '@/lib/utils';
import type { AdminInsights, AdminUser, Expense } from '@/types/api';

// Placeholder rows while a table loads. `columns` holds each column's class, so columns
// hidden at this width are hidden in the skeleton too.
function SkeletonRows({ rows, columns }: { rows: number; columns: (string | undefined)[] }) {
  return Array.from({ length: rows }, (_, row) => (
    <TableRow key={row} className="hover:bg-transparent">
      {columns.map((className, col) => (
        <TableCell key={col} className={className}>
          <Skeleton className="h-4 w-24" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function EmptyRow({ columns, children }: { columns: number; children: string }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columns} className="py-10 text-center">
        {children}
      </TableCell>
    </TableRow>
  );
}

// Initials avatar and name, with the email underneath when given.
function UserCell({ name, email }: { name: string; email?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-full bg-tertiary text-xs font-semibold text-tertiary"
      >
        {initials(name)}
      </span>
      <div className="min-w-0">
        <p className="truncate font-medium text-primary">{name}</p>
        {email && <p className="truncate">{email}</p>}
      </div>
    </div>
  );
}

// Columns that only show from a given width; the title cell picks up what they hide.
const expenseColumns = {
  user: 'hidden md:table-cell',
  category: 'hidden sm:table-cell',
  date: 'hidden xl:table-cell',
};

// Expenses across users: the overview's 10 most recent, and the All expenses page.
export function ExpensesTable({
  expenses,
  empty = 'No expenses yet.',
  rows = 5,
}: {
  expenses?: (Expense & { user: { name: string } })[];
  empty?: string;
  rows?: number;
}) {
  return (
    <Table aria-busy={!expenses}>
      <TableHeader>
        <TableRow>
          <TableHead className={expenseColumns.user}>User</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className={expenseColumns.category}>Category</TableHead>
          <TableHead className={expenseColumns.date}>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!expenses ? (
          <SkeletonRows
            rows={rows}
            columns={[
              expenseColumns.user,
              undefined,
              expenseColumns.category,
              expenseColumns.date,
              undefined,
            ]}
          />
        ) : !expenses.length ? (
          <EmptyRow columns={5}>{empty}</EmptyRow>
        ) : (
          expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className={expenseColumns.user}>
                <UserCell name={expense.user.name} />
              </TableCell>
              {/* The date (and on phones, the user) moves under the title as columns drop off. */}
              <TableCell className="max-w-48 sm:max-w-64">
                <p className="truncate text-secondary">{expense.title}</p>
                <p className="truncate xl:hidden">
                  <span className="md:hidden">{expense.user.name} · </span>
                  {formatDate(expense.date)}
                </p>
              </TableCell>
              <TableCell className={expenseColumns.category}>
                <CategoryBadge category={expense.category} />
              </TableCell>
              <TableCell className={expenseColumns.date}>{formatDate(expense.date)}</TableCell>
              <TableCell className="text-right font-medium text-primary tabular-nums">
                {formatMoney(expense.amount)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

// The 5 newest accounts. createdAt is a full timestamp; its date part is what "joined" shows.
export function RecentUsersTable({ users }: { users?: AdminInsights['recentUsers'] }) {
  return (
    <Table aria-busy={!users}>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead className="text-right">Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!users ? (
          <SkeletonRows rows={5} columns={[undefined, undefined]} />
        ) : !users.length ? (
          <EmptyRow columns={2}>No users yet.</EmptyRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="max-w-56 sm:max-w-none">
                <UserCell name={user.name} email={user.email} />
              </TableCell>
              <TableCell className="text-right">
                {formatDate(user.createdAt.slice(0, 10))}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

// Every account with its activity. Expense count and join date drop off on narrow screens.
export function UsersTable({ users, empty }: { users?: AdminUser[]; empty: string }) {
  return (
    <Table aria-busy={!users}>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead className="hidden sm:table-cell">Role</TableHead>
          <TableHead className="hidden text-right md:table-cell">Expenses</TableHead>
          <TableHead className="text-right">Total spent</TableHead>
          <TableHead className="hidden text-right xl:table-cell">Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!users ? (
          <SkeletonRows
            rows={10}
            columns={[
              undefined,
              'hidden sm:table-cell',
              'hidden md:table-cell',
              undefined,
              'hidden xl:table-cell',
            ]}
          />
        ) : !users.length ? (
          <EmptyRow columns={5}>{empty}</EmptyRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              {/* On phones the role column hides; admins keep a badge by their name instead. */}
              <TableCell className="max-w-48 sm:max-w-64">
                <div className="flex items-center gap-2">
                  <UserCell name={user.name} email={user.email} />
                  {user.role === 'ADMIN' && (
                    <Badge variant="brand" className="sm:hidden">
                      Admin
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {user.role === 'ADMIN' ? (
                  <Badge variant="brand">Admin</Badge>
                ) : (
                  <Badge variant="outline">User</Badge>
                )}
              </TableCell>
              <TableCell className="hidden text-right tabular-nums md:table-cell">
                {user.expenseCount}
              </TableCell>
              <TableCell className="text-right font-medium text-primary tabular-nums">
                {formatMoney(user.totalSpent)}
              </TableCell>
              <TableCell className="hidden text-right xl:table-cell">
                {formatDate(user.createdAt.slice(0, 10))}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
