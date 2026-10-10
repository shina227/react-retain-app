import { prisma } from '../lib/prisma.js';
import type { BudgetInput } from '../validators/budget.js';

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
