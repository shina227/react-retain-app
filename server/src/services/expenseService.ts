import type { Prisma } from '../generated/prisma/client.js';
import { AppError } from '../lib/AppError.js';
import { prisma } from '../lib/prisma.js';
import type { Paginated } from '../types/api.js';
import type { ExpenseInput, ExpenseListQuery } from '../validators/expense.js';

export const include = { category: { select: { id: true, name: true, color: true } } } as const;

type ExpenseWithCategory = Prisma.ExpenseGetPayload<{ include: typeof include }>;

const toDate = (value?: string) => (value ? new Date(value) : undefined);

// Sends `date` back as `YYYY-MM-DD` and drops the owner id.
export const toExpenseDto = <T extends ExpenseWithCategory>({
  date,
  userId: _userId,
  ...rest
}: T) => ({
  ...rest,
  date: date.toISOString().slice(0, 10),
});

export type ExpenseDto = ReturnType<typeof toExpenseDto<ExpenseWithCategory>>;

async function toData({ categoryId, date, notes, ...rest }: ExpenseInput) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw AppError.badRequest('Category does not exist', 'INVALID_CATEGORY');
  return { ...rest, categoryId, date: new Date(date), notes: notes || null };
}

// A page of expenses plus totals over every match (not just this page), for the stat cards.
export type ExpenseList = Paginated<ExpenseDto> & { summary: { totalAmount: number } };

export async function listExpenses(userId: string, q: ExpenseListQuery): Promise<ExpenseList> {
  const where: Prisma.ExpenseWhereInput = {
    userId,
    categoryId: q.categoryId,
    paymentMethod: q.paymentMethod,
    date: { gte: toDate(q.startDate), lte: toDate(q.endDate) },
    amount: { gte: q.minAmount, lte: q.maxAmount },
    ...(q.search && {
      OR: [
        { title: { contains: q.search, mode: 'insensitive' } },
        { notes: { contains: q.search, mode: 'insensitive' } },
      ],
    }),
  };

  const [rows, totals] = await prisma.$transaction([
    prisma.expense.findMany({
      where,
      include,
      // createdAt and id break ties so pages never overlap.
      orderBy: [{ [q.sortBy]: q.sortOrder }, { createdAt: q.sortOrder }, { id: q.sortOrder }],
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    }),
    // One query for both the count and the sum of every matching expense.
    prisma.expense.aggregate({ where, _count: true, _sum: { amount: true } }),
  ]);
  const total = totals._count;

  return {
    data: rows.map(toExpenseDto),
    page: q.page,
    limit: q.limit,
    total,
    totalPages: Math.ceil(total / q.limit),
    // SUM over no rows is null.
    summary: { totalAmount: totals._sum.amount ?? 0 },
  };
}

export async function getExpense(userId: string, id: string) {
  const expense = await prisma.expense.findFirst({ where: { id, userId }, include });
  if (!expense) throw AppError.notFound('Expense not found');
  return toExpenseDto(expense);
}

export async function createExpense(userId: string, input: ExpenseInput) {
  const expense = await prisma.expense.create({
    data: { ...(await toData(input)), userId },
    include,
  });
  return toExpenseDto(expense);
}

// `where: { id, userId }` throws P2025 (→ 404) when the expense isn't the user's.
export async function updateExpense(userId: string, id: string, input: ExpenseInput) {
  const expense = await prisma.expense.update({
    where: { id, userId },
    data: await toData(input),
    include,
  });
  return toExpenseDto(expense);
}

export async function deleteExpense(userId: string, id: string) {
  await prisma.expense.delete({ where: { id, userId } });
}
