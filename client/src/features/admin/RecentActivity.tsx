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
import type { AdminInsights } from '@/types/api';

// Placeholder rows while the insights load, matching the table's column count.
function SkeletonRows({ rows, columns }: { rows: number; columns: number }) {
  return Array.from({ length: rows }, (_, row) => (
    <TableRow key={row} className="hover:bg-transparent">
      {Array.from({ length: columns }, (_, col) => (
        <TableCell key={col}>
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

function UserCell({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-full bg-tertiary text-xs font-semibold text-tertiary"
      >
        {initials(name)}
      </span>
      <span className="font-medium text-primary">{name}</span>
    </div>
  );
}

// The 10 most recently added expenses, across every user.
export function RecentExpensesTable({ expenses }: { expenses?: AdminInsights['recentExpenses'] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="hidden xl:table-cell">Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!expenses ? (
          <SkeletonRows rows={5} columns={5} />
        ) : !expenses.length ? (
          <EmptyRow columns={5}>No expenses yet.</EmptyRow>
        ) : (
          expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>
                <UserCell name={expense.user.name} />
              </TableCell>
              {/* Below xl the date moves under the title, so the table fits without scrolling. */}
              <TableCell className="max-w-64">
                <p className="truncate text-secondary">{expense.title}</p>
                <p className="xl:hidden">{formatDate(expense.date)}</p>
              </TableCell>
              <TableCell>
                <CategoryBadge category={expense.category} />
              </TableCell>
              <TableCell className="hidden xl:table-cell">{formatDate(expense.date)}</TableCell>
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!users ? (
          <SkeletonRows rows={5} columns={3} />
        ) : !users.length ? (
          <EmptyRow columns={3}>No users yet.</EmptyRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <UserCell name={user.name} />
              </TableCell>
              <TableCell>{user.email}</TableCell>
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
