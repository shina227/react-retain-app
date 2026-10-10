import { z } from 'zod';
import { currentMonth } from '../lib/month.js';
import { money, month } from './common.js';

export const monthParamsSchema = z.object({ month });

export const budgetBodySchema = z.object({ amount: money });

// Defaults to the current month when `?month=` is missing.
export const monthQuerySchema = z.object({ month: month.default(currentMonth) });

export type BudgetInput = z.infer<typeof budgetBodySchema>;
