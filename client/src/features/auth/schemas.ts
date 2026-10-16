import { z } from 'zod';

// Same rules as the server's validators/auth.ts, so most mistakes are caught before a request.
const name = z.string().trim().min(1, 'Enter your name').max(100, 'Name is too long');
const email = z.string().trim().pipe(z.email('Enter a valid email address'));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
});

export const registerSchema = z.object({
  name,
  email,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
});

export const profileSchema = z.object({ name, email });
