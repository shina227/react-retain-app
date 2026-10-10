import { monthRange } from '../lib/month.js';
import { prisma } from '../lib/prisma.js';
import { include, toExpenseDto } from './expenseService.js';

export type BudgetStatus = 'within' | 'approaching' | 'over' | 'none';

// Under 80% → within, 80–100% → approaching, over 100% → over, no budget → none.
export function budgetStatus(spent: number, budget: number | null): BudgetStatus {
  if (budget === null) return 'none';
  const ratio = spent / budget;
  if (ratio > 1) return 'over';
  return ratio >= 0.8 ? 'approaching' : 'within';
}

// One month's summary for one user.
export async function getDashboard(userId: string, month: string) {
  const where = { userId, date: monthRange(month) };

  const [sum, budget, highest, groups, recent] = await Promise.all([
    prisma.expense.aggregate({ where, _sum: { amount: true } }),
    prisma.budget.findUnique({ where: { userId_month: { userId, month } } }),
    prisma.expense.findFirst({ where, include, orderBy: [{ amount: 'desc' }, { date: 'desc' }] }),
    prisma.expense.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true },
      _count: { _all: true },
      orderBy: { _sum: { amount: 'desc' } },
    }),
    prisma.expense.findMany({
      where,
      include,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: 5,
    }),
  ]);

  const categories = await prisma.category.findMany({
    where: { id: { in: groups.map((g) => g.categoryId) } },
    select: { id: true, name: true, color: true },
  });
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const totalSpent = sum._sum.amount ?? 0;
  const budgetAmount = budget?.amount ?? null;

  return {
    month,
    totalSpent,
    budget: budgetAmount,
    remaining: budgetAmount === null ? null : budgetAmount - totalSpent,
    percentUsed: budgetAmount === null ? null : Math.round((totalSpent / budgetAmount) * 1000) / 10,
    status: budgetStatus(totalSpent, budgetAmount),
    highestExpense: highest && toExpenseDto(highest),
    byCategory: groups.map((g) => ({
      category: categoryById.get(g.categoryId)!,
      total: g._sum.amount ?? 0,
      count: g._count._all,
    })),
    recent: recent.map(toExpenseDto),
  };
}
