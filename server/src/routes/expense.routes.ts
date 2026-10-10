import { Router } from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { expenseBodySchema, expenseListQuerySchema } from '../validators/expense.js';

export const expenseRouter = Router();

expenseRouter.use(requireAuth);

expenseRouter.get('/', validate({ query: expenseListQuerySchema }), expenseController.list);
expenseRouter.post('/', validate({ body: expenseBodySchema }), expenseController.create);
expenseRouter.get('/:id', expenseController.get);
expenseRouter.put('/:id', validate({ body: expenseBodySchema }), expenseController.update);
expenseRouter.delete('/:id', expenseController.remove);
