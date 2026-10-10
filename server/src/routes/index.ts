import { Router } from 'express';
import { adminRouter } from './admin.routes.js';
import { authRouter } from './auth.routes.js';
import { budgetRouter } from './budget.routes.js';
import { categoryRouter } from './category.routes.js';
import { dashboardRouter } from './dashboard.routes.js';
import { expenseRouter } from './expense.routes.js';
import { healthRouter } from './health.routes.js';

// All API routes, mounted at /api.
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/expenses', expenseRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/budgets', budgetRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/admin', adminRouter);
