import { z } from 'zod';
import { currentMonth } from '../lib/month.js';
import { month } from './common.js';

// The trend ends at `month` (default: this month) and covers the `months` before it, inclusive.
export const trendQuerySchema = z.object({
  month: month.default(currentMonth),
  months: z.coerce.number().int().min(1).max(12).default(6),
});

export type TrendQuery = z.infer<typeof trendQuerySchema>;
