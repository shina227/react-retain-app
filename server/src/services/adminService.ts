import { Role } from '../generated/prisma/client.js';
import { currentMonth, monthRange } from '../lib/month.js';
import { prisma } from '../lib/prisma.js';
import { include, toExpenseDto } from './expenseService.js';

const TOP_N = 5;

// Platform-wide numbers for the admin dashboard. "Users" means regular users, not admins.
export async function getInsights() {
  const [totalUsers, totals, expensesThisMonth, categories, spend, recentExpenses, recentUsers] =
    await Promise.all([
      prisma.user.count({ where: { role: Role.USER } }),
      prisma.expense.aggregate({ _count: { _all: true }, _sum: { amount: true } }),
      prisma.expense.count({ where: { date: monthRange(currentMonth()) } }),
      prisma.category.findMany({
        select: { id: true, name: true, color: true, _count: { select: { expenses: true } } },
      }),
      prisma.expense.groupBy({ by: ['categoryId'], _sum: { amount: true } }),
      prisma.expense.findMany({
        include: { ...include, user: { select: { id: true, name: true } } },
        orderBy: [{ createdAt: 'desc' }, { date: 'desc' }],
        take: 10,
      }),
      prisma.user.findMany({
        where: { role: Role.USER },
        select: { id: true, name: true, email: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: TOP_N,
      }),
    ]);

  // Every category, including ones with no expenses (count 0, total 0).
  const spendById = new Map(spend.map((s) => [s.categoryId, s._sum.amount ?? 0]));
  const perCategory = categories.map(({ _count, ...category }) => ({
    ...category,
    count: _count.expenses,
    total: spendById.get(category.id) ?? 0,
  }));
  const byUsage = (direction: 1 | -1) =>
    [...perCategory]
      .sort((a, b) => direction * (a.count - b.count) || a.name.localeCompare(b.name))
      .slice(0, TOP_N);

  return {
    totalUsers,
    totalExpenses: totals._count._all,
    totalValue: totals._sum.amount ?? 0,
    expensesThisMonth,
    spendPerCategory: [...perCategory].sort((a, b) => b.total - a.total),
    top5: byUsage(-1),
    bottom5: byUsage(1),
    recentExpenses: recentExpenses.map(toExpenseDto),
    recentUsers,
  };
}
