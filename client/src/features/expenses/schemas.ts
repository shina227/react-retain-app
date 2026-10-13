import { z } from 'zod';
import { toMinor } from '@/lib/format';
import type { ExpenseInput } from '@/types/api';

const MAX_AMOUNT = 1_000_000_000;

// Same rules as the server's validators/expense.ts. The form holds strings; parsing turns
// them into the API body, so the submit handler receives an ExpenseInput directly.
export const expenseFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title').max(100, 'Keep the title under 100 characters'),
  // Typed as text so "12,550" works; RWF has no decimals, so only whole francs are allowed.
  amount: z
    .string()
    .transform((value) => value.replace(/[\s,]/g, ''))
    .pipe(
      z
        .string()
        .min(1, { message: 'Enter an amount', abort: true })
        .regex(/^\d+$/, 'Enter a whole number of francs')
        .transform(toMinor)
        .pipe(
          z
            .number()
            .positive('Amount must be greater than 0')
            .max(MAX_AMOUNT, 'Amount is too large'),
        ),
    ),
  categoryId: z.string().min(1, 'Choose a category'),
  date: z.iso.date('Choose a date'),
  paymentMethod: z.enum(
    ['CASH', 'CARD', 'MOBILE_MONEY', 'BANK_TRANSFER'],
    'Choose a payment method',
  ),
  notes: z
    .string()
    .trim()
    .max(500, 'Keep notes under 500 characters')
    .transform((notes) => notes || null),
}) satisfies z.ZodType<ExpenseInput, unknown>;

export type ExpenseFormValues = z.input<typeof expenseFormSchema>;
