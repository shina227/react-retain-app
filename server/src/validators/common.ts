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
