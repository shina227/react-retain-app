import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { monthQuerySchema } from '../validators/budget.js';

export const dashboardRouter = Router();

dashboardRouter.get(
  '/',
  requireAuth,
  validate({ query: monthQuerySchema }),
  dashboardController.get,
);
