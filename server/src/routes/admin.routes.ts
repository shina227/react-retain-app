import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import * as categoryController from '../controllers/categoryController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { categoryBodySchema } from '../validators/category.js';

// Everything under /api/admin requires an ADMIN token.
export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/insights', adminController.insights);

adminRouter.get('/categories', categoryController.listWithUsage);
adminRouter.post('/categories', validate({ body: categoryBodySchema }), categoryController.create);
adminRouter.put(
  '/categories/:id',
  validate({ body: categoryBodySchema }),
  categoryController.update,
);
adminRouter.delete('/categories/:id', categoryController.remove);
