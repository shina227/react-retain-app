import { Role, type Prisma } from '../generated/prisma/client.js';
import { currentMonth, monthRange } from '../lib/month.js';
import { prisma } from '../lib/prisma.js';
import type { Paginated } from '../types/api.js';
import type { AdminExpenseListQuery, AdminUserListQuery } from '../validators/admin.js';
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

const contains = (search: string) => ({ contains: search, mode: 'insensitive' as const });

const page = <T>(data: T[], total: number, q: { page: number; limit: number }): Paginated<T> => ({
  data,
  page: q.page,
  limit: q.limit,
  total,
  totalPages: Math.ceil(total / q.limit),
});

// Every account, newest first, with how many expenses each has and what they add up to.
export async function listUsers(q: AdminUserListQuery) {
  const where: Prisma.UserWhereInput = q.search
    ? { OR: [{ name: contains(q.search) }, { email: contains(q.search) }] }
    : {};

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { expenses: true } },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    }),
    prisma.user.count({ where }),
  ]);

  // Totals for just this page's users.
  const sums = await prisma.expense.groupBy({
    by: ['userId'],
    where: { userId: { in: users.map((u) => u.id) } },
    _sum: { amount: true },
  });
  const spentById = new Map(sums.map((s) => [s.userId, s._sum.amount ?? 0]));

  const data = users.map(({ _count, ...user }) => ({
    ...user,
    expenseCount: _count.expenses,
    totalSpent: spentById.get(user.id) ?? 0,
  }));
  return page(data, total, q);
}

// Expenses across every user, newest first. Search matches the title, notes or the owner.
export async function listExpenses(q: AdminExpenseListQuery) {
  const where: Prisma.ExpenseWhereInput = {
    categoryId: q.categoryId,
    ...(q.search && {
      OR: [
        { title: contains(q.search) },
        { notes: contains(q.search) },
        { user: { name: contains(q.search) } },
        { user: { email: contains(q.search) } },
      ],
    }),
  };

  const [rows, total] = await prisma.$transaction([
    prisma.expense.findMany({
      where,
      include: { ...include, user: { select: { id: true, name: true, email: true } } },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    }),
    prisma.expense.count({ where }),
  ]);
  return page(rows.map(toExpenseDto), total, q);
}
