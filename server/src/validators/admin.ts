import { z } from 'zod';
import { optional, pagination, search } from './common.js';

export const adminUserListQuerySchema = z.object({ search, ...pagination });

export const adminExpenseListQuerySchema = z.object({
  search,
  categoryId: optional(z.string()),
  ...pagination,
});

export type AdminUserListQuery = z.infer<typeof adminUserListQuerySchema>;
export type AdminExpenseListQuery = z.infer<typeof adminExpenseListQuerySchema>;
