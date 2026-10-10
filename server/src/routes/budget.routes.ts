import { Router } from 'express';
import * as budgetController from '../controllers/budgetController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { budgetBodySchema, monthParamsSchema } from '../validators/budget.js';

export const budgetRouter = Router();

budgetRouter.use(requireAuth);

budgetRouter.get('/:month', validate({ params: monthParamsSchema }), budgetController.get);
budgetRouter.put(
  '/:month',
  validate({ params: monthParamsSchema, body: budgetBodySchema }),
  budgetController.set,
);
