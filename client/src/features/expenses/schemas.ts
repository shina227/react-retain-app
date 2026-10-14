import { z } from 'zod';
import { toMinor } from '@/lib/format';
import type { ExpenseInput } from '@/types/api';

const MAX_AMOUNT = 1_000_000_000;

const paymentMethodSchema = z.enum(
  ['CASH', 'CARD', 'MOBILE_MONEY', 'BANK_TRANSFER'],
  'Choose a payment method',
);

// Typed as text so "12,550" works; RWF has no decimals, so only whole francs are allowed.
// Shared with the budget form, which has the same server rules.
export const amountSchema = z
  .string()
  .transform((value) => value.replace(/[\s,]/g, ''))
  .pipe(
    z
      .string()
      .min(1, { message: 'Enter an amount', abort: true })
      .regex(/^\d+$/, 'Enter a whole number of francs')
      .transform(toMinor)
      .pipe(
        z.number().positive('Amount must be greater than 0').max(MAX_AMOUNT, 'Amount is too large'),
      ),
  );

// Same rules as the server's validators/expense.ts. The form holds strings; parsing turns
// them into the API body, so the submit handler receives an ExpenseInput directly.
export const expenseFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title').max(100, 'Keep the title under 100 characters'),
  amount: amountSchema,
  categoryId: z.string().min(1, 'Choose a category'),
  date: z.iso.date('Choose a date'),
  paymentMethod: paymentMethodSchema,
  notes: z
    .string()
    .trim()
    .max(500, 'Keep notes under 500 characters')
    .transform((notes) => notes || null),
}) satisfies z.ZodType<ExpenseInput, unknown>;

export type ExpenseFormValues = z.input<typeof expenseFormSchema>;

// Filter forms. Same rules as the server's list query: ranges must run low to high.

export const searchSchema = z.object({
  search: z.string().max(100, 'Keep the search under 100 characters'),
});

// Blank means "no bound": '' becomes null.
const optionalFrancs = z
  .string()
  .transform((value) => value.replace(/[\s,]/g, ''))
  .pipe(z.string().regex(/^\d*$/, 'Enter a whole number of francs'))
  .transform((value) => (value ? Number(value) : null));

export const amountRangeSchema = z
  .object({ minAmount: optionalFrancs, maxAmount: optionalFrancs })
  .refine((r) => r.minAmount === null || r.maxAmount === null || r.minAmount <= r.maxAmount, {
    message: 'Max must be at least the min',
    path: ['maxAmount'],
  });

const isoDate = z.iso.date();
const optionalDate = z
  .string()
  .refine((value) => !value || isoDate.safeParse(value).success, 'Choose a valid date');

export const dateRangeSchema = z
  .object({ startDate: optionalDate, endDate: optionalDate })
  .refine((r) => !r.startDate || !r.endDate || r.startDate <= r.endDate, {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  });
