import { monthRange } from '../lib/month.js';
import { prisma } from '../lib/prisma.js';
import type { BudgetInput } from '../validators/budget.js';
import { budgetStatus } from './dashboardService.js';

// Every month the user has set a budget for, newest first, with what was spent against it.
// One small sum per budget is fine: a user has at most a few dozen months.
export async function listBudgets(userId: string) {
  const budgets = await prisma.budget.findMany({ where: { userId }, orderBy: { month: 'desc' } });

  return Promise.all(
    budgets.map(async ({ month, amount }) => {
      const sum = await prisma.expense.aggregate({
        where: { userId, date: monthRange(month) },
        _sum: { amount: true },
      });
      const spent = sum._sum.amount ?? 0;
      return {
        month,
        amount,
        spent,
        remaining: amount - spent,
        status: budgetStatus(spent, amount),
      };
    }),
  );
}

// `amount` is null when no budget is set for that month.
export async function getBudget(userId: string, month: string) {
  const budget = await prisma.budget.findUnique({ where: { userId_month: { userId, month } } });
  return { month, amount: budget?.amount ?? null };
}

// One budget per user per month: creates it, or updates the existing one.
export async function setBudget(userId: string, month: string, { amount }: BudgetInput) {
  await prisma.budget.upsert({
    where: { userId_month: { userId, month } },
    create: { userId, month, amount },
    update: { amount },
  });
  return { month, amount };
}
