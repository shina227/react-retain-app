import { z } from 'zod';

// Used for create and for PUT (full replacement).
export const categoryBodySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name is too long'),
  color: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Color must be a hex value like #4f46e5')
    .transform((c) => c.toLowerCase()),
});

export type CategoryInput = z.infer<typeof categoryBodySchema>;
