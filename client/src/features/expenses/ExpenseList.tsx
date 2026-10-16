import { Edit01, Trash01 } from '@untitledui/icons';
import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDate, formatDayLabel, formatMoney } from '@/lib/format';
import type { Expense } from '@/types/api';
import { CategoryAvatar, CategoryBadge } from './CategoryMarks';
import { paymentMethodLabels } from './constants';
import { DeleteExpenseDialog } from './DeleteExpenseDialog';
import { canGoBack } from './overlayNavigation';

interface Group {
  label: string | null;
  items: Expense[];
}

// Date-sorted lists are split into day groups (the API returns them in date order), and each
// row's second line shows its notes. Otherwise it's one flat group and the second line is the date.
function toGroups(expenses: Expense[], grouped: boolean): Group[] {
  if (!grouped) return [{ label: null, items: expenses }];

  const groups: Group[] = [];
  let current: (Group & { date: string }) | undefined;
  for (const expense of expenses) {
    if (current?.date !== expense.date) {
      current = { date: expense.date, label: formatDayLabel(expense.date), items: [] };
      groups.push(current);
    }
    current.items.push(expense);
  }
  return groups;
}

const subline = (expense: Expense, grouped: boolean) =>
  grouped ? expense.notes : formatDate(expense.date);

const amountClass = 'text-sm font-semibold whitespace-nowrap text-primary tabular-nums';

export function ExpenseList({ expenses, grouped }: { expenses: Expense[]; grouped: boolean }) {
  const groups = toGroups(expenses, grouped);
  const [toDelete, setToDelete] = useState<Expense | null>(null);

  return (
    <>
      <ExpenseTable groups={groups} grouped={grouped} onDelete={setToDelete} />
      <ExpenseMobileList groups={groups} grouped={grouped} />
      <DeleteExpenseDialog expense={toDelete} onClose={() => setToDelete(null)} />
    </>
  );
}

// Desktop: the whole row opens the expense; the title is the keyboard-focusable link, and the
// trailing delete and edit icons act on the row directly (as in the Untitled table).
function ExpenseTable({
  groups,
  grouped,
  onDelete,
}: {
  groups: Group[];
  grouped: boolean;
  onDelete: (expense: Expense) => void;
}) {
  const navigate = useNavigate();

  return (
    <Table className="hidden table-fixed md:table">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[40%]">Expense</TableHead>
          <TableHead>Category</TableHead>
          {/* Payment is the least important column, so it waits for wide screens (it's in the detail view). */}
          <TableHead className="hidden xl:table-cell">Payment</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-24">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map(({ label, items }) => (
          <Fragment key={label ?? 'all'}>
            {label && (
              // One cell per column rather than a colSpan: with the payment column hidden below
              // xl, a fixed span would invent a phantom column and leave a gap on the right.
              <TableRow className="hover:bg-transparent [&>*]:pt-4 [&>*]:pb-2">
                <th
                  scope="colgroup"
                  className="px-6 text-left text-xs font-semibold whitespace-nowrap text-tertiary"
                >
                  {label}
                </th>
                <td />
                <td className="hidden xl:table-cell" />
                <td />
                <td />
              </TableRow>
            )}
            {items.map((expense) => {
              const detail = subline(expense, grouped);
              return (
                <TableRow
                  key={expense.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/expenses/${expense.id}`, { state: canGoBack })}
                >
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <CategoryAvatar category={expense.category} />
                      <div className="min-w-0">
                        <Link
                          to={`/expenses/${expense.id}`}
                          state={canGoBack}
                          className="block truncate text-sm font-medium text-primary outline-none hover:underline focus-visible:underline"
                        >
                          {expense.title}
                        </Link>
                        {detail && <p className="truncate text-sm text-tertiary">{detail}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={expense.category} />
                  </TableCell>
                  <TableCell className="hidden text-sm xl:table-cell">
                    {paymentMethodLabels[expense.paymentMethod]}
                  </TableCell>
                  <TableCell className={`text-right ${amountClass}`}>
                    {formatMoney(expense.amount)}
                  </TableCell>
                  {/* Stops here so using an action doesn't also open the row. */}
                  <TableCell className="py-0 pl-0" onClick={(event) => event.stopPropagation()}>
                    <div className="flex justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${expense.title}`}
                        className="text-fg-quaternary hover:text-error-primary"
                        onClick={() => onDelete(expense)}
                      >
                        <Trash01 />
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        className="text-fg-quaternary hover:text-fg-quaternary_hover"
                      >
                        <Link
                          to={`/expenses/${expense.id}/edit`}
                          state={canGoBack}
                          aria-label={`Edit ${expense.title}`}
                        >
                          <Edit01 />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

// Mobile: banking-app rows (avatar, title over "category · payment", amount on the right).
function ExpenseMobileList({ groups, grouped }: { groups: Group[]; grouped: boolean }) {
  return (
    <div className="md:hidden">
      {groups.map(({ label, items }) => (
        <section key={label ?? 'all'} aria-label={label ?? undefined}>
          {label && (
            <h3 className="border-b border-secondary bg-secondary px-4 py-2 text-xs font-semibold text-tertiary">
              {label}
            </h3>
          )}
          <ul className="divide-y divide-(--border-color-secondary)">
            {items.map((expense) => (
              <li key={expense.id}>
                <Link
                  to={`/expenses/${expense.id}`}
                  state={canGoBack}
                  className="flex items-center gap-3 px-4 py-3 outline-none hover:bg-primary_hover focus-visible:bg-primary_hover focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset"
                >
                  <CategoryAvatar category={expense.category} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary">{expense.title}</p>
                    <p className="truncate text-sm text-tertiary">
                      {expense.category.name} · {paymentMethodLabels[expense.paymentMethod]}
                      {!grouped && ` · ${formatDate(expense.date)}`}
                    </p>
                  </div>
                  <span className={amountClass}>{formatMoney(expense.amount)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
