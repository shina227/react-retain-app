import { z } from 'zod';

// A display name.
const name = z.string().trim().min(1, 'Name is required').max(100, 'Name is too long');

// A valid email address.
const email = z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address'));

// Unknown keys (e.g. `role`) are stripped, so clients can never choose their own role.
export const registerSchema = z.object({
  name,
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

// Profile edits. Like register, unknown keys (role, password) are stripped.
export const profileSchema = z.object({ name, email });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
