import { z } from 'zod';
import { PaymentMethod } from '../generated/prisma/client.js';
import { money, optional, pagination, search } from './common.js';

const date = z.iso.date('Date must be YYYY-MM-DD');

// Used for create and for PUT (full replacement).
export const expenseBodySchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title is too long'),
  amount: money,
  categoryId: z.string().min(1, 'Category is required'),
  date,
  paymentMethod: z.enum(PaymentMethod, 'Choose a valid payment method'),
  notes: z.string().trim().max(500, 'Notes must be at most 500 characters').nullish(),
});

export const expenseListQuerySchema = z
  .object({
    search,
    categoryId: optional(z.string()),
    paymentMethod: optional(z.enum(PaymentMethod)),
    startDate: optional(date),
    endDate: optional(date),
    minAmount: optional(z.coerce.number().int().nonnegative()),
    maxAmount: optional(z.coerce.number().int().nonnegative()),
    sortBy: z.enum(['date', 'amount']).default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    ...pagination,
  })
  .refine((q) => !q.startDate || !q.endDate || q.startDate <= q.endDate, {
    path: ['endDate'],
    message: 'End date must be on or after the start date',
  })
  .refine(
    (q) => q.minAmount === undefined || q.maxAmount === undefined || q.minAmount <= q.maxAmount,
    {
      path: ['maxAmount'],
      message: 'Max amount must be at least the min amount',
    },
  );

export type ExpenseInput = z.infer<typeof expenseBodySchema>;
export type ExpenseListQuery = z.infer<typeof expenseListQuerySchema>;
