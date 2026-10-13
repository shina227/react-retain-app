// Mirrors the server's responses (see docs/api.md).
// Money is an integer number of Rwandan francs (RWF has no subunit); dates are YYYY-MM-DD.

export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export type PaymentMethod = 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'BANK_TRANSFER';

export interface CategorySummary {
  id: string;
  name: string;
  color: string;
}

export interface Category extends CategorySummary {
  isDefault: boolean;
}

export interface AdminCategory extends Category {
  createdAt: string;
  usageCount: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes: string | null;
  categoryId: string;
  category: CategorySummary;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  categoryId: string;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string | null;
}

export interface ExpenseQuery {
  search?: string;
  categoryId?: string;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Budget {
  month: string;
  amount: number | null;
}

export type BudgetStatus = 'within' | 'approaching' | 'over' | 'none';

export interface DashboardSummary {
  month: string;
  totalSpent: number;
  budget: number | null;
  remaining: number | null;
  percentUsed: number | null;
  status: BudgetStatus;
  highestExpense: Expense | null;
  byCategory: { category: CategorySummary; total: number; count: number }[];
  recent: Expense[];
}

export interface CategoryUsage extends CategorySummary {
  count: number;
  total: number;
}

export interface AdminInsights {
  totalUsers: number;
  totalExpenses: number;
  totalValue: number;
  expensesThisMonth: number;
  spendPerCategory: CategoryUsage[];
  top5: CategoryUsage[];
  bottom5: CategoryUsage[];
  recentExpenses: (Expense & { user: { id: string; name: string } })[];
  recentUsers: Omit<User, 'role'>[];
}

// Every failed request is normalised to this shape by lib/api.ts.
export interface ApiError {
  status: number; // 0 when the server couldn't be reached
  message: string;
  code: string;
  details?: Record<string, string[]>;
}
