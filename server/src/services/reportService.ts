import { monthRange, shiftMonth } from '../lib/month.js';
import { prisma } from '../lib/prisma.js';

// Total spent per month for the `months` months ending at `month`, oldest first.
// Months with no expenses are included with a total of 0.
export async function getTrend(userId: string, month: string, months: number) {
  const list = Array.from({ length: months }, (_, i) => shiftMonth(month, i - months + 1));

  return Promise.all(
    list.map(async (m) => {
      const sum = await prisma.expense.aggregate({
        where: { userId, date: monthRange(m) },
        _sum: { amount: true },
      });
      return { month: m, total: sum._sum.amount ?? 0 };
    }),
  );
}
