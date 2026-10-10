import { z } from 'zod';

// A valid email address.
const email = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address'));

// Unknown keys (e.g. `role`) are stripped, so clients can never choose their own role.
export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  email,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'), // bcrypt ignores bytes past 72
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
