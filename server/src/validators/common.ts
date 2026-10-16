import { z } from 'zod';

const MAX_AMOUNT = 1_000_000_000; // RWF 1 billion; keeps us well inside Postgres Int

// A positive whole number of Rwandan francs (RWF has no subunit).
export const money = z
  .number()
  .int('Amount must be a whole number of francs')
  .positive('Amount must be greater than 0')
  .max(MAX_AMOUNT, 'Amount is too large');

// A calendar month, e.g. "2026-10".
export const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be YYYY-MM');

const MAX_LIMIT = 50;

// Treats empty query params (`?search=`) as not set.
export const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional());

export const search = optional(z.string().trim().max(100));

// `page` and `limit` for paginated lists; `limit` is clamped to 50.
export const pagination = {
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .default(10)
    .transform((n) => Math.min(n, MAX_LIMIT)),
};
